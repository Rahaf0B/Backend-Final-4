# Wishlist

**The main-Rout ⇒ Host+/wishlist**

⇒ [**http://158.176.1.165:3000](http://158.176.1.165:3000/)/wishlist**

**ALL the following routes should start with /wishlist** 

**The description of the parameters in the routes are in :**

[Description for the  parameter and query in the routes](Description%20for%20the%20parameter%20and%20query%20in%20the%20rou%200bd147aca81c4dc1a7a5ca9c028d945a.md)

<aside>
📢 **ALL the routes below need to send session-token in the cookies**

**example ⇒  “session-token=d7bdf711-9abe-4355-9bf0-7a377ed4f8dd”**

</aside>

---

## Get all the Products in the user’s Wishlist

Method ⇒ **GET**

```jsx
"/products?page_number=x&number_of_items=x"
```

- change x for a number
- Response:
    - Status 500 when error happens
    - Status 400 when:
        - error happens due to the validation
    - Status 200 :
        - The item_count : is equal to the number (count) for all the products that are new arrival (to use it in the pagination in the front side)
        - items : are the product info
            - more description :
                
                is_liked ⇒ 0 if the user did not liked this product and 1 if does ( the product is in the Wshlist of the user)
                
                number_of_ratings⇒ the number of the ratings that the users added to the product
                
                ratings⇒ the value of the average ratings value of the products
                
                discount_value ⇒ the discount value for the product
                
    
    ```json
    {
        "items_count": 4,
        "items": [
            {
                "product_id": 50,
                "name": "Minimalist Fuzzy Hobo Bag",
                "sub_title": "Style on a Dime: Creativity & Resourcefulness for the Fashionista.",
                "price": 60,
                "quantity": 73,
                "is_liked": "1",
                "number_of_ratings": 2,
                "ratings": "2.5000",
                "discount_value": 50,
                "image": [
                    {
                        "image_id": 312,
                        "name": "main_image",
                        "url": "https://img.ltwebstatic.com/images3_pi/2022/11/21/166899670704ec5d3190b723ff1b809c4477ba6811.jpg"
                    }
                ]
            }
        ]
    }
    ```
    

---

## Add product to Wishlist

Method⇒ POST

 

```json
"/?product_id=x"
```

- change x for a number
- Response:
- Status 500 when error happens
- Status 400 when:
    - error happens due to the validation
    - when the product with the product id is not found, it will return ⇒ Did not Found The Product
- Status 200 will return ⇒ true
    
    

---

## Delete from the Wishlist

Method⇒ DELETE

 

```json
"/?product_id=x"
```

- change x for a number
- Response:
    - Status 500 when error happens
    - Status 400 when:
        - error happens due to the validation
    - Status 200 will return ⇒ true