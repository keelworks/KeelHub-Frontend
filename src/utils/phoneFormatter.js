export const formatPhoneNumber = (phoneString) => {
    if (!phoneString) return '';
  
    const cleaned = phoneString.replace(/\D/g, '');
  
    if (cleaned.length !== 11) {
      return phoneString; 
    }

    const countryCode = cleaned[0];
    const areaCode = cleaned.substring(1, 4);
    const firstPart = cleaned.substring(4, 7);
    const lastPart = cleaned.substring(7);
  
    return `+${countryCode} (${areaCode}) ${firstPart}-${lastPart}`;
  };