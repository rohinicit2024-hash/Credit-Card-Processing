/* =========================================
   USER LOGIN
========================================= */

function login() {

    let username =
        document.getElementById("username").value.trim();

    let password =
        document.getElementById("password").value.trim();


    /* Check username and password */

    if (username === "" || password === "") {

        alert("Please enter username and password.");

        return;
    }


    /* Save username */

    localStorage.setItem(
        "username",
        username
    );


    /* Login is directly verified */

    localStorage.setItem(
        "loginVerified",
        "true"
    );


    /* Get members */

    let members =
        JSON.parse(
            localStorage.getItem("members")
        ) || [];


    /* Find existing member */

    let existingMember =
        members.find(function(member) {

            return member.username === username;

        });


    if (!existingMember) {

        members.push({

            username: username,

            status: "Logged In"

        });

    } else {

        existingMember.status =
            "Logged In";

    }


    /* Save members */

    localStorage.setItem(
        "members",
        JSON.stringify(members)
    );


    alert("Login successful!");


    /* Go directly to Dashboard */

    window.location.href =
        "dashboard.html";
}


/* =========================================
   CHECK USER
========================================= */

function checkUser() {

    let username =
        localStorage.getItem("username");

    let loginVerified =
        localStorage.getItem("loginVerified");


    if (
        !username ||
        loginVerified !== "true"
    ) {

        window.location.href =
            "index.html";

    }

}


/* =========================================
   DASHBOARD
========================================= */

function loadDashboard() {

    let username =
        localStorage.getItem("username");


    let customerName =
        document.getElementById(
            "customerName"
        );


    if (customerName) {

        customerName.textContent =
            username;

    }


    /* Get transactions */

    let transactions =
        JSON.parse(
            localStorage.getItem(
                "transactions"
            )
        ) || [];


    /* Current user's transactions */

    let userTransactions =
        transactions.filter(
            function(transaction) {

                return (
                    transaction.username ===
                    username
                );

            }
        );


    /* Calculate total */

    let total = 0;


    userTransactions.forEach(
        function(transaction) {

            total +=
                Number(transaction.amount);

        }
    );


    let totalSpent =
        document.getElementById(
            "totalSpent"
        );


    let transactionCount =
        document.getElementById(
            "transactionCount"
        );


    if (totalSpent) {

        totalSpent.textContent =
            "₹" + total;

    }


    if (transactionCount) {

        transactionCount.textContent =
            userTransactions.length;

    }

}


/* =========================================
   FORGOT USERNAME
========================================= */

function forgotUsername() {

    alert(
        "Please contact the Administrator.\n\n" +
        "Administrator Email: admin@creditcard.com"
    );

}


/* =========================================
   FORGOT PASSWORD
========================================= */

function forgotPassword() {

    alert(
        "Please contact the Administrator to reset your password."
    );

}


/* =========================================
   CONTINUE PAYMENT
========================================= */

function continuePayment() {

    let cardHolder =
        document.getElementById(
            "cardHolder"
        ).value.trim();


    let cardNumber =
        document.getElementById(
            "cardNumber"
        ).value.trim();


    let amount =
        document.getElementById(
            "amount"
        ).value.trim();


    let paymentPassword =
        document.getElementById(
            "paymentPassword"
        ).value.trim();


    let username =
        localStorage.getItem(
            "username"
        );


    /* Check login */

    if (!username) {

        alert(
            "Please login first."
        );

        window.location.href =
            "index.html";

        return;
    }


    /* Check all fields */

    if (
        cardHolder === "" ||
        cardNumber === "" ||
        amount === "" ||
        paymentPassword === ""
    ) {

        alert(
            "Please enter all payment details."
        );

        return;
    }


    /* Check card number */

    if (
        !/^\d{16}$/.test(cardNumber)
    ) {

        alert(
            "Please enter a valid 16-digit card number."
        );

        return;
    }


    /* Check amount */

    if (
        Number(amount) <= 0
    ) {

        alert(
            "Please enter a valid payment amount."
        );

        return;
    }


    /* Check password length */

    if (
        paymentPassword.length < 4
    ) {

        alert(
            "Payment password must contain at least 4 characters."
        );

        return;
    }


    /*
       Create a separate password
       for each customer
    */

    let passwordKey =
        "paymentPassword_" +
        username;


    let savedPassword =
        localStorage.getItem(
            passwordKey
        );


    /* =========================================
       FIRST PAYMENT
    ========================================= */

    if (!savedPassword) {

        localStorage.setItem(
            passwordKey,
            paymentPassword
        );


        alert(
            "Your payment password has been created successfully."
        );

    }


    /* =========================================
       EXISTING CUSTOMER
    ========================================= */

    else {

        if (
            paymentPassword !==
            savedPassword
        ) {

            alert(
                "Incorrect payment password."
            );

            return;
        }

    }


    /* =========================================
       SAVE TEMPORARY PAYMENT DETAILS
    ========================================= */

    localStorage.setItem(
        "pendingCardHolder",
        cardHolder
    );


    localStorage.setItem(
        "pendingCardNumber",
        cardNumber
    );


    localStorage.setItem(
        "pendingAmount",
        amount
    );


    /* =========================================
       GENERATE PAYMENT OTP
    ========================================= */

    let otp =
        Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();


    localStorage.setItem(
        "otp",
        otp
    );


    /* Open Payment OTP */

    window.location.href =
        "otp.html";
}


/* =========================================
   SHOW PAYMENT OTP
========================================= */

function showOTP() {

    let otp =
        localStorage.getItem(
            "otp"
        );


    if (!otp) {

        window.location.href =
            "payment.html";

        return;
    }


    let displayOTP =
        document.getElementById(
            "displayOTP"
        );


    if (displayOTP) {

        displayOTP.textContent =
            otp;

    }

}


/* =========================================
   VERIFY PAYMENT OTP
========================================= */

function verifyOTP() {

    let enteredOTP =
        document.getElementById(
            "otp"
        ).value.trim();


    let correctOTP =
        localStorage.getItem(
            "otp"
        );


    /* Check empty OTP */

    if (
        enteredOTP === ""
    ) {

        alert(
            "Please enter OTP."
        );

        return;
    }


    /* Check OTP */

    if (
        enteredOTP !==
        correctOTP
    ) {

        alert(
            "Invalid OTP. Please try again."
        );

        return;
    }


    /* Save transaction */

    saveTransaction();


    /* Remove temporary data */

    localStorage.removeItem(
        "otp"
    );


    localStorage.removeItem(
        "pendingCardHolder"
    );


    localStorage.removeItem(
        "pendingCardNumber"
    );


    localStorage.removeItem(
        "pendingAmount"
    );


    alert(
        "Payment Processed Successfully!"
    );


    /* Return to Dashboard */

    window.location.href =
        "dashboard.html";
}


/* =========================================
   SAVE TRANSACTION
========================================= */

function saveTransaction() {

    let username =
        localStorage.getItem(
            "username"
        );


    let cardHolder =
        localStorage.getItem(
            "pendingCardHolder"
        );


    let amount =
        localStorage.getItem(
            "pendingAmount"
        );


    let transactions =
        JSON.parse(
            localStorage.getItem(
                "transactions"
            )
        ) || [];


    let currentDate =
        new Date();


    /* Create Transaction ID */

    let transactionId =
        "TXN" +
        Date.now();


    /* Create transaction */

    let transaction = {

        username:
            username,

        date:
            currentDate.toLocaleDateString(
                "en-GB"
            ),

        time:
            currentDate.toLocaleTimeString(
                "en-IN"
            ),

        transactionId:
            transactionId,

        cardHolder:
            cardHolder,

        amount:
            amount,

        status:
            "Successful"

    };


    /* Add transaction */

    transactions.push(
        transaction
    );


    /* Save transactions */

    localStorage.setItem(
        "transactions",
        JSON.stringify(
            transactions
        )
    );

}


/* =========================================
   LOAD TRANSACTIONS
========================================= */

function loadTransactions() {

    let username =
        localStorage.getItem(
            "username"
        );


    let transactions =
        JSON.parse(
            localStorage.getItem(
                "transactions"
            )
        ) || [];


    /* Get only current user's transactions */

    let userTransactions =
        transactions.filter(
            function(transaction) {

                return (
                    transaction.username ===
                    username
                );

            }
        );


    let table =
        document.getElementById(
            "transactionTable"
        );


    if (!table) {

        return;

    }


    /* No transactions */

    if (
        userTransactions.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td colspan="6">

                    No transactions available

                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML = "";


    /* Display transactions */

    userTransactions.forEach(
        function(transaction) {

            table.innerHTML += `

                <tr>

                    <td>
                        ${transaction.date}
                    </td>

                    <td>
                        ${transaction.time}
                    </td>

                    <td>
                        ${transaction.transactionId}
                    </td>

                    <td>
                        ${transaction.cardHolder}
                    </td>

                    <td>
                        ₹${transaction.amount}
                    </td>

                    <td class="success">
                        ${transaction.status}
                    </td>

                </tr>

            `;

        }
    );

}


/* =========================================
   USER LOGOUT
========================================= */

function logout() {

    let username =
        localStorage.getItem(
            "username"
        );


    let members =
        JSON.parse(
            localStorage.getItem(
                "members"
            )
        ) || [];


    /* Update member status */

    members.forEach(
        function(member) {

            if (
                member.username ===
                username
            ) {

                member.status =
                    "Logged Out";

            }

        }
    );


    /* Save members */

    localStorage.setItem(
        "members",
        JSON.stringify(
            members
        )
    );


    /* Remove login details */

    localStorage.removeItem(
        "username"
    );


    localStorage.removeItem(
        "loginVerified"
    );


    alert(
        "You have been logged out."
    );


    window.location.href =
        "index.html";
}


/* =========================================
   ADMIN LOGIN
========================================= */

function adminLogin() {

    let adminUsername =
        document.getElementById(
            "adminUsername"
        ).value.trim();


    let adminPassword =
        document.getElementById(
            "adminPassword"
        ).value.trim();


    /* Administrator credentials */

    let correctUsername =
        "admin";


    let correctPassword =
        "admin123";


    if (
        adminUsername ===
        correctUsername &&
        adminPassword ===
        correctPassword
    ) {

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );


        alert(
            "Administrator login successful!"
        );


        window.location.href =
            "admin.html";

    } else {

        alert(
            "Invalid administrator username or password."
        );

    }

}


/* =========================================
   CHECK ADMIN
========================================= */

function checkAdmin() {

    let admin =
        localStorage.getItem(
            "adminLoggedIn"
        );


    if (
        admin !== "true"
    ) {

        window.location.href =
            "admin-login.html";

    }

}


/* =========================================
   ADMIN DASHBOARD
========================================= */

function loadAdminDashboard() {

    let members =
        JSON.parse(
            localStorage.getItem(
                "members"
            )
        ) || [];


    let transactions =
        JSON.parse(
            localStorage.getItem(
                "transactions"
            )
        ) || [];


    /* Total Members */

    let totalMembers =
        document.getElementById(
            "totalMembers"
        );


    if (totalMembers) {

        totalMembers.textContent =
            members.length;

    }


    /* Logged-in Members */

    let loggedInMembers =
        members.filter(
            function(member) {

                return (
                    member.status ===
                    "Logged In"
                );

            }
        );


    let loggedInElement =
        document.getElementById(
            "loggedInMembers"
        );


    if (loggedInElement) {

        loggedInElement.textContent =
            loggedInMembers.length;

    }


    /* Total Transactions */

    let totalTransactions =
        document.getElementById(
            "totalTransactions"
        );


    if (totalTransactions) {

        totalTransactions.textContent =
            transactions.length;

    }


    /* Member table */

    let table =
        document.getElementById(
            "memberTable"
        );


    if (!table) {

        return;

    }


    /* No members */

    if (
        members.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td colspan="2">

                    No members available

                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML = "";


    /* Display members */

    members.forEach(
        function(member) {

            table.innerHTML += `

                <tr>

                    <td>
                        ${member.username}
                    </td>

                    <td>
                        ${member.status}
                    </td>

                </tr>

            `;

        }
    );

}


/* =========================================
   ADMIN LOGOUT
========================================= */

function adminLogout() {

    localStorage.removeItem(
        "adminLoggedIn"
    );


    alert(
        "Administrator logged out successfully."
    );


    window.location.href =
        "admin-login.html";
}