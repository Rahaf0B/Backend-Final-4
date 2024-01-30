# Description for the parameters and query and the body in the cart routes

<aside>
📢 For all the validation it will return status 200 with a message that tells what is not correct about the value of the parameter or if the parameter is not inserted when it is required

</aside>

**`product_id`**: Should be a number, an integer greater than or equal to 1, not null, and required.

**`quantity`**: Should be a number, an integer greater than or equal to 1, not null, and required.