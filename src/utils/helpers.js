export const generateAddressString = (address) => {
    const { country, address: street, city, state, zip_code } = address;
    const addressString = `${street}, ${city}, ${state}, ${zip_code}, ${country}`;
    return addressString;
};
