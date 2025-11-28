using Domain.Common;
using Domain.Core.Entities;
using ScholarPrep.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Academic.Entities
{
    public class Section : BaseEntity, ITenantEntity, ICampusEntity
    {
        public string Name { get; set; } = string.Empty; // e.g. "A"
        public Guid ClassId { get; set; }
        public Guid CampusId { get; set; }
        public Guid TenantId { get; set; }     

        // Navigation
        public virtual Class Class { get; set; } = null!;
        //public virtual Campus Campus { get; set; } = null!;
        public virtual ICollection<Student> Students { get; set; } = new List<Student>();
        public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();      
    }

}
