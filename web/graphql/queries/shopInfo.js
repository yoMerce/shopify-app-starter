export const SHOP_INFO_QRY = `{
  shop {
    name
    email
    contactEmail
    id
    url
    billingAddress {
      firstName
      lastName
      address1,
      address2,
      city
      id
      company
      countryCodeV2
      country
      name
      zip
      phone
      province
      provinceCode
      formatted
    }
    ianaTimezone
    myshopifyDomain
    domains{
      host
      id
      localization {
        country
      }
      sslEnabled
      url
    }
    plan{
      displayName
      partnerDevelopment
      shopifyPlus
    }
  }
}`