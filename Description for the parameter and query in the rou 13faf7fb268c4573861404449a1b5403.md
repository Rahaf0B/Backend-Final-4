# Description for the  parameter and query in the routes

<aside>
📢 For all the validation it will return status 200 with a message that tells what is not correct about the value of the parameter or if the parameter is not inserted when it is required

</aside>

**`page_number`**: This Should be a number, an integer greater than or equal to 1, not null, and required.

**`number_of_items`**: This Should be a number, an integer greater than or equal to 1, not null, and required.

⇒ the number_of_items is for the number of products that you want to return 

**`product_id`**: This  Should be a number, an integer greater than or equal to 1, not null, and required.

**`category_id`**: This Should be a number, an integer greater than or equal to 1, not null, and required.

**`brand_id`**: This Should be a number, an integer greater than or equal to 1, not null, and required.

**For “/search” route**

**`search_value`**: This should be a string, not null, and required.

⇒ The value that you want to search with

**For the “/popular” route and “/discount-edition”**

**`value`**: Should be a number, an integer, not null, and required.

⇒ For the “/popular” route represent the average rating that you want to compare with

⇒ For “/discount-edition” route represents the discount value that  you want to compare with