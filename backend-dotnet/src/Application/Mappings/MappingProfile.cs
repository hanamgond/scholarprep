using Application.DTO.Academic;
using Application.DTO.Core;
using Application.DTO.Academic;
using Application.DTO.Core;
using AutoMapper;
using Domain.Academic.Entities;
using Domain.Core.Entities;
using Domain.Enums.Academic;
using Domain.Enums.Core;

namespace Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // --------------------------
        // CLASS MAPPINGS
        // --------------------------
        CreateMap<Class, ClassDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.CampusId, opt => opt.MapFrom(src => src.CampusId))
            .ForMember(dest => dest.TenantId, opt => opt.MapFrom(src => src.TenantId))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive));

        CreateMap<CreateClassDto, Class>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.CampusId, opt => opt.MapFrom(src => src.CampusId));

        CreateMap<UpdateClassDto, Class>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));

        // --------------------------
        // SECTION MAPPINGS
        // --------------------------
        CreateMap<Section, SectionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.ClassId, opt => opt.MapFrom(src => src.ClassId))
            .ForMember(dest => dest.CampusId, opt => opt.MapFrom(src => src.CampusId))
            .ForMember(dest => dest.TenantId, opt => opt.MapFrom(src => src.TenantId));

        CreateMap<CreateSectionDto, Section>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.ClassId, opt => opt.MapFrom(src => src.ClassId));


        // --------------------------
        // STUDENT MAPPINGS
        // --------------------------
        CreateMap<Student, StudentDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.TenantId, opt => opt.MapFrom(src => src.TenantId))
            .ForMember(dest => dest.CampusId, opt => opt.MapFrom(src => src.CampusId))
            .ForMember(dest => dest.ClassId, opt => opt.MapFrom(src => src.ClassId))
            .ForMember(dest => dest.SectionId, opt => opt.MapFrom(src => src.SectionId))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
            .ForMember(dest => dest.AdmissionNo, opt => opt.MapFrom(src => src.AdmissionNo))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.RollNumber, opt => opt.MapFrom(src => src.RollNumber))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.FatherName, opt => opt.MapFrom(src => src.FatherName))
            .ForMember(dest => dest.FatherMobile, opt => opt.MapFrom(src => src.FatherMobile))
            .ForMember(dest => dest.MotherName, opt => opt.MapFrom(src => src.MotherName))
            .ForMember(dest => dest.MotherMobile, opt => opt.MapFrom(src => src.MotherMobile))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<CreateStudentDto, Student>()
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
            .ForMember(dest => dest.AdmissionNo, opt => opt.MapFrom(src => src.AdmissionNo))
            .ForMember(dest => dest.ClassId, opt => opt.MapFrom(src => src.ClassId))
            .ForMember(dest => dest.SectionId, opt => opt.MapFrom(src => src.SectionId))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.RollNumber, opt => opt.MapFrom(src => src.RollNumber))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.FatherName, opt => opt.MapFrom(src => src.FatherName))
            .ForMember(dest => dest.FatherMobile, opt => opt.MapFrom(src => src.FatherMobile))
            .ForMember(dest => dest.MotherName, opt => opt.MapFrom(src => src.MotherName))
            .ForMember(dest => dest.MotherMobile, opt => opt.MapFrom(src => src.MotherMobile))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => StudentStatus.Active));


        // --------------------------
        // ENROLLMENT MAPPINGS
        // --------------------------
        CreateMap<Enrollment, EnrollmentDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.TenantId, opt => opt.MapFrom(src => src.TenantId))
            .ForMember(dest => dest.CampusId, opt => opt.MapFrom(src => src.CampusId))
            .ForMember(dest => dest.StudentId, opt => opt.MapFrom(src => src.StudentId))
            .ForMember(dest => dest.ClassId, opt => opt.MapFrom(src => src.ClassId))
            .ForMember(dest => dest.SectionId, opt => opt.MapFrom(src => src.SectionId))
            .ForMember(dest => dest.EnrolledAt, opt => opt.MapFrom(src => src.EnrolledAt))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive));

        CreateMap<CreateEnrollmentDto, Enrollment>()
            .ForMember(dest => dest.StudentId, opt => opt.MapFrom(src => src.StudentId))
            .ForMember(dest => dest.ClassId, opt => opt.MapFrom(src => src.ClassId))
            .ForMember(dest => dest.SectionId, opt => opt.MapFrom(src => src.SectionId))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true));


        // --------------------------
        // USER MAPPING (OPTIONAL)
        // --------------------------
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive));
    }
}

