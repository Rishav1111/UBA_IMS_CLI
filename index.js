const { Command } = require("commander");
const fs = require("fs");
const program = new Command();

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

// Command to create a new user
program
  .command("user:create")
  .description("Create a new user")
  .requiredOption("-f, --fname <First Name>", "First name")
  .requiredOption("-l, --lname <Last Name>", "Last name")
  .action((options) => {
    const { fname, lname } = options; //Destructuring options to extact fname and lname
    if (!fname || !lname) {
      console.log("Both fname and lname are required");
      return;
    }

    const users = readUsers();
    users.push({ fname, lname });
    writeUsers(users);
    console.log(`User ${fname} ${lname} created successfully.`);
  });

// Command to list all the users from the file
program
  .command("user:lists")
  .description("list all the users.")
  .action(() => {
    const users = readUsers();
    console.log("All the lists of users:", users);
  });

//command to update the user by thier firstname
program
  .command("user:update")
  .description("Update the user by their first name")
  .requiredOption(
    "-f, --fname <fname>",
    "Current first name of the user to update"
  )
  .requiredOption("-n, --newFname <newFname>", "New first name")
  .requiredOption("-l, --newLname <newLname>", "New last name")
  .action((options) => {
    //when the command is executed, this action is

    const { fname, newFname, newLname } = options; //Destructuring options to extact 'fname', 'newFname', and 'newLname'.
    const users = readUsers();

    // Find the index of the user with the current first name.
    const userIndex = users.findIndex((user) => user.fname === fname);
    if (userIndex !== -1) {
      //Check if the user exists (index found).
      users[userIndex] = { fname: newFname, lname: newLname };
      writeUsers(users);
      console.log(`User ${fname} updated to ${newFname} ${newLname}`);
    } else {
      console.log(`User ${fname} not found.`);
    }
  });

//command to delete specific user or all the users
program
  .command("user:delete")
  .description("Delete a user")
  .option("-f, --fname <First name>", "First name of the user to delete")
  .option("--all", "Delete all users")
  .action((options) => {
    let users = readUsers();

    if (options.all) {
      // Check if the --all flag is set.
      users = []; // Clear all users
      console.log("All users deleted.");
    } else {
      const originalLength = users.length;

      // Filtering out the user with the specified first name.
      users = users.filter((user) => user.fname !== options.fname);
      const newLength = users.length;

      if (originalLength === newLength) {
        console.log(`User with first name ${options.fname} not found.`);
      } else {
        console.log(`User ${options.fname} deleted.`);
      }
    }

    writeUsers(users);
  });

// Parsing the command-line arguments
program.parse(process.argv);
