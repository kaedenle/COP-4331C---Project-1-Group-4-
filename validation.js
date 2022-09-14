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
    let format = /^\d{10}$/;
    // test this as well. It supports mutlitple formats
    //^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$
    if (format.test(phoneNum))
    {
        return true;
    }

    return false;
}

