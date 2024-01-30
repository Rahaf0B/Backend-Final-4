# Description for the parameters and query and the body in the order routes

<aside>
📢 For all the validation it will return status 200 with a message that tells what is not correct about the value of the parameter or if the parameter is not inserted when it is required

</aside>

**`order_id`**: Should be a number, an integer greater than or equal to 1, not null, and required.

**`first_name`**: Should be a string with a length between 3 and 10 characters, nullable, and required.

**`last_name`**: Should be a string with a length between 3 and 10 characters, nullable, and required.

**`email`**: Should be a string, a valid email format, nullable, and required.

**`phone_number`**: Should be a string in a specific format, nullable, and required.

**`location`**: Should be a string, nullable, and required.

**`payment_type`**: Should be a string, not null, and required.

**`order_status`**: Should be a number, an integer between 0 and 2, not null, and required.