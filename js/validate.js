// Javascript Field Validation

/**
 * Validates an email address stored as a string.
 * @param {string} emailAddr String being validated
 * @returns Boolean dependent on the validity of emailAddr
 */
function validateEmail(emailAddr)
{
    let format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (format.test(emailAddr))
    {
        return true;
    }

    return false;
}

/**
 * Validates a phone number stored as a string.
 * @param {string} phoneNum String being validated
 * @returns Boolean dependent on the validity of phoneNum
 */
function validatePhone(phoneNum)
{
    // Works for phone number without dashes: 1234448888
    let format1 = /^\d{10}$/;
    // Works for phone number with dashes: 123-444-8888; but doesn't work when no dashes
    let format2 = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    // test this as well. It supports mutlitple formats
    // ^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$

    if (format1.test(phoneNum))
    {
        return true;
    }
    else if(format2.test(phoneNum))
    {
      return true;
    }

    return false;
}
