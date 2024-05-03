async function relatedProducts() {
    return (await (await fetch("https://apexarray.onrender.com/fetchData")).json())
}

async function getCartLen() {
    if (localStorage.getItem("account")) {
        window.cartLen = JSON.parse(await (await fetch("https://apexarray.onrender.com/cart", {
            method: "post",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                email: localStorage.getItem("email")
            })
        })).json()).ids.length
    } else window.cartLen = 0
    if (document.querySelector(".cartNumber")) document.querySelector(".cartNumber").innerHTML = cartLen
}
getCartLen()

window.cartLen = 0

const queryParams = new URLSearchParams(window.location.search);

const id = queryParams.get('id');

async function checkIfInCart() {
    if (localStorage.getItem("account")) {
        let response = JSON.parse(await (await fetch("https://apexarray.onrender.com/cart", {
            body: JSON.stringify({ email: localStorage.getItem("email") }),
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }
        })).json())
        if (response.ids.includes(id)) return true;
        else return false;
    }
}


let Product

async function getInfo(id) {
    Product = await (await fetch("https://apexarray.onrender.com/fetchSingle", {
        body: JSON.stringify({
            id: id
        }),
        headers: {
            "Content-Type": "application/json"
        },
        method: "post"
    })).json();
}

getInfo(id)

window.onload = async () => {
    window.star = document.querySelector(".star").cloneNode(true)
    displayInfo()

    document.querySelector(".cartNumber").innerHTML = cartLen
    document.onscroll = e => {
        if (scrollY >= 200) document.querySelector(".scrollTop").classList.add("active")
        else document.querySelector(".scrollTop").classList.remove("active")
    }
    document.querySelector(".scrollTop").onclick = () => scroll(0, 0)

    document.querySelector(".logo").onclick = () => location.pathname = "/"
    if (document.querySelector(".signIn")) document.querySelector(".signIn").onclick = () => location.pathname = "/signIn/index.html"
    if (document.querySelector(".signIn")) document.querySelector(".signUp").onclick = () => location.pathname = "/signUp/index.html"
    if (document.querySelector(".signOut")) document.querySelector(".signOut").onclick = () => { localStorage.removeItem("account"); localStorage.removeItem("username"); localStorage.removeItem("email"); location.reload() }
    document.querySelector(".account").onclick = () => document.querySelector(".sign").classList.add("active")
    document.querySelector(".cart").onclick = () => location.pathname = "/cart/index.html"

    if (localStorage.getItem("account")) {
        document.querySelector(".sign").removeChild(document.querySelector(".signIn"))
        document.querySelector(".sign").removeChild(document.querySelector(".signUp"))
        document.querySelector(".signOut").classList.add("active")
    }

    if (localStorage.getItem("appearence") == "dark") {
        document.querySelector(".darkTheme").classList.add("active")
        document.querySelector(".lightTheme").classList.remove("active")
        document.body.classList.add("darkMode")
    }
    document.querySelector(".appearence").addEventListener("click", e => {
        if (localStorage.getItem("appearence") == "light") localStorage.setItem("appearence", "dark")
        else localStorage.setItem("appearence", "light")
        document.body.classList.toggle("darkMode")
        document.querySelectorAll(".theme").forEach(element => { element.classList.toggle("active") })
    })

    document.onclick = e => {
        let disable = true
        for (let i = 0; i < document.querySelector(".account").childNodes.length; i++) {
            if (e.target == document.querySelector(".account").childNodes[i]) {
                disable = false
                break
            }
        }
        if (disable || e.target == document.querySelector(".account")) document.querySelector(".sign").classList.remove("active")
    }

    let relatedProductsInfo = (await relatedProducts()).filter(e => {
        return (e.niche == Product.niche && e.id !== Product.id)
    })

    relatedProductsInfo.forEach(currentProduct => {

        let product = document.createElement("div")
        product.classList.add("relatedProduct")
        product.setAttribute("ID", currentProduct.id)
        document.querySelector(".relatedProductsList").appendChild(product)

        let productImage = document.createElement("div")
        productImage.classList.add("relatedProductImage")
        productImage.classList.add("relatedProductImage1")
        productImage.style.backgroundImage = `url(${currentProduct.imageUrl})`
        product.appendChild(productImage)

        let productImage2 = document.createElement("div")
        productImage2.classList.add("relatedProductImage")
        productImage2.classList.add("relatedProductImage2")
        productImage2.style.backgroundImage = `url(${currentProduct.moreImages})`
        product.appendChild(productImage2)

        let productInfo = document.createElement("div")
        productInfo.classList.add("relatedProductInfo")
        product.appendChild(productInfo)

        let productName = document.createElement("div")
        productName.classList.add("relatedProductName")
        productName.innerText = currentProduct.name
        productInfo.appendChild(productName)


        let productRating = document.createElement("div")
        productRating.classList.add("relatedProductRating")
        productRating.innerHTML = currentProduct.rating
        let ratingStar = star.cloneNode(true)
        ratingStar.classList.add("active")
        productRating.appendChild(ratingStar)
        productInfo.appendChild(productRating)

        let productPrice = document.createElement("div")
        productPrice.classList.add("relatedProductPrice")
        productPrice.innerHTML = `<p style="margin: 0 20px 0 0; padding: 0; text-decoration: line-through;">${(currentProduct.price * 1.5).toFixed(2)}$</p><h3 style="margin: 0; padding: 0; font-weight: 500; font-size: 25px;">${currentProduct.price}$</h3>`
        productInfo.appendChild(productPrice)

        product.onmouseenter = () => {
            productImage.classList.add("active")
            productImage2.classList.add("active")
        }
        product.onmouseleave = () => {
            productImage.classList.remove("active")
            productImage2.classList.remove("active")
        }
        product.classList.add("fade")
        fadeInAnimation()

        product.onclick = () => {

            let newUrl = new URL(location.href.split("?")[0])
            newUrl.pathname = "/View/index.html"

            newUrl.searchParams.append("id", product.getAttribute("ID"))
            location.href = newUrl.toString()
        }

    })
}

async function displayInfo() {
    if (!Product) {
        requestAnimationFrame(displayInfo)
        return
    }
    // displaying information
    document.querySelector(".name").innerHTML = Product.name

    document.querySelector(".rating").innerHTML += Product.rating

    document.querySelector(".description").innerHTML = "<h2>Description:</h2>" + `<p class="descriptionContent">${Product.description}</p>`

    fadeInAnimation()
    window.star.classList.add("active")
    document.querySelector(".rating").appendChild(star)


    for (const spec in Product.specs) {
        let container = document.createElement("div")
        container.classList.add("fade")
        document.querySelector(".table").appendChild(container)

        let specElement = document.createElement("div")
        specElement.classList.add("spec")
        specElement.innerHTML = spec + ":"
        container.appendChild(specElement)

        let valueElement = document.createElement("div")
        valueElement.classList.add("value")
        valueElement.innerHTML = Product.specs[spec]
        container.appendChild(valueElement)
    }


    document.querySelectorAll(".spec").forEach(el => {
        el.style.height = el.nextElementSibling.clientHeight + "px"
    })

    for (const benefit in Product.benefits) {
        let benefitEle = document.createElement("div")
        benefitEle.classList.add("benefit")
        benefitEle.classList.add("fade")
        document.querySelector(".benefitsList").appendChild(benefitEle)

        let benefitName = document.createElement("h4")
        benefitName.classList.add("benefitName")
        benefitName.innerHTML = benefit + ":"
        benefitEle.appendChild(benefitName)

        let benefitValue = document.createElement("p")
        benefitValue.innerHTML = Product.benefits[benefit]
        benefitValue.classList.add("benefitValue")
        benefitEle.appendChild(benefitValue)
    }

    document.querySelector(".mianImg").style.backgroundImage = `url(${Product.imageUrl})`
    console.log(Product);
    Product.moreImages.forEach(imgUrl => {
        let img = document.createElement("div")
        img.classList.add("img")
        img.style.backgroundImage = `url(${imgUrl})`
        document.querySelector(".imagesContainer").appendChild(img)
        let dot = document.createElement("div")
        dot.classList.add("dot")
        document.querySelector(".dots").appendChild(dot)
    })

    // if (screen.availWidth > 120 && screen.availWidth < 1200) {
    let touchX = 0
    document.querySelector(".imageOptions").addEventListener("touchstart", (touch) => touchX = touch.changedTouches[0].clientX)
    document.querySelector(".imageOptions").addEventListener("touchmove", (touch) => document.querySelector(".imagesContainer").style.transform = `translateX(${swipeLen + (touch.changedTouches[0].clientX - touchX)}px)`)
    document.querySelector(".imageOptions").addEventListener("touchend", (touch) => {
        if (touchX > touch.changedTouches[0].clientX + 100 && swipes !== Product.moreImages.length) {
            swipes++
            swipeLen -= document.querySelector(".img").clientWidth
            document.querySelector(".imagesContainer").style.transform = `translateX(${swipeLen}px)`
            document.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"))
            document.querySelectorAll(".dot")[swipes].classList.add("active")
        } else document.querySelector(".imagesContainer").style.transform = `translateX(${swipeLen}px)`

        if (touchX + 100 < touch.changedTouches[0].clientX && swipes !== 0) {
            swipes--
            swipeLen += document.querySelector(".img").clientWidth
            document.querySelector(".imagesContainer").style.transform = `translateX(${swipeLen}px)`
            document.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"))
            document.querySelectorAll(".dot")[swipes].classList.add("active")
        } else document.querySelector(".imagesContainer").style.transform = `translateX(${swipeLen}px)`
    })
    // }

    let swipeLen = 0
    let swipes = 0
    document.querySelector(".next").onclick = () => {
        if (swipes == Product.moreImages.length) return
        swipes++
        swipeLen -= document.querySelector(".img").clientWidth
        document.querySelector(".imagesContainer").style.transform = `translateX(${swipeLen}px)`
        document.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"))
        console.log(document.querySelectorAll(".dot")[swipes]);
        document.querySelectorAll(".dot")[swipes].classList.add("active")
    }
    document.querySelector(".prev").onclick = () => {
        if (swipes == 0) return
        swipes--
        swipeLen += document.querySelector(".img").clientWidth
        document.querySelector(".imagesContainer").style.transform = `translateX(${swipeLen}px)`
        document.querySelectorAll(".dot").forEach(dot => dot.classList.remove("active"))
        document.querySelectorAll(".dot")[swipes].classList.add("active")
    }

    document.querySelector(".imagesContainer").style.width = `${Product.moreImages.length * 100 + 100}%`

    document.querySelector(".realPrice").innerHTML = Product.price.toFixed(2) + "$"
    if (Product.promo) {
        document.querySelector(".promoPrice").innerHTML = (Product.price - (Product.price * Product.promo / 100)).toFixed(2) + "$"
        document.querySelector(".promoPrice").classList.add("active")
        document.querySelector(".realPrice").classList.add("active")
    }
    let index = 0
    if (await checkIfInCart()) document.querySelector(".addToCart").innerHTML = "Remove From Cart"

    document.querySelector(".addToCart").onclick = async () => {
        if (!localStorage.getItem("account")) {
            location.pathname = "/signIn/index.html"
            return
        }
        if (document.querySelector(".addToCart").innerHTML !== "Remove From Cart") {
            // if (await checkIfInCart()) {
            //     notification("Product is already in cart", 1)
            //     return
            // }
            addProductToCart(id)
            document.querySelector(".addToCart").innerHTML = "Remove From Cart"
            localStorage.setItem("inCart", true)
        } else {
            await removeProductFromCart(id)
            document.querySelector(".addToCart").innerHTML = "Add To Cart"
            localStorage.setItem("inCart", false)
        }
    }


    Product.reviews.forEach(e => {

        let review = document.createElement("div")
        review.classList.add("review")
        review.classList.add("fade")
        document.querySelector(".reviewsContainer").appendChild(review)

        let user = document.createElement("div")
        user.classList.add("user")
        review.appendChild(user)

        let avatar = document.createElement("div")
        avatar.innerHTML = Product.reviewsNames[index][0]
        avatar.classList.add("avatar")
        avatar.style.backgroundColor = generateRandomHexColor()
        user.appendChild(avatar)

        let userName = document.createElement("div")
        userName.classList.add("userName")
        userName.innerHTML = Product.reviewsNames[index]
        user.appendChild(userName)

        let userRating = document.createElement("div")
        userRating.classList.add("userRating")
        userRating.innerHTML = Product.ratingsList[index] + "/5"
        userRating.appendChild(star.cloneNode(true))
        user.appendChild(userRating)

        let reviewText = document.createElement("div")
        reviewText.classList.add("reviewText")
        reviewText.innerHTML = e
        review.appendChild(reviewText)


        index++
    });

    function generateRandomHexColor() {
        let chars = "0123456789abcdef"
        let color = ""
        for (let i = 0; i < 3; i++) {
            color += (chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)])
        }
        return "#" + color
    }
}

async function addProductToCart(id) {
    let response = JSON.parse(await (await fetch("https://apexarray.onrender.com/addToCart", {
        body: JSON.stringify({ id: id, email: localStorage.getItem("email") }),
        method: "post",
        headers: {
            "Content-Type": "application/json"
        }
    })).json())
    document.querySelector(".cartNumber").innerHTML = +document.querySelector(".cartNumber").innerHTML + 1
    notification(response.message, response.notificationState)
}

async function removeProductFromCart(id) {
    (await (await fetch("https://apexarray.onrender.com/cartRemove", {
        body: JSON.stringify({ id: id, email: localStorage.getItem("email") }),
        method: "post",
        headers: {
            "Content-Type": "application/json"
        }
    })).json())
    document.querySelector(".cartNumber").innerHTML = +document.querySelector(".cartNumber").innerHTML - 1
    notification("Product Has Been Removed From Cart", 2)
}

function notification(message, positive) {
    if (positive == 0) document.querySelector(".notification").classList.add("danger")
    if (positive == 1) document.querySelector(".notification").classList.add("warning")
    document.querySelector(".notification").classList.add("active")
    document.querySelector(".notification").innerHTML = message
    setTimeout(() => document.querySelector(".notification").classList.remove("active"), 3000);
}

function fadeInAnimation() {
    let elements = document.querySelectorAll(".fade")

    elements.forEach(e => {
        let elementTop = e.getBoundingClientRect().top
        let revealPoint = 25

        if (elementTop < innerHeight - revealPoint) e.classList.add("active")
        else e.classList.remove("active")
    })
}

window.addEventListener("scroll", fadeInAnimation)

let boughtTimer = +localStorage.getItem("bought") || 10000

function bought() {

    boughtTimer = Math.round(boughtTimer + (Math.random() * 600000))

    localStorage.setItem("bought", boughtTimer)

    let names = ["Elijah Davidson", "Luna Patel", "Maxwell Yang", "Amelia Casey", "Leo Nguyen", "Ava Garcia", "Logan Johnson", "Olivia Khan", "Mason Williams", "Sophia Rodriguez", "Ethan Smith", "Isabella Martinez", "Liam Brown", "Mia Lee", "Noah Jones", "Charlotte Davis", "Lucas Taylor", "Aria Wilson", "Oliver Anderson", "Emma Thompson", "Carter Clark", "Avery Hall", "Benjamin Hernandez", "Harper Lewis", "Elijah Martin", "Emily White", "William Walker", "Ella Robinson", "James Baker", "Madison Wright", "Alexander Allen", "Scarlett Hall", "Michael Green", "Sofia Adams", "Daniel King", "Chloe Scott", "Henry Turner", "Aubrey Carter", "Jackson Mitchell", "Grace Hill", "Sebastian Moore", "Avery Foster", "David Morales", "Aurora Perez", "Caleb Flores", "Hannah Kim", "Ryan Russell", "Zoe Torres", "Gabriel Diaz", "Ariana James", "Samuel Stewart", "Addison Rivera", "Dylan Rogers", "Evelyn Wood", "Matthew Ward", "Victoria Price", "Owen Stewart", "Natalie Cooper", "Wyatt Perry", "Lily Ramirez", "Jack Brooks", "Brooklyn Evans", "Luke Coleman", "Audrey Morgan", "Jayden Peterson", "Claire Bailey", "Christopher Reed", "Stella Gonzales", "Isaac Cox", "Leah Butler", "Lincoln Long", "Bella Kelly", "Mateo Howard", "Layla Hayes", "Julian Rivera", "Nova Coleman", "Eli Washington", "Skylar Bryant", "Aaron Ward", "Maya Murphy", "Nathan Taylor", "Eva Alexander", "Hudson Reed", "Alice Nelson", "Connor Baker", "Penelope Carter", "Jonathan Griffin", "Aaliyah Price", "Levi Phillips", "Ellie Peterson", "Christian Cook", "Madelyn Powell", "Isaiah Brooks", "Katherine Butler", "Josiah Morris", "Gabriella Sanchez", "Grayson Hill", "Alyssa Gomez", "Julian Fisher", "Gianna Cooper", "Hunter Ross", "Naomi Richardson", "Cameron Simmons", "Ruby Bell", "Eliana Stewart", "Carson Murphy", "Clara Howard", "Charles Henderson", "Sarah Kelly", "Dominic Bennett", "Allison Roberts"]
    let items = ["Smart Sensing Interactive Cat Snake.</p>&nbsp;For 9.99$", "Cat Lollipop.</p>&nbsp;For 9.99$", "All In One Led Jellyfish Lamp.</p>&nbsp;For 59.99$", "Leg Air Pressure Massager.</p>&nbsp;For 49.99$"]

    document.querySelector(".boughtText").innerHTML = `<p class="highlight">${names[Math.floor(Math.random() * names.length)]}.</p><p>&nbsp;Has Purchased&nbsp;</p><p class="highlight">${items[Math.floor(Math.random() * items.length)]}</p>`;
    document.querySelector(".bought").classList.add("active")

    setTimeout(() => document.querySelector(".bought").classList.remove("active"), 10000);
    setTimeout(bought, boughtTimer);
}

setTimeout(bought, boughtTimer);