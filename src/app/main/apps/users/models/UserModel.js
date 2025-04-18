/**
 * Creates a new User model
 * @param data
 * @returns {{birthDate: string, firstName: string, lastName: string, emails: [{email: string}], address: string, password: string, jobPosition: string, phoneNumbers: [{phoneNumber: string}], avatar: string}}
 * @constructor
 */
const UserModel = (data) => {
    return {
      id: data.id || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      username: data.username || "",
      phone: data.phone || "",
      password: data.password || "",
      passwordConfirm: data.passwordConfirm || "",
      jobPosition: data.jobPosition || "",
      address: data.address || "",
      birthDate: data.birthDate || new Date().toISOString(),
      avatar: data.avatar || "",
      roles: data.roles || [],
      accesses: data.accesses || [],
      city: data.city || null,
      province: data.province || null,
      nationalCode: data.nationalCode || "",
      emails: data.emails || [{email: ""}],
      phoneNumbers: data.phoneNumbers || [{phoneNumber: ""}],
      status: data.status !== undefined ? data.status : 0,
      active: data.active !== undefined ? data.active : true,
      companies: data.companies || [],
      profileIncomplete: data.profileIncomplete || false,
      notes: data.notes || "",
    };
  };
  
  export const ContactEmailModel = (data) => {
    return {
      email: data.email || "",
    };
  };
  
  export const ContactPhoneModel = (data) => {
    return {
      phoneNumber: data.phoneNumber || "",
    };
  };
  
  export default UserModel;