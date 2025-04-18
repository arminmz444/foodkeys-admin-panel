// // mockData.js

// export const mockRequests = [
//     {
//       id: '1',
//       requestType: 1, // 1: Company Registration, 2: Company Update, 3: Company Deletion
//       requestStatus: 1, // 1: Pending, 2: Approved, 3: Rejected
//       requestDate: '2025-04-12T14:30:00',
//       requester: {
//         id: 'u1',
//         name: 'علی محمدی',
//         username: 'alimohammadi',
//         phoneNumber: '09123456789'
//       },
//       company: {
//         id: 101,
//         companyName: 'شرکت تولیدی امید',
//         companyNameEn: 'Omid Production Co.',
//         companyType: 'تولیدی',
//         ceo: 'رضا احمدی',
//         ceoPhoneNumber: '09111234567',
//         owner: 'گروه صنعتی پیشرو',
//         description: 'شرکت تولیدی امید در سال 1390 تاسیس شده و در زمینه تولید محصولات غذایی فعالیت می‌کند.',
//         establishDate: '2011-03-21T00:00:00',
//         employeesCount: '50-100',
//         subjectOfActivity: 'تولید محصولات غذایی، بسته‌بندی مواد غذایی',
//         logo: '/assets/images/company-logos/omid.png',
//         brands: [
//           { id: 1, name: 'امید', nameEn: 'Omid', isPrimary: true },
//           { id: 2, name: 'طعم خوب', nameEn: 'TaameKhoob', isPrimary: false }
//         ],
//         products: ['کنسرو ماهی', 'کنسرو لوبیا', 'سس گوجه‌فرنگی'],
//         contacts: [
//           { type: 'email', value: 'info@omid-co.ir' },
//           { type: 'website', value: 'www.omid-co.ir' }
//         ],
//         tels: [
//           { number: '021-88776655', description: 'دفتر مرکزی' },
//           { number: '021-88776656', description: 'فروش' }
//         ],
//         socialMedias: [
//           { type: 'instagram', name: '@omid_co' },
//           { type: 'telegram', name: '@omid_co' }
//         ],
//         location: {
//           address: 'تهران، خیابان آزادی، پلاک 123',
//           city: 'تهران',
//           province: 'تهران',
//           postalCode: '1234567890',
//           latitude: 35.6892,
//           longitude: 51.3890
//         }
//       },
//       description: 'درخواست ثبت شرکت جدید',
//       metadata: {
//         notes: 'این شرکت دارای مجوزهای لازم از سازمان غذا و دارو می‌باشد.'
//       },
  
//       // Details used in the first “Approval” tab:
//       approvalDetails: {
//         company: 'Omid Production Co.',
//         contact: 'علی محمدی',
//         orderItems: [
//           { id: 1, product: 'Business license', quantity: 1, price: 1200 }
//         ],
//         subtotal: 1200,
//         discount: 0,
//         tax: 0,
//         adjustment: 0,
//         grandTotal: 1200,
//         contracts: []
//       },
  
//       // Timeline used in the “Approval process” tab:
//       approvalProcess: [
//         {
//           taskNode: 'Submitted',
//           status: 'Submitted',
//           user: 'علی محمدی',
//           timestamp: '2025-04-12 14:30:00'
//         },
//         {
//           taskNode: 'Department Review',
//           status: 'Pending',
//           user: 'مدیر تولید',
//           timestamp: '-'
//         },
//         {
//           taskNode: 'Final Approval',
//           status: 'Pending',
//           user: 'Super Admin',
//           timestamp: '-'
//         }
//       ]
//     },
  
//     {
//       id: '2',
//       requestType: 2,
//       requestStatus: 1,
//       requestDate: '2025-04-10T09:15:00',
//       requester: {
//         id: 'u2',
//         name: 'محسن کریمی',
//         username: 'mohsenkarimi',
//         phoneNumber: '09187654321'
//       },
//       company: {
//         id: 102,
//         companyName: 'شرکت پارس افزار',
//         companyNameEn: 'Pars Afzar Co.',
//         companyType: 'خدماتی',
//         ceo: 'مهدی حسینی',
//         ceoPhoneNumber: '09121112233',
//         owner: 'مهدی حسینی',
//         description: 'شرکت پارس افزار ارائه دهنده خدمات نرم‌افزاری و طراحی وب‌سایت با بیش از 10 سال سابقه در بازار IT ایران',
//         establishDate: '2013-05-15T00:00:00',
//         employeesCount: '10-50',
//         subjectOfActivity: 'طراحی نرم‌افزار، طراحی وب‌سایت، خدمات IT',
//         logo: '/assets/images/company-logos/parsafzar.png',
//         brands: [{ id: 3, name: 'پارس افزار', nameEn: 'Pars Afzar', isPrimary: true }],
//         products: ['نرم‌افزار حسابداری', 'نرم‌افزار CRM', 'طراحی سایت'],
//         contacts: [
//           { type: 'email', value: 'info@parsafzar.com' },
//           { type: 'website', value: 'www.parsafzar.com' }
//         ],
//         tels: [
//           { number: '021-77889900', description: 'دفتر مرکزی' },
//           { number: '021-77889901', description: 'پشتیبانی' }
//         ],
//         socialMedias: [
//           { type: 'instagram', name: '@parsafzar' },
//           { type: 'linkedin', name: 'parsafzar-co' }
//         ],
//         location: {
//           address: 'تهران، خیابان شریعتی، خیابان ملک، پلاک 45',
//           city: 'تهران',
//           province: 'تهران',
//           postalCode: '1653478901',
//           latitude: 35.7281,
//           longitude: 51.4301
//         }
//       },
//       description: 'درخواست به‌روزرسانی اطلاعات شرکت',
//       metadata: {
//         changedFields: ['description', 'employeesCount', 'products'],
//         notes: 'افزایش تعداد کارمندان و اضافه کردن محصول جدید'
//       },
  
//       approvalDetails: {
//         company: 'Pars Afzar Co.',
//         contact: 'محسن کریمی',
//         orderItems: [
//           { id: 1, product: 'Update Plan', quantity: 1, price: 500 }
//         ],
//         subtotal: 500,
//         discount: 0,
//         tax: 0,
//         adjustment: 0,
//         grandTotal: 500,
//         contracts: ['update-agreement.pdf']
//       },
  
//       approvalProcess: [
//         {
//           taskNode: 'Submitted',
//           status: 'Submitted',
//           user: 'محسن کریمی',
//           timestamp: '2025-04-10 09:15:00'
//         },
//         {
//           taskNode: 'Department Owner Review',
//           status: 'Pending',
//           user: 'مدیر خدمات',
//           timestamp: '-'
//         },
//         {
//           taskNode: 'Final Approval',
//           status: 'Pending',
//           user: 'Super Admin',
//           timestamp: '-'
//         }
//       ]
//     },
  
//     {
//       id: '3',
//       requestType: 1,
//       requestStatus: 1,
//       requestDate: '2025-04-09T11:45:00',
//       requester: {
//         id: 'u3',
//         name: 'زهرا رضایی',
//         username: 'zahrarezaei',
//         phoneNumber: '09309876543'
//       },
//       company: {
//         id: 103,
//         companyName: 'گروه صنعتی سپهر',
//         companyNameEn: 'Sepehr Industrial Group',
//         companyType: 'تولیدی',
//         ceo: 'امیر سپهری',
//         ceoPhoneNumber: '09133334444',
//         owner: 'هلدینگ سپهر',
//         description: 'گروه صنعتی سپهر یکی از بزرگترین تولیدکنندگان مصالح ساختمانی در ایران',
//         establishDate: '2008-07-10T00:00:00',
//         employeesCount: '100-500',
//         subjectOfActivity: 'تولید مصالح ساختمانی، صادرات و واردات',
//         logo: '/assets/images/company-logos/sepehr.png',
//         brands: [
//           { id: 4, name: 'سپهر', nameEn: 'Sepehr', isPrimary: true },
//           { id: 5, name: 'ایمن بتن', nameEn: 'Imen Beton', isPrimary: false }
//         ],
//         products: ['سیمان', 'بتن آماده', 'مصالح ساختمانی'],
//         contacts: [
//           { type: 'email', value: 'info@sepehr-group.ir' },
//           { type: 'website', value: 'www.sepehr-group.ir' }
//         ],
//         tels: [
//           { number: '021-66554433', description: 'دفتر مرکزی' },
//           { number: '031-32224455', description: 'کارخانه اصفهان' }
//         ],
//         socialMedias: [
//           { type: 'instagram', name: '@sepehr_group' },
//           { type: 'telegram', name: '@sepehr_group' }
//         ],
//         location: {
//           address: 'اصفهان، شهرک صنعتی مبارکه، خیابان تلاش 3',
//           city: 'اصفهان',
//           province: 'اصفهان',
//           postalCode: '8541234567',
//           latitude: 32.3956,
//           longitude: 51.6714
//         }
//       },
//       description: 'درخواست ثبت شرکت جدید',
//       metadata: {
//         notes: 'این شرکت دارای گواهینامه‌های ISO 9001 و ISO 14001 می‌باشد.'
//       },
  
//       approvalDetails: {
//         company: 'Sepehr Industrial Group',
//         contact: 'زهرا رضایی',
//         orderItems: [],
//         subtotal: 0,
//         discount: 0,
//         tax: 0,
//         adjustment: 0,
//         grandTotal: 0,
//         contracts: []
//       },
  
//       approvalProcess: [
//         {
//           taskNode: 'Submitted',
//           status: 'Submitted',
//           user: 'زهرا رضایی',
//           timestamp: '2025-04-09 11:45:00'
//         },
//         {
//           taskNode: 'Initial Check',
//           status: 'Pending',
//           user: 'کارشناس اولیه',
//           timestamp: '-'
//         },
//         {
//           taskNode: 'Final Approval',
//           status: 'Pending',
//           user: 'Super Admin',
//           timestamp: '-'
//         }
//       ]
//     },
  
//     {
//       id: '4',
//       requestType: 3,
//       requestStatus: 1,
//       requestDate: '2025-04-08T16:20:00',
//       requester: {
//         id: 'u4',
//         name: 'حمید عباسی',
//         username: 'hamidabbasi',
//         phoneNumber: '09351234567'
//       },
//       company: {
//         id: 104,
//         companyName: 'کافه رستوران نارنج',
//         companyNameEn: 'Naranj Cafe Restaurant',
//         companyType: 'خدماتی',
//         ceo: 'حمید عباسی',
//         ceoPhoneNumber: '09351234567',
//         owner: 'حمید عباسی',
//         description: 'کافه رستوران نارنج با فضایی دلنشین آماده پذیرایی از مشتریان عزیز',
//         establishDate: '2019-12-01T00:00:00',
//         employeesCount: '1-10',
//         subjectOfActivity: 'خدمات رستوران و کافی شاپ',
//         logo: '/assets/images/company-logos/naranj.png',
//         brands: [{ id: 6, name: 'نارنج', nameEn: 'Naranj', isPrimary: true }],
//         products: ['غذاهای ایرانی', 'فست فود', 'نوشیدنی‌های گرم و سرد'],
//         contacts: [
//           { type: 'email', value: 'info@naranj-cafe.ir' },
//           { type: 'instagram', value: '@naranj_cafe' }
//         ],
//         tels: [{ number: '021-22334455', description: 'رزرو میز' }],
//         socialMedias: [{ type: 'instagram', name: '@naranj_cafe' }],
//         location: {
//           address: 'تهران، خیابان گاندی، کوچه پنجم، پلاک 12',
//           city: 'تهران',
//           province: 'تهران',
//           postalCode: '1516789023',
//           latitude: 35.7605,
//           longitude: 51.4208
//         }
//       },
//       description: 'درخواست حذف اطلاعات شرکت',
//       metadata: {
//         reason: 'تعطیلی کسب و کار به دلیل مشکلات مالی'
//       },
  
//       approvalDetails: {
//         company: 'Naranj Cafe Restaurant',
//         contact: 'حمید عباسی',
//         orderItems: [],
//         subtotal: 0,
//         discount: 0,
//         tax: 0,
//         adjustment: 0,
//         grandTotal: 0,
//         contracts: []
//       },
  
//       approvalProcess: [
//         {
//           taskNode: 'Submitted',
//           status: 'Submitted',
//           user: 'حمید عباسی',
//           timestamp: '2025-04-08 16:20:00'
//         },
//         {
//           taskNode: 'Manager Review',
//           status: 'Pending',
//           user: 'مدیر رستوران',
//           timestamp: '-'
//         },
//         {
//           taskNode: 'Final Approval',
//           status: 'Pending',
//           user: 'Super Admin',
//           timestamp: '-'
//         }
//       ]
//     }
//   ]
  
//   // helper functions unchanged…
//   export const getRequestTypeName = (type) => {
//     switch (type) {
//       case 1: return 'ثبت شرکت جدید'
//       case 2: return 'به‌روزرسانی اطلاعات'
//       case 3: return 'حذف شرکت'
//       default: return 'نامشخص'
//     }
//   }
  
//   export const getRequestStatusName = (status) => {
//     switch (status) {
//       case 1: return 'در انتظار بررسی'
//       case 2: return 'تایید شده'
//       case 3: return 'رد شده'
//       default: return 'نامشخص'
//     }
//   }
  
  export const getRequestStatusColor = (status) => {
    switch (status) {
      case 1: return 'warning'
      case 2: return 'success'
      case 3: return 'error'
      default: return 'default'
    }
  }
  
//   export const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return new Intl.DateTimeFormat('fa-IR', {
//       year: 'numeric', month: 'long', day: 'numeric',
//       hour: '2-digit', minute: '2-digit'
//     }).format(date)
//   }
  
//   export const formatJalaliDate = (dateString) => {
//     const date = new Date(dateString)
//     return new Intl.DateTimeFormat('fa-IR').format(date)
//   }
  

// src/mockData.js
import dayjs from 'dayjs';

// Request status helper functions
export const getRequestStatusName = (status) => {
  const statusMap = {
    0: 'ثبت اولیه',
    1: 'در انتظار',
    2: 'تایید شده',
    3: 'رد شده',
    4: 'نامشخص'
  };
  return statusMap[status] || 'نامشخص';
};

// Request type helper functions 
export const getRequestTypeName = (type) => {
  const typeMap = {
    0: 'نامشخص',
    1: 'درخواست ایجاد شرکت',
    2: 'درخواست ویرایش شرکت',
    3: 'درخواست حذف شرکت',
    4: 'سایر درخواست‌ها',
    5: 'درخواست بازبینی',
    6: 'ثبت شرکت',
    7: 'ثبت سرویس',
    8: 'خرید اشتراک',
    9: 'به‌روزرسانی شرکت',
    10: 'به‌روزرسانی سرویس',
    11: 'بررسی'
  };
  return typeMap[type] || 'نامشخص';
};

// Date formatting
export const formatDate = (date) => {
  if (!date) return '-';
  return dayjs(date).format('YYYY/MM/DD HH:mm');
};

// Mock requests for testing
export const mockRequests = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    requestType: 6, // SUBMIT_COMPANY
    requestStatus: 1, // PENDING
    createdAt: '2024-04-15T10:30:00',
    description: 'درخواست ثبت شرکت جدید',
    requester: {
      id: 101,
      firstName: 'محمد',
      lastName: 'احمدی',
      username: 'mohammad.ahmadi',
      email: 'mohammad@example.com'
    },
    company: {
      id: 1001,
      companyName: 'شرکت صنایع غذایی پارسیان',
      companyNameEn: 'Parsian Food Industries',
      companyType: 'شرکت سهامی خاص',
      ceo: 'علی محمدی',
      ceoPhoneNumber: '09123456789',
      owner: 'حسین علوی',
      description: 'تولید‌کننده انواع محصولات غذایی با کیفیت باکیفیت و صادرات به کشورهای همسایه',
      subjectOfActivity: 'تولید و بسته‌بندی مواد غذایی',
      establishDate: '2010-05-20T00:00:00',
      employeesCount: '120',
      products: [
        {
          id: 1,
          name: 'رب گوجه فرنگی',
          categoryType: 'محصولات غذایی',
          isOutsourced: false
        },
        {
          id: 2,
          name: 'کنسرو لوبیا',
          categoryType: 'محصولات غذایی',
          isOutsourced: false
        }
      ],
      contacts: [
        {
          id: 1,
          name: 'علی',
          lastName: 'محمدی',
          email: 'ali@parsian-food.com',
          phone: '09123456789',
          position: 'مدیرعامل',
          isCEO: true
        }
      ],
      tels: [
        {
          id: 1,
          telNumber: '021-88776655',
          telType: 'دفتر مرکزی'
        },
        {
          id: 2,
          telNumber: '021-77889900',
          telType: 'کارخانه'
        }
      ],
      socialMedias: [
        {
          id: 1,
          type: 'اینستاگرام',
          name: 'parsian_food'
        },
        {
          id: 2,
          type: 'وب‌سایت',
          name: 'www.parsian-food.com'
        }
      ],
      location: {
        country: 'ایران',
        officeState: 'تهران',
        officeCity: 'تهران',
        officeLocation: 'خیابان ولیعصر، بالاتر از میدان ونک',
        officePoBox: '1234567890',
        factoryState: 'البرز',
        factoryCity: 'کرج',
        factoryLocation: 'شهرک صنعتی بهارستان',
        factoryPoBox: '9876543210',
        industrialCity: 'کرج',
        fullAddress: 'شهرک صنعتی بهارستان، خیابان گلستان، پلاک 45'
      }
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    requestType: 6, // SUBMIT_COMPANY
    requestStatus: 2, // APPROVED
    createdAt: '2024-04-10T09:15:00',
    answeredAt: '2024-04-11T14:30:00',
    description: 'درخواست ثبت شرکت جدید',
    employeeComment: 'اطلاعات کامل است و شرکت تایید می‌شود.',
    requester: {
      id: 102,
      firstName: 'سارا',
      lastName: 'رضایی',
      username: 'sara.rezaei',
      email: 'sara@example.com'
    },
    responder: {
      id: 201,
      firstName: 'حسین',
      lastName: 'کریمی',
      username: 'admin1',
      email: 'admin1@example.com'
    },
    company: {
      id: 1002,
      companyName: 'شرکت نوشیدنی تک‌نوش',
      companyNameEn: 'TakNoosh Beverage Co',
      companyType: 'سهامی خاص',
      ceo: 'سارا رضایی',
      owner: 'محمد جعفری',
      description: 'تولیدکننده انواع نوشیدنی‌های طبیعی و بدون مواد نگهدارنده',
      subjectOfActivity: 'تولید نوشیدنی',
      establishDate: '2018-03-15T00:00:00',
      employeesCount: '45',
      products: [
        {
          id: 3,
          name: 'آبمیوه طبیعی',
          categoryType: 'نوشیدنی',
          isOutsourced: false
        }
      ]
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    requestType: 5, // ASK_FOR_REVISION
    requestStatus: 3, // DENIED
    createdAt: '2024-04-08T14:45:00',
    answeredAt: '2024-04-09T10:20:00',
    description: 'درخواست بازبینی اطلاعات شرکت',
    employeeComment: 'اطلاعات تماس و مشخصات مدیران کامل نیست. لطفاً تکمیل کنید.',
    requester: {
      id: 103,
      firstName: 'رضا',
      lastName: 'صادقی',
      username: 'reza.sadeghi',
      email: 'reza@example.com'
    },
    responder: {
      id: 202,
      firstName: 'زهرا',
      lastName: 'قاسمی',
      username: 'admin2',
      email: 'admin2@example.com'
    },
    company: {
      id: 1003,
      companyName: 'صنایع بسته‌بندی نوین',
      companyNameEn: 'Novin Packaging Industries',
      companyType: 'سهامی عام',
      ceo: 'رضا صادقی',
      description: 'تولیدکننده انواع محصولات بسته‌بندی صنعتی و خانگی',
      subjectOfActivity: 'تولید بسته‌بندی',
      establishDate: '2015-11-20T00:00:00',
      employeesCount: '78'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    requestType: 9, // UPDATE_COMPANY
    requestStatus: 1, // PENDING
    createdAt: '2024-04-14T16:30:00',
    description: 'درخواست به‌روزرسانی اطلاعات شرکت',
    requester: {
      id: 104,
      firstName: 'مریم',
      lastName: 'جعفری',
      username: 'maryam.jafari',
      email: 'maryam@example.com'
    },
    company: {
      id: 1004,
      companyName: 'شرکت لبنیات پاکسان',
      companyNameEn: 'Paksan Dairy Products',
      companyType: 'تعاونی',
      ceo: 'مریم جعفری',
      description: 'تولیدکننده انواع محصولات لبنی با کیفیت برتر',
      subjectOfActivity: 'تولید لبنیات',
      establishDate: '2012-07-10T00:00:00',
      employeesCount: '95',
      products: [
        {
          id: 4,
          name: 'شیر پاستوریزه',
          categoryType: 'لبنیات',
          isOutsourced: false
        },
        {
          id: 5,
          name: 'ماست پروبیوتیک',
          categoryType: 'لبنیات',
          isOutsourced: false
        },
        {
          id: 6,
          name: 'پنیر سفید',
          categoryType: 'لبنیات',
          isOutsourced: false
        }
      ],
      location: {
        country: 'ایران',
        officeState: 'آذربایجان شرقی',
        officeCity: 'تبریز',
        factoryState: 'آذربایجان شرقی',
        factoryCity: 'تبریز',
        factoryLocation: 'شهرک صنعتی شهید سلیمی'
      }
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    requestType: 11, // ADMIN_REVIEW
    requestStatus: 1, // PENDING
    createdAt: '2024-04-16T11:00:00',
    description: 'بررسی اطلاعات تکمیلی شرکت',
    requester: {
      id: 201,
      firstName: 'حسین',
      lastName: 'کریمی',
      username: 'admin1',
      email: 'admin1@example.com'
    },
    company: {
      id: 1005,
      companyName: 'صنایع غذایی به‌پخت',
      companyNameEn: 'Behpakht Food Industries',
      companyType: 'سهامی خاص',
      ceo: 'امیر حسینی',
      owner: 'گروه صنعتی ماهان',
      description: 'تولیدکننده انواع غذاهای آماده منجمد و کنسروها',
      subjectOfActivity: 'تولید غذای آماده',
      establishDate: '2014-02-18T00:00:00',
      employeesCount: '152',
      products: [
        {
          id: 7,
          name: 'خورشت قیمه منجمد',
          categoryType: 'غذای آماده',
          isOutsourced: false
        },
        {
          id: 8,
          name: 'کتلت منجمد',
          categoryType: 'غذای آماده',
          isOutsourced: false
        }
      ],
      stakeholders: [
        {
          id: 1,
          name: 'امیر',
          lastName: 'حسینی',
          phone: '09121234567',
          email: 'amir@behpakht.com'
        },
        {
          id: 2,
          name: 'محسن',
          lastName: 'رضوی',
          phone: '09121234568',
          email: 'mohsen@behpakht.com'
        }
      ]
    }
  }
];

export const mockCategories = [
  { id: 1, name: 'صنایع غذایی', nameEn: 'Food Industry' },
  { id: 2, name: 'صنایع دارویی', nameEn: 'Pharmaceutical Industry' },
  { id: 3, name: 'صنایع بسته‌بندی', nameEn: 'Packaging Industry' },
  { id: 4, name: 'صنایع لبنی', nameEn: 'Dairy Industry' },
  { id: 5, name: 'نوشیدنی', nameEn: 'Beverage' }
];