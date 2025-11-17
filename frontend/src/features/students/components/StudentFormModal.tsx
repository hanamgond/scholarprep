import { useEffect, useMemo, useState } from "react";
// This path must be correct
import type { CreateStudentInput, UpdateStudentInput } from "../types/student"; 

type Props = {
  open: boolean;
  mode?: "create" | "edit";
  initial?: Partial<CreateStudentInput>;
  error?: string; // top-level error from parent (optional)
  onClose: () => void;
  onSubmit: (payload: CreateStudentInput | UpdateStudentInput) => Promise<void> | void;
};

type FieldErrors = Partial<Record<keyof CreateStudentInput, string>>;

/** Safely extract a human-readable error message without using `any`. */
function getErrMessage(e: unknown): string {
  if (typeof e === "string") return e;
  if (e instanceof Error && typeof e.message === "string") return e.message;

  if (typeof e === "object" && e !== null) {
    const maybe = e as {
      response?: { data?: { message?: unknown } };
      message?: unknown;
    };

    const respMsg = maybe.response?.data?.message;
    if (typeof respMsg === "string") return respMsg;
    if (Array.isArray(respMsg) && respMsg.every((x) => typeof x === "string")) {
      return (respMsg as string[]).join(", ");
    }
    if (typeof maybe.message === "string") return maybe.message;
  }
  return "Something went wrong. Please try again.";
}

export default function StudentFormModal({
  open,
  mode = "create",
  initial,
  error,
  onClose,
  onSubmit,
}: Props) {
  // Stable empty form using useMemo to satisfy react-hooks/exhaustive-deps
  const emptyForm = useMemo<CreateStudentInput>(
    () => ({
      name: "",
      admission_no: "", // Added missing field
      rollNumber: "",
      className: "",
      section: "",
      dob: "",
      fatherName: "",
      motherName: "",
      contactNumber: "",
      email: "",
      address: "",
      gender: "",
    }),
    []
  );

  const [form, setForm] = useState<CreateStudentInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [topError, setTopError] = useState<string | undefined>(error);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // reflect parent-level error (if any)
  useEffect(() => {
    setTopError(error);
  }, [error]);

  // prefill when editing OR reset when creating
  useEffect(() => {
    if (initial && mode === "edit") {
      setForm({
        name: initial.name ?? "",
        admission_no: initial.admission_no ?? "", // Added missing field
        rollNumber: initial.rollNumber ?? "",
        className: initial.className ?? "",
        section: initial.section ?? "",
        dob: initial.dob ?? "",
        fatherName: initial.fatherName ?? "",
        motherName: initial.motherName ?? "",
        contactNumber: initial.contactNumber ?? "",
        email: initial.email ?? "",
        address: initial.address ?? "",
        gender: initial.gender ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial, mode, open, emptyForm]);

  if (!open) return null;

  // Strongly-typed field setter
  function setField<K extends keyof CreateStudentInput>(key: K, value: string) {
    setForm((prev: CreateStudentInput) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // Map backend duplicate errors to specific fields (email/rollNumber)
  // 👇 THIS IS THE FIX (was msg?:.string)
  function parseAndSetErrors(msg?: string) {
    const fe: FieldErrors = {};
    if (!msg) {
      setTopError("Something went wrong. Please try again.");
      return;
    }
    if (/roll\s*number/i.test(msg)) fe.rollNumber = "Roll number already exists";
    if (/email/i.test(msg)) fe.email = "Email already exists";
    setFieldErrors(fe);

    if (!fe.rollNumber && !fe.email) setTopError(msg);
    else setTopError(undefined);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTopError(undefined);
    setFieldErrors({});
    try {
      const payload: CreateStudentInput | UpdateStudentInput = {
        name: form.name,
        admission_no: form.admission_no, // Added missing field
        rollNumber: form.rollNumber,
        className: form.className,
        section: form.section,
        dob: form.dob,
        fatherName: form.fatherName,
        motherName: form.motherName,
        contactNumber: form.contactNumber,
        email: form.email,
        address: form.address,
        gender: form.gender,
      };
      await onSubmit(payload);
    } catch (err: unknown) {
      parseAndSetErrors(getErrMessage(err));
      return;
    } finally {
      setSubmitting(false);
    }
  }

  const input = "border rounded w-full px-2 py-2";
  const label = "block text-sm text-gray-700";
  const err = "text-red-600 text-xs mt-1";

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">
          {mode === "edit" ? "Edit Student" : "Add Student"}
        </h2>

        {topError && <div className="text-red-700 text-sm mb-2">{topError}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={label}>Name*</label>
            <input className={input} value={form.name} onChange={(e) => setField("name", e.target.value)} required />
            {fieldErrors.name && <div className={err}>{fieldErrors.name}</div>}
          </div>

          {/* Added new input field for Admission Number */}
          <div>
            <label className={label}>Admission Number*</label>
            <input className={input} value={form.admission_no} onChange={(e) => setField("admission_no", e.target.value)} required />
            {fieldErrors.admission_no && <div className={err}>{fieldErrors.admission_no}</div>}
          </div>

          <div>
            <label className={label}>Roll Number*</label>
            <input className={input} value={form.rollNumber} onChange={(e) => setField("rollNumber", e.target.value)} required />
            {fieldErrors.rollNumber && <div className={err}>{fieldErrors.rollNumber}</div>}
          </div>

          <div>
            <label className={label}>Class*</label>
            <input className={input} value={form.className} onChange={(e) => setField("className", e.target.value)} required />
            {fieldErrors.className && <div className={err}>{fieldErrors.className}</div>}
          </div>

          <div>
            <label className={label}>Section</label>
            <input className={input} value={form.section ?? ""} onChange={(e) => setField("section", e.target.value)} />
            {fieldErrors.section && <div className={err}>{fieldErrors.section}</div>}
          </div>

          <div>
            <label className={label}>Date of Birth</label>
            <input type="date" className={input} value={form.dob ?? ""} onChange={(e) => setField("dob", e.target.value)} />
            {fieldErrors.dob && <div className={err}>{fieldErrors.dob}</div>}
          </div>

          <div>
            <label className={label}>Father's Name</label>
            <input className={input} value={form.fatherName ?? ""} onChange={(e) => setField("fatherName", e.target.value)} />
            {fieldErrors.fatherName && <div className={err}>{fieldErrors.fatherName}</div>}
          </div>

          <div>
            <label className={label}>Mother's Name</label>
            <input className={input} value={form.motherName ?? ""} onChange={(e) => setField("motherName", e.target.value)} />
            {fieldErrors.motherName && <div className={err}>{fieldErrors.motherName}</div>}
          </div>

          <div>
            <label className={label}>Contact Number</label>
            <input className={input} value={form.contactNumber ?? ""} onChange={(e) => setField("contactNumber", e.target.value)} />
            {fieldErrors.contactNumber && <div className={err}>{fieldErrors.contactNumber}</div>}
          </div>

          <div className="md:col-span-2">
            <label className={label}>Email*</label>
            <input type="email" className={input} value={form.email} onChange={(e) => setField("email", e.target.value)} required />
            {fieldErrors.email && <div className={err}>{fieldErrors.email}</div>}
          </div>

          <div className="md:col-span-2">
            <label className={label}>Address</label>
            <input className={input} value={form.address ?? ""} onChange={(e) => setField("address", e.target.value)} />
            {fieldErrors.address && <div className={err}>{fieldErrors.address}</div>}
          </div>

          <div>
            <label className={label}>Gender</label>
            <select className={input} value={form.gender ?? ""} onChange={(e) => setField("gender", e.target.value)}>
              <option value="">Select…</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {fieldErrors.gender && <div className={err}>{fieldErrors.gender}</div>}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" disabled={submitting}>
            {submitting ? "Saving..." : mode === "edit" ? "Save changes" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}