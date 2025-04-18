// transformCommunications.ts
export function transformCommunications(data: any) {
    // Assume data.communications is an array of objects with fields: mediumType, value
    const communications = data.communications || [];
    const emails = [];
    const tels = [];
    const socialMedias = [];
  
    communications.forEach((item) => {
      if (item.mediumType === 'EMAIL') {
        emails.push(item.value);
        // Optionally, also add to socialMedias if needed:
        socialMedias.push({ name: item.value, type: 'EMAIL' });
      } else if (['PHONE', 'MOBILE', 'FAX', 'HOTLINE', 'SMS'].includes(item.mediumType)) {
        // Map these to your Tel DTO structure
        tels.push({ telNumber: item.value, telType: item.mediumType });
      } else {
        // For other types (e.g., TELEGRAM, WHATSAPP, INSTAGRAM, etc.)
        socialMedias.push({ name: item.value, type: item.mediumType });
      }
    });
  
    return { ...data, emails, tels, socialMedias };
  }
  