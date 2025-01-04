# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

Table Structure 
1. Users Table
Stores information about each user.

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2. Friends Table
Stores information about friend.

CREATE TABLE friendships (
    user_id1 INT,
    user_id2 INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id1, user_id2),
    FOREIGN KEY (user_id1) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id2) REFERENCES users(user_id) ON DELETE CASCADE,
    CHECK (user_id1 < user_id2) -- Ensures each friendship is stored only once and avoids self-referencing friendships
);

3. Groups Table
Stores information about each group.

CREATE TABLE groups (
    group_id INT PRIMARY KEY AUTO_INCREMENT,
    group_name VARCHAR(100) NOT NULL,
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

4. Group Members Table
Stores the relationship between users and groups.

CREATE TABLE group_members (
    group_member_id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT,
    user_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(group_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

5. Expenses Table
Stores information about each expense.

CREATE TABLE expenses (
    expense_id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT,
    description VARCHAR(255),
    amount DECIMAL(10, 2),
    paid_by INT, -- User who paid the expense,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expense_date DATE
    FOREIGN KEY (group_id) REFERENCES groups(group_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

6. Expense Shares Table
Stores information about how each expense is split among users.

CREATE TABLE expense_shares (
    expense_share_id INT PRIMARY KEY AUTO_INCREMENT,
    expense_id INT,
    user_id INT, -- User who owes a share of the expense
    amount DECIMAL(10, 2),
    FOREIGN KEY (expense_id) REFERENCES expenses(expense_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

7. Settlements Table
Stores information about settled debts.

CREATE TABLE settlements (
    settlement_id INT PRIMARY KEY AUTO_INCREMENT,
    payer_id INT, -- User who paid the settlement
    payee_id INT, -- User who received the settlement
    amount DECIMAL(10, 2),
    currency VARCHAR(10),
    settlement_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payer_id) REFERENCES users(user_id),
    FOREIGN KEY (payee_id) REFERENCES users(user_id)
);

Sample Data and Usage
Users: Store user registration information.
Groups: Create groups for different sets of people.
Group Members: Add users to groups.
Expenses: Log expenses with descriptions, amounts, and the user who paid.
Expense Shares: Specify how each expense is split among users.
Settlements: Record payments between users to settle debts.
