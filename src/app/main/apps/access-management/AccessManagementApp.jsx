import React, { useEffect, useState } from "react";
import {
  Switch,
  FormControlLabel,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

// const mock = {
  // "accesses": [
  //   {
  //     "name": "CREATE_COMPANY",
  //     "displayName": "ایجاد شرکت",
  //     "description": "ایجاد یک رکورد شرکت جدید در سیستم",
  //     "info": "کاربر می‌تواند یک شرکت جدید ثبت کند"
  //   },
  //   {
  //     "name": "READ_COMPANY",
  //     "displayName": "مشاهده شرکت",
  //     "description": "مشاهده اطلاعات شرکت (با بررسی مالکیت)",
  //     "info": "فقط مالک یا کارمند دارای دسترسی می‌تواند این رکورد را ببیند"
  //   },
  //   {
  //     "name": "UPDATE_COMPANY",
  //     "displayName": "ویرایش شرکت",
  //     "description": "ویرایش اطلاعات شرکت (با بررسی مالکیت)",
  //     "info": "ویرایش اطلاعات شرکت شامل تغییر نام، توضیحات و غیره"
  //   },
  //   {
  //     "name": "DELETE_COMPANY",
  //     "displayName": "حذف شرکت",
  //     "description": "حذف رکورد شرکت (با بررسی مالکیت)",
  //     "info": "حذف شرکت از سیستم (محدود به مدیران)"
  //   },
  //   {
  //     "name": "CREATE_TICKET",
  //     "displayName": "ایجاد تیکت",
  //     "description": "ثبت یک تیکت جدید",
  //     "info": "کاربر می‌تواند یک تیکت جدید ثبت کند"
  //   },
  //   {
  //     "name": "READ_TICKET",
  //     "displayName": "مشاهده تیکت",
  //     "description": "مشاهده تیکت (بر اساس مالکیت یا نقش)",
  //     "info": "کاربر تنها در صورت مالکیت یا با دسترسی ویژه می‌تواند تیکت را ببیند"
  //   },
  //   {
  //     "name": "UPDATE_TICKET",
  //     "displayName": "ویرایش تیکت",
  //     "description": "ویرایش تیکت (با بررسی مالکیت)",
  //     "info": "تغییر اطلاعات تیکت شامل عنوان، توضیحات، وضعیت"
  //   },
  //   {
  //     "name": "DELETE_TICKET",
  //     "displayName": "حذف تیکت",
  //     "description": "حذف تیکت (با بررسی مالکیت)",
  //     "info": "کاربر تنها در صورت مالکیت یا با دسترسی کامل می‌تواند تیکت را حذف کند"
  //   }
  //   // ... add similar CRUD and specialized accesses for all other entities
  // ],
  // "roles": [
  //   {
  //     "name": "TECHNICIAN",
  //     "displayName": "تکنسین",
  //     "description": "کاربر مسئول بررسی و پاسخ به درخواست‌ها",
  //     "accesses": [
  //       "READ_TICKET",
  //       "UPDATE_TICKET"
  //     ]
  //   },
  //   {
  //     "name": "ADMIN",
  //     "displayName": "مدیر سیستم",
  //     "description": "کاربر دارای بالاترین سطح دسترسی",
  //     "accesses": [
  //       "CREATE_COMPANY",
  //       "READ_COMPANY",
  //       "UPDATE_COMPANY",
  //       "DELETE_COMPANY",
  //       "CREATE_TICKET",
  //       "READ_TICKET",
  //       "UPDATE_TICKET",
  //       "DELETE_TICKET"
  //     ]
  //   }
  // ]
// }
const mock = {
  "accesses": [
    {
      "name": "CREATE_TICKET",
      "displayName": "ایجاد تیکت",
      "description": "ایجاد تیکت جدید در سیستم",
      "info": "کاربر می‌تواند یک تیکت جدید ثبت کند"
    },
    {
      "name": "READ_TICKET",
      "displayName": "مشاهده تیکت",
      "description": "مشاهده اطلاعات تیکت (با بررسی مالکیت)",
      "info": "فقط مالک تیکت یا کاربران نقش خاص می‌توانند بخوانند"
    },
    {
      "name": "UPDATE_TICKET",
      "displayName": "ویرایش تیکت",
      "description": "ویرایش مشخصات تیکت (با بررسی مالکیت)",
      "info": "تغییر عنوان، توضیحات و وضعیت تیکت"
    },
    {
      "name": "DELETE_TICKET",
      "displayName": "حذف تیکت",
      "description": "حذف تیکت (با بررسی مالکیت)",
      "info": "حذف کلی تیکت و پیام‌های آن"
    },

    {
      "name": "CREATE_TICKET_MESSAGE",
      "displayName": "ایجاد پیام تیکت",
      "description": "افزودن پیام جدید به تیکت",
      "info": "با داشتن این دسترسی، می‌توانید در تیکت پیام ثبت کنید"
    },
    {
      "name": "READ_TICKET_MESSAGE",
      "displayName": "مشاهده پیام تیکت",
      "description": "مشاهده پیام‌های تیکت (با بررسی مالکیت تیکت یا نقش مرتبط)",
      "info": "دسترسی به محتوای پیام‌های یک تیکت"
    },
    {
      "name": "UPDATE_TICKET_MESSAGE",
      "displayName": "ویرایش پیام تیکت",
      "description": "ویرایش پیام (با بررسی مالکیت پیام)",
      "info": "می‌توانید متن پیام را تغییر دهید"
    },
    {
      "name": "DELETE_TICKET_MESSAGE",
      "displayName": "حذف پیام تیکت",
      "description": "حذف پیام (با بررسی مالکیت پیام)",
      "info": "امکان حذف پیام در تیکت"
    },

    {
      "name": "CREATE_COMPANY",
      "displayName": "ایجاد شرکت",
      "description": "ساخت یک رکورد شرکت جدید در سیستم",
      "info": "برای ثبت شرکت توسط کاربران"
    },
    {
      "name": "READ_COMPANY",
      "displayName": "مشاهده شرکت",
      "description": "مشاهده اطلاعات شرکت (با بررسی مالکیت)",
      "info": "رکوردهای شرکتی که کاربر مالک آن است یا دسترسی کامل دارد"
    },
    {
      "name": "UPDATE_COMPANY",
      "displayName": "ویرایش شرکت",
      "description": "ویرایش اطلاعات شرکت (با بررسی مالکیت)",
      "info": "تغییر نام، اطلاعات کلی، لوگو و ... شرکت"
    },
    {
      "name": "DELETE_COMPANY",
      "displayName": "حذف شرکت",
      "description": "حذف رکورد شرکت (با بررسی مالکیت)",
      "info": "حذف کامل شرکت از دیتابیس"
    },

    {
      "name": "CREATE_PRODUCT",
      "displayName": "ایجاد محصول",
      "description": "افزودن محصول جدید به شرکت",
      "info": "محصول یا خدمت قابل ارائه"
    },
    {
      "name": "READ_PRODUCT",
      "displayName": "مشاهده محصول",
      "description": "مشاهده اطلاعات محصول (با بررسی مالکیت)",
      "info": "دسترسی به توضیحات، تصاویر، قیمت و ... محصول"
    },
    {
      "name": "UPDATE_PRODUCT",
      "displayName": "ویرایش محصول",
      "description": "ویرایش اطلاعات محصول (با بررسی مالکیت)",
      "info": "تغییر نام، توضیحات یا وضعیت محصول"
    },
    {
      "name": "DELETE_PRODUCT",
      "displayName": "حذف محصول",
      "description": "حذف رکورد محصول (با بررسی مالکیت)",
      "info": "حذف کامل محصول از دیتابیس"
    },

    {
      "name": "CREATE_PAYMENT",
      "displayName": "ایجاد پرداخت",
      "description": "ثبت تراکنش مالی جدید",
      "info": "کاربر می‌تواند رکورد پرداخت را ایجاد کند"
    },
    {
      "name": "READ_PAYMENT",
      "displayName": "مشاهده پرداخت",
      "description": "مشاهده تراکنش مالی (با بررسی مالکیت یا نقش مالی)",
      "info": "گزارش کامل پرداخت‌ها"
    },
    {
      "name": "UPDATE_PAYMENT",
      "displayName": "ویرایش پرداخت",
      "description": "ویرایش اطلاعات تراکنش مالی (با بررسی شرایط)",
      "info": "ممکن است نیاز به نقش مالی خاص باشد"
    },
    {
      "name": "DELETE_PAYMENT",
      "displayName": "حذف پرداخت",
      "description": "حذف تراکنش مالی (با بررسی شرایط)",
      "info": "برای حذف رکورد تراکنش با دلایل توجیهی"
    },
    {
      "name": "APPROVE_PAYMENT",
      "displayName": "تأیید پرداخت",
      "description": "تأیید یک تراکنش مالی توسط نقش مالی",
      "info": "نیازمند دسترسی مالی یا مدیر"
    },

    {
      "name": "CREATE_ANNOUNCEMENT",
      "displayName": "ایجاد اعلان",
      "description": "ثبت یک اطلاعیه جدید",
      "info": "مدیران یا برخی نقش‌ها می‌توانند اعلان ایجاد کنند"
    },
    {
      "name": "READ_ANNOUNCEMENT",
      "displayName": "مشاهده اعلان",
      "description": "مشاهده فهرست اعلان‌ها",
      "info": "کاربر حق دیدن اعلان‌ها را دارد"
    },
    {
      "name": "UPDATE_ANNOUNCEMENT",
      "displayName": "ویرایش اعلان",
      "description": "ویرایش یک اعلان موجود",
      "info": "ممکن است نیاز به داشتن نقش ادمین"
    },
    {
      "name": "DELETE_ANNOUNCEMENT",
      "displayName": "حذف اعلان",
      "description": "حذف اطلاعیه (با بررسی شرایط)",
      "info": "کامل از سیستم حذف می‌شود"
    },

    {
      "name": "CREATE_NOTIFICATION",
      "displayName": "ایجاد نوتیفیکیشن",
      "description": "ثبت یک نوتیفیکیشن برای کاربران",
      "info": "ارسال پیام به کاربر یا گروهی از کاربران"
    },
    {
      "name": "READ_NOTIFICATION",
      "displayName": "مشاهده نوتیفیکیشن",
      "description": "مشاهده پیام‌های ارسالی یا دریافتی",
      "info": "کاربر می‌تواند اعلان‌های خود را مشاهده کند"
    },
    {
      "name": "UPDATE_NOTIFICATION",
      "displayName": "ویرایش نوتیفیکیشن",
      "description": "ویرایش اطلاعات نوتیفیکیشن",
      "info": "احتمالاً بسیار محدود"
    },
    {
      "name": "DELETE_NOTIFICATION",
      "displayName": "حذف نوتیفیکیشن",
      "description": "حذف پیام یا اعلان",
      "info": "کاربر می‌تواند اعلان خود را پاک کند"
    },

    {
      "name": "CREATE_USER",
      "displayName": "ایجاد کاربر",
      "description": "ساخت اکانت کاربری جدید",
      "info": "تنها نقش ادمین یا HR می‌تواند یوزر ایجاد کند"
    },
    {
      "name": "READ_USER",
      "displayName": "مشاهده کاربر",
      "description": "مشاهده اطلاعات کاربران (با بررسی مالکیت/نقش)",
      "info": "ادمین می‌تواند همه را ببیند، کاربر فقط خودش را ببیند"
    },
    {
      "name": "UPDATE_USER",
      "displayName": "ویرایش کاربر",
      "description": "ویرایش مشخصات کاربر",
      "info": "مثلاً تغییر پسورد یا اطلاعات پروفایل"
    },
    {
      "name": "DELETE_USER",
      "displayName": "حذف کاربر",
      "description": "حذف اکانت کاربر از سیستم",
      "info": "صرفاً نقش ادمین می‌تواند این کار را انجام دهد"
    },

    {
      "name": "CREATE_ROLE",
      "displayName": "ایجاد نقش",
      "description": "ساخت نقش جدید",
      "info": "فقط ادمین"
    },
    {
      "name": "READ_ROLE",
      "displayName": "مشاهده نقش‌ها",
      "description": "لیست نقش‌های ثبت شده",
      "info": "ادمین یا نقش مدیریت نقش"
    },
    {
      "name": "UPDATE_ROLE",
      "displayName": "ویرایش نقش",
      "description": "تغییر اطلاعات یا دسترسی‌های نقش",
      "info": "تنها ادمین"
    },
    {
      "name": "DELETE_ROLE",
      "displayName": "حذف نقش",
      "description": "حذف یک نقش",
      "info": "احتمالاً نیاز به احتیاط بالا"
    },

    {
      "name": "CONSUMER_ACCESS",
      "displayName": "دسترسی مصرف‌کننده",
      "description": "دسترسی عمومی برای مصرف‌کنندگان",
      "info": "به صورت پیش‌فرض برای همه کاربران"
    },
    {
      "name": "EMPLOYEE_ACCESS",
      "displayName": "دسترسی کارمند",
      "description": "دسترسی عمومی برای کارکنان",
      "info": "کارمندان عادی سیستم"
    },
    {
      "name": "ADMIN_ACCESS",
      "displayName": "دسترسی مدیر",
      "description": "دسترسی کامل مدیریتی",
      "info": "فراگیرترین سطح دسترسی"
    }
  ],

  "roles": [
    {
      "name": "TECHNICIAN",
      "displayName": "تکنسین",
      "description": "نقش مربوط به افرادی که درخواست‌ها را بررسی می‌کنند",
      "accesses": [
        "READ_TICKET",
        "CREATE_TICKET_MESSAGE",
        "READ_TICKET_MESSAGE",
        "UPDATE_TICKET_MESSAGE",
        "CONSUMER_ACCESS",
        "EMPLOYEE_ACCESS"
      ]
    },
    {
      "name": "FINANCE",
      "displayName": "امور مالی",
      "description": "نقش مسئول تراکنش‌ها و گزارش‌های مالی",
      "accesses": [
        "CREATE_PAYMENT",
        "READ_PAYMENT",
        "APPROVE_PAYMENT",
        "UPDATE_PAYMENT",
        "DELETE_PAYMENT",
        "EMPLOYEE_ACCESS"
      ]
    },
    {
      "name": "CATALOG_EDITOR",
      "displayName": "ویرایشگر کاتالوگ",
      "description": "نقش مربوط به مدیریت محصولات و شرکت‌ها",
      "accesses": [
        "CREATE_COMPANY",
        "READ_COMPANY",
        "UPDATE_COMPANY",
        "CREATE_PRODUCT",
        "READ_PRODUCT",
        "UPDATE_PRODUCT",
        "EMPLOYEE_ACCESS"
      ]
    },
    {
      "name": "ADMIN",
      "displayName": "مدیر سیستم",
      "description": "کامل‌ترین سطح دسترسی در سیستم",
      "accesses": [
        "CREATE_TICKET",
        "READ_TICKET",
        "UPDATE_TICKET",
        "DELETE_TICKET",
        "CREATE_TICKET_MESSAGE",
        "READ_TICKET_MESSAGE",
        "UPDATE_TICKET_MESSAGE",
        "DELETE_TICKET_MESSAGE",

        "CREATE_COMPANY",
        "READ_COMPANY",
        "UPDATE_COMPANY",
        "DELETE_COMPANY",

        "CREATE_PRODUCT",
        "READ_PRODUCT",
        "UPDATE_PRODUCT",
        "DELETE_PRODUCT",

        "CREATE_PAYMENT",
        "READ_PAYMENT",
        "UPDATE_PAYMENT",
        "DELETE_PAYMENT",
        "APPROVE_PAYMENT",

        "CREATE_ANNOUNCEMENT",
        "READ_ANNOUNCEMENT",
        "UPDATE_ANNOUNCEMENT",
        "DELETE_ANNOUNCEMENT",

        "CREATE_NOTIFICATION",
        "READ_NOTIFICATION",
        "UPDATE_NOTIFICATION",
        "DELETE_NOTIFICATION",

        "CREATE_USER",
        "READ_USER",
        "UPDATE_USER",
        "DELETE_USER",
        "CREATE_ROLE",
        "READ_ROLE",
        "UPDATE_ROLE",
        "DELETE_ROLE",

        "EMPLOYEE_ACCESS",
        "ADMIN_ACCESS",
        "CONSUMER_ACCESS"
      ]
    }
  ]
}



const AccessManagementApp = () => {
  const [accesses, setAccesses] = useState([]);
  const [userAccesses, setUserAccesses] = useState({});
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all accesses on mount
  useEffect(() => {
    setAccesses(mock.accesses)
    // axios
    //   .get("/access-management/accesses")
    //   .then((res) => {
    //     setAccesses(res.data);
    //   })
    //   .catch((err) => console.error(err));
  }, []);

  // Fetch a user’s current accesses when userId is entered (this assumes an endpoint like /api/v1/users/{userId} that returns a user DTO with an "accesses" array)
  const fetchUserAccesses = async (userId) => {
    try {
      // const res = await axios.get(`/user/${userId}`);
      // Assume the response data has an array field called 'accesses' with objects that have an 'id'
      // const userAccessIds = res.data.accesses.map((a) => a.id);
      // const accessMap = {};
      // accesses.forEach((a) => {
      //   accessMap[a.id] = userAccessIds.includes(a.id);
      // });
      setUserAccesses(mock.accesses);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (accessId) => {
    const isEnabled = userAccesses[accessId];
    try {
      if (isEnabled) {
        await axios.post("/api/v1/access-management/remove", null, {
          params: { userId, accessId },
        });
      } else {
        await axios.post("/api/v1/access-management/assign", null, {
          params: { userId, accessId },
        });
      }
      setUserAccesses((prev) => ({ ...prev, [accessId]: !isEnabled }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper className="p-4 m-4">
      <Typography variant="h5" className="mb-2">
        مدیریت دسترسی‌ها
      </Typography>
      <TextField
        label="کاربر را جستجو کنید"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        onBlur={() => {
          if (userId) {
            fetchUserAccesses(userId);
          }
        }}
        fullWidth
        className="mb-4"
      />
      {accesses.map((access) => (
        <FormControlLabel
          key={access.id}
          control={
            <Switch
              checked={!!userAccesses[access.id]}
              onChange={() => handleToggle(access.id)}
              color="primary"
            />
          }
          label={access.displayName}
        />
      ))}
      {loading && <Typography>در حال بارگذاری دسترسی‌‌های موجود در سایت...</Typography>}
    </Paper>
  );
};

export default AccessManagementApp;
