const fs = require("fs");

//defing the path of the JSON file where the users data is stored
const USERS_FILE = "users.json";

// Utility function to read users from the file
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Utility function to write users to file
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Function to display usage information
function showUsage() {
  console.log(`
Usage:
  node index.js user:create -f <First Name> -l <Last Name>
  node index.js user:lists
  node index.js user:update -f <Current First Name> -nf <New First Name> -l <New Last Name>
  node index.js user:delete [-f <First Name>] [--all]

Commands:
  user:create   Create a new user
  user:lists    List all users
  user:update   Update a user by their first name
  user:delete   Delete a user by their first name or delete all users
  `);
}

// Parsing command-line arguments manually
const args = process.argv.slice(2); // Extract arguments, skipping 'node' and script name
const command = args[0];

// Handling different commands based on the first argument
switch (command) {
  //command to create a new users
  case "user:create":
    {
      // Finding  the index of the first name and last name options
      const fnameIndex = args.indexOf("-f");
      const lnameIndex = args.indexOf("-l");

      if (fnameIndex !== -1 && lnameIndex !== -1) {
        //extracting the values for firstname and lastname
        const fname = args[fnameIndex + 1];
        const lname = args[lnameIndex + 1];

        if (!fname || !lname) {
          console.log("Both first name and last name are required.");
          break;
        }

        const users = readUsers();
        users.push({ fname, lname });
        writeUsers(users);
        console.log(`User ${fname} ${lname} created successfully.`);
      } else {
        console.log("Missing required options for creating a user.");
      }
    }
    break;

  //command to list all the users
  case "user:lists":
    {
      const users = readUsers();
      console.log("All the lists of users:", users);
    }
    break;

  //command to update a user by their firtnme
  case "user:update":
    {
      //Finding the indexs
      const fnameIndex = args.indexOf("-f");
      const newFnameIndex = args.indexOf("-nf");
      const newLnameIndex = args.indexOf("-l");

      if (fnameIndex !== -1 && newFnameIndex !== -1 && newLnameIndex !== -1) {
        //extracting the values
        const fname = args[fnameIndex + 1];
        const newFname = args[newFnameIndex + 1];
        const newLname = args[newLnameIndex + 1];

        if (!fname || !newFname || !newLname) {
          console.log("All name fields are required.");
          break;
        }

        const users = readUsers();
        //finding the index of the user
        const userIndex = users.findIndex((user) => user.fname === fname);

        //Check if the user exists.
        if (userIndex !== -1) {
          users[userIndex] = { fname: newFname, lname: newLname };
          writeUsers(users);
          console.log(`User ${fname} updated to ${newFname} ${newLname}.`);
        } else {
          console.log(`User ${fname} not found.`);
        }
      } else {
        console.log("Missing required options for updating a user.");
      }
    }
    break;

  //command to delete a user or all users
  case "user:delete":
    {
      const fnameIndex = args.indexOf("-f");
      const allIndex = args.indexOf("--all");

      let users = readUsers();

      if (allIndex !== -1) {
        //if -all then delete all users
        users = []; // Clear all users
        console.log("All users deleted.");
      } else if (fnameIndex !== -1) {
        //if -f then delete specific user
        const fname = args[fnameIndex + 1];
        const originalLength = users.length;

        // Filtering out the user with the specified first name.
        users = users.filter((user) => user.fname !== fname);
        const newLength = users.length;

        if (originalLength === newLength) {
          console.log(`User with first name ${fname} not found.`);
        } else {
          console.log(`User ${fname} deleted.`);
        }
      } else {
        console.log(
          "Specify a user to delete with -f or use --all to delete all users."
        );
      }

      writeUsers(users);
    }
    break;

  default:
    showUsage();
    break;
}
