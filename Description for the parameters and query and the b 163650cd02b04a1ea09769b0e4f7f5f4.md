# Description for the parameters and query and the body in the routes

<aside>
📢 For all the validation it will return status 200 with a message that tells what is not correct about the value of the parameter or if the parameter is not inserted when it is required

</aside>

**`first_name`**: Should be a string with a length between 3 and 10 characters, not null, and required.

**`last_name`**: Should be a string with a length between 3 and 10 characters, nullable, and required.

**`email`**: Should be a string, a valid email format, nullable.

**`password`**: Should be a string with a minimum length of 6 characters, containing characters, numbers, and special characters, nullable.

 **`phone_number`**: Should be a string in a specific format, nullable.

The format of the phone number is (xxx) xx xxxxxxx 

the (xxx) is the country code for PS so it should be 970

the next xx is could be just 59 or 56

**`date_of_birth`**: Should be a string in a specific format, nullable.

the format of the date is yyyy-mm-dd

**`old_password`**: Should be a string, not null, and required.

**`new_password`**: Should be a string with a minimum length of 6 characters, containing characters, numbers, and special characters, not null, and required.

**`confirm_password`**: Should be a string with a minimum length of 6 characters, containing characters, numbers, and special characters, not null, and required.

**`image`**: Each image in the array should have a **`mimetype`** property with a valid image format (jpeg or jpg).

**`product_id`**: Should be a number, an integer greater than or equal to 1, not null, and required.

**`comment`**: Should be a string, not null, and required.

**`rating_value`**: Should be a number, an integer between 0 and 5, not null, and required.