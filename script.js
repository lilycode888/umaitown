// select DOM elements from UI
const loader = document.querySelector('.loader')
const pageContainer = document.querySelector('.page-container')
// home page element
const homePage = document.querySelector('.home-container')
const specialItemContents = document.querySelectorAll('.special-item-content')
const homeBtn = document.getElementById('homeBtn')
// menu page elements
const menuPage = document.querySelector('.menu-container')
const menuBtn = document.getElementById('menuBtn')
const orderNowBtn = document.getElementById('orderNowBtn')
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn')
// cart elements
const cartContainer =  document.querySelector('.cart-container')
const cartForm = document.querySelector('.cart')
const cartContent = document.querySelector('.cart-content')
const cartBtn = document.getElementById('cartBtn')
const cartNum = document.getElementById('cartNum')
const closeCartBtns = document.querySelectorAll('.close-cart')
const checkOutBtn = document.querySelector('.check-out-btn')


// menu items (hardcoded for now, could get from server if available) 
const menuItems = [
[
    { id:'beefRiceBowl', nameJp: '牛丼', nameEn: 'Beef Rice Bowl', price: '12.99' },
    { id:'chickenRiceBowl', nameJp: '親子丼', nameEn: 'Chicken Rice Bowl', price: '10.99'},
    { id:'tempuraRiceBowl', nameJp: '天ぷら丼', nameEn: 'Tempura Rice Bowl', price: '12.99' }
],

[
    { id:'porkRamen', nameJp: '豚汁ラーメン', nameEn: 'Pork Ramen', price: '9.99' },
    { id:'veggieRamen', nameJp: '野菜ラーメン', nameEn: 'Veggie Ramen', price: '8.99' },
    { id:'sushiSet', nameJp: '寿司セット', nameEn: 'Sushi Set', price: '18.99' }
],

[
    { id:'chickenRolls', nameJp: '鶏肉ロール', nameEn: 'Chicken Rolls', price: '10.99' },
    {  id:'veggieRolls', nameJp: '野菜ロール', nameEn: 'Veggie Rolls', price: '8.99' },
    { id:'tunaSushi', nameJp: 'ツナロール', nameEn: 'Tuna Sushi', price: '15.99' }

]
]
// ***********************************************************************
// get cart items from local stroage
const cartItemsLS = JSON.parse(localStorage.getItem('cartItems'))
// set cart items depending on local storage
let cartItems = cartItemsLS === null ? [] : cartItemsLS


// **************************************************************************
// calculate total item amount in cart 
    const itemAmountArr = cartItems.length === 0 ? 0 : cartItems.map(item => item.amount)
    const totalItemAmount = cartItems.length === 0 ? 0 : itemAmountArr.reduce((x, y) => x + y)


// **************************************************************************   
// calcualte cart total mount for check out 
const calculateCartTotal = () => {
    cartTotalEleUI = document.querySelector('.cart-total')


    const cartTotal = cartItems.length === 0 ? 0 : cartItems.map(item => item.amount * (+item.price)).reduce((x, y) => x + y).toFixed(2)
    
    cartTotalEleUI.innerText = cartTotal

    // highlight cart total 
    cartTotalEleUI.classList.add('highlight')

    setTimeout(() => {
        cartTotalEleUI.classList.remove('highlight')
    }, 500)
}

// ***********************************************************************
// show menu function 
const showMenu = () => {
     setTimeout(() => {
        homePage.style.display = 'none'
        menuPage.classList.add('show')
    }, 500)
    setTimeout(() => {
        menuPage.style.display = 'block'
        menuPage.innerHTML = ''

        // show menu items in UI
        for (let i = 0; i < menuItems.length; i++) {
            const row = document.createElement('div')
            const hr = document.createElement('hr')
            row.className = 'row'
            row.innerHTML = menuItems[i].map(item => {
                
                // compile item id from item name in English
                const itemNameTrimmed = item.nameEn.replace(/\s/g, '')
                const itemId = itemNameTrimmed.replace(itemNameTrimmed[0], itemNameTrimmed[0].toLowerCase())
                
                return `<div class="item-container">
                        <div class="item" id="${itemId}">
                            <img src="./images/${item.nameEn}.png" alt="">
                            <div class="item-content">
                                <h2 class="item-name-jp">${item.nameJp}</h2>
                                <h3 class="item-name-en">${item.nameEn}</h3>
                                <h3 class="item-price">$${item.price}</h3>
                                <button class="btn add-to-cart-btn">Add to Cart</button>
                            </div>
                        </div>
                    </div>`
            }).join(' ')

            menuPage.appendChild(row)
            // no horizontal line for the last row
            if (i < menuItems.length - 1) {
                menuPage.appendChild(hr)
            }
        }

        // select add to cart bottons again since the elements on this page is created after the whole html file loaded
        const addToCartBtns = document.querySelector('.menu-container').querySelectorAll('.add-to-cart-btn')
        addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
        // get clicked item info and put it into an object 
        const newItem = {
            id: e.target.parentElement.parentElement.id,
            nameJp: e.target.parentElement.querySelector('.item-name-jp').innerText,
            nameEn: e.target.parentElement.querySelector('.item-name-en').innerText,
            price: e.target.parentElement.querySelector('.item-price').innerText.replace('$', '')
        }

        // sent item to add to cart function 
        addItemToCart(newItem)
        
    })
})
    }, 700)
}

// **********************************************************************
// add items to cart funtion 
const addItemToCart = (item) => {
    const newItem = item

    // empty cart
    if (cartItems.length === 0) {
        item['amount'] = 1
        cartItems.push(item)

    // not empty cart 
    } else {

        // get index of item in cart
        const cartItemIds = cartItems.map(item => item.id)
        const itemInCartIdInd =  cartItemIds.indexOf(newItem.id)
            
        if (itemInCartIdInd < 0) {
            // item not found in cart
            newItem['amount'] = 1
            cartItems.push(newItem)

        } else {
            // item found in cart
            // get item in cart
            const itemInCart = cartItems.filter(item => item.id === newItem.id)[0]
            
            // increase amound by 1
            itemInCart.amount ++

            // replace old item in cart with the new item 
            cartItems.splice(itemInCartIdInd, 1, itemInCart)
            
        }
        
    }

    
    
    // show initial number of items in cart
    // calculate total item amount in cart 
    const itemAmountArr = cartItems.map(item => item.amount)
    const totalItemAmount = cartItems.length === 0 ? 0 :itemAmountArr.reduce((x, y) => x + y)
    cartNum.innerText = `(${totalItemAmount})`



    // save cart items in local storage 
    localStorage.setItem('cartItems', JSON.stringify(cartItems))

    const cartItemsLS = JSON.parse(localStorage.getItem('cartItems'))

    
}

// ***********************************************************************
// update cart items function
const createCartItems = () => {
    
    
    if (cartItems.length === 0) {
        cartContent.innerHTML = '<h1>Your cart is empty.</h1>'
        document.querySelector('.check-out-btn').style.display = 'none'
    } else {
        document.querySelector('.check-out-btn').style.display = 'flex'
        cartContent.innerHTML = cartItems.map(item => {
        return `<div class="item" id="${item.id}">
                        <div class="img-container">
                            <img src="./images/${item.nameEn}.png" alt="${item.nameEn}">
                        </div>
                        <div class="item-content">
                            <div class="cart-item-names">
                                <h2 class="item-name-jp">${item.nameJp}</h2>
                                <h3 class="item-name-en">${item.nameEn}</h3>
                            </div>
                            <h3 class="cart-item-price" id="cartItemPrice">$${item.price}</h3>

                            <div class="cart-item-actions">
                                <input type="number" min="1" value="${item.amount}" class="cart-item-amount">
                                <button class="cart-btn remove-item-btn">remove</button>
                            </div>
                        </div>
                    </div>`
}).join('')
    }

    
    
// show initial number of items in cart
 const itemAmountArr = cartItems.map(item => item.amount)
    const totalItemAmount = cartItems.length === 0 ? 0 :itemAmountArr.reduce((x, y) => x + y)
    cartNum.innerText = `(${totalItemAmount})`


// calculte and show cart total in UI
    calculateCartTotal()
    
}

// **********************************************************************
// update Cart Items in Local Stroage
const updateCartLS = () => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
}

// ***********************************************************************
// remove cart item function 
const removeCartItem = (id) => {
    const itemIndex = cartItems.findIndex(item => item.id === id)
    cartItems.splice(itemIndex, 1)
    // update UI
    createCartItems()
    // update Local Storage
    updateCartLS()
}


// *******************************************************************
const changeCartItemAmountInput = (amount, id, inputEle) => {
 
    // remove input message element if exsits
    const msgElement = inputEle.parentElement.parentElement.querySelector('.message')
    if (msgElement) {
        msgElement.remove()
    }

    
    // update local cartItems
    cartItems.forEach(item => {
        if (item.id === id) {
            item.amount = amount 
        }
    })

    // recalculte cart total and show in UI  
    calculateCartTotal()
}

// *******************************************************************
const showInputMessage = (validationState, ele) => {

   
    // show error message in UI 
    const inputParentElement = ele.parentElement.parentElement
    
    let msgElement = inputParentElement.querySelector('.message')

    if (!msgElement)  {
        // create error element if the first time entering invalid value
        msgElement = document.createElement('p') 
        msgElement.className =  `message`
        
        if (validationState === 'invalid') {
            msgElement.innerText = 'Please entere a valid number(1-8).'
        } else {
            msgElement.innerText = 'Remove item?'
        }
       
        const referenceElement = ele.parentElement
        
        inputParentElement.insertBefore(msgElement, referenceElement)

    } else if (msgElement) {
        // show appropriate input message if message element already exists
         msgElement.className =  `message`
         if (validationState === 'valid') {
            msgElement.remove()
        } else if (validationState === 'invalid') {
            msgElement.innerText = 'Please entere a valid number(1-8).'
        } else {
            msgElement.innerText = 'Remove item?'
        }
    }


    
}




// ************************************************************************
// show cart item elements function
const showCartItems = () => {


    
    // create item element in UI 
    createCartItems()

    // cart remove botton click event 
    const removeCartItemBtns = document.querySelectorAll('.remove-item-btn')
    removeCartItemBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            itemId = e.target.parentElement.parentElement.parentElement.id
            removeCartItem(itemId)
            showCart()
        })
    })

    // cart item input change event 
    const cartItemInputs = cartForm.querySelectorAll('.cart-item-amount')

    cartItemInputs.forEach(input => {
        input.addEventListener('change', (e) => {

            // get input value and event target element id
            const inputValue = e.target.value
            const itemId = e.target.parentElement.parentElement.parentElement.id
            
            // max order of 8
            if (+inputValue > 8) {
                showInputMessage('invalid', e.target)
            }

            //valid number within 1 - 8
            if (+inputValue > 0 && +inputValue < 9) {
                changeCartItemAmountInput(+inputValue, itemId, e.target)
            }

        
        }) 
        
    })

    cartItemInputs.forEach(input => input.addEventListener('blur', (e) => {
        
        const inputValue = e.target.value
        const itemId = e.target.parentElement.parentElement.parentElement.id

        // user entered invalid number 
        if (!inputValue || +inputValue > 8) {
            showInputMessage('invalid', e.target)

        // user entered valid number 
        } else if (+inputValue > 0 && +inputValue < 9) {
            showInputMessage('valid', e.target)
            changeCartItemAmountInput(+inputValue, itemId, e.target)
            

        // user entered 0 
        } else if (inputValue === '0') {
            showInputMessage('remove', e.target)
        }

    }))

   
}

// show cart function 
const showCart = () => {
    cartContainer.style.display = 'block'
    showCartItems()
}

// hide cart function 
const hideCart = () => {
    cartContainer.style.display = 'none'
}

// ************************************************************************
// EVENT LISTENERS
// hide greeting page - show home page event 
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loader.classList.add('hide')
        pageContainer.classList.add('show')
        homePage.classList.add('show')
    }, 1500)
    setTimeout(() => {
        loader.style.display = 'none'
        pageContainer.style.display = 'flex'
        homePage.style.display = 'block'
        // show initial number of items in cart
        cartNum.innerText = `(${totalItemAmount})`
    }, 2000)
})

// nav btn events 
homeBtn.addEventListener('click', () => {

    homePage.classList.remove('show')
    homePage.classList.add('show')
    menuPage.classList.remove('show')

    setTimeout(() => {
        menuPage.style.display = 'none'
        homePage.style.display = 'block'
    }, 300)
})

menuBtn.addEventListener('click', showMenu)

cartBtn.addEventListener('click', () => {
    showCart()
})

// order now button event > redirect to menu page
orderNowBtn.addEventListener('click', showMenu)


// add to cart btn click event
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // get clicked item info and put it into an object 
        const newItem = {
            id: e.target.parentElement.parentElement.id,
            nameJp: e.target.parentElement.querySelector('.item-name-jp').innerText,
            nameEn: e.target.parentElement.querySelector('.item-name-en').innerText,
            price: e.target.parentElement.querySelector('.item-price').innerText.replace('$', '')
        }
        

        // sent item to add to cart function 
        addItemToCart(newItem)
        
    })
})



// close cart buttons event 
closeCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        hideCart()
    })
})

// cart overlay click event 
cartContainer.addEventListener('click', (e) => {
    if (e.target.className === 'cart-container') {
        hideCart()
    }
})


// check out button click event
checkOutBtn.addEventListener('click', () => {
    const closeCartBtn = document.querySelector('.close-cart-btn')
        closeCartBtn.style.display = 'none'

    const cartActoins = document.querySelector('.cart-actions')
        cartActoins.innerHTML = ' <h1>Total: $<span class="cart-total">0</span></h1><button class="cart-btn  check-out-btn confirm-btn">Confirm Order</button>'
    
    calculateCartTotal()
})

 // cart form submit change event
    cartForm.addEventListener('submit', (e) => {
        e.preventDefault()
        
        // only do this after user clicked confirm button 
        const confirmBtn = document.querySelector('.confirm-btn')

        if (confirmBtn) {

            // show submission suncessfully message
            cartForm.innerHTML = '<div class="final-msg-container"><img src="./images/manekineko.png" alt=""><h1>Thank you! Your order is submitted successfully!</h1><div class="cart-actions"><div class="cart-btn close-cart close-cart-btn close-cart-btn-final">Close Cart</div></div></div>'
            
            // reload page when close final message element
            const closeCartBtn = document.querySelector('.close-cart-btn-final')

            closeCartBtn.addEventListener('click', () => {
                localStorage.clear()
                cartItems = []
                cartNum.innerText = '(0)'
                window.location.reload()
            })
        }

    })
    

