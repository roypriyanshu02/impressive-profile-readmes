# Contributing Guidelines 🗒️

Hi! We're really excited that you're interested in contributing to our project! Before submitting your contribution, please take a moment to read through the following guidelines:

- [Pull Request Guidelines](#pull-request-guidelines-)
  - [To Add, Remove, or Update Github Profile Readmes](#to-add-remove-or-update-github-profile-readmes-)
  - [To Fix a Bug, Add an Improvement, or New Feature](#to-fix-a-bug-add-an-improvement-or-new-feature-%EF%B8%8F)
  - [Considerations](#considerations-)
- [Issues Guidelines](#issues-guidelines-)
  - [Issue Report](#issue-report-)
  - [Feature Request](#feature-request-)

## Pull Request Guidelines 🔧

If you're interested in making change, please follow the steps outlined below before submitting a pull request. If you're working on your first pull request, we recommend referring to [First Contribution Guide](https://github.com/firstcontributions/first-contributions) for guidance.

### To Add, Remove, or Update Github Profile Readmes: 📊

We welcome impressive Github profile readmes.

1. Fork this repository.

2. Clone your new repository to your system.

3. Add, remove, or update the profile.

   - To add a profile, add it below the heading of the category that best fits it, alphabetically and following this format: `- [username](link to your GitHub profile)`.

     Example: Adding profile of Aveek-Saha

     ```diff
       ### Minimalistic

       - [alexmartinfr](https://github.com/alexmartinfr)
     + - [aveek-saha](https://github.com/aveek-saha)
       - [caneco](https://github.com/caneco)
       - [dennishartrampf](https://github.com/dennishartrampf)
     ```

   - To remove a profile, delete the exact line that contains the username and link of that profile.

     Example: Removing profile of Aveek-Saha

     ```diff
       ### Minimalistic

       - [alexmartinfr](https://github.com/alexmartinfr)
     - - [aveek-saha](https://github.com/aveek-saha)
       - [caneco](https://github.com/caneco)
       - [dennishartrampf](https://github.com/dennishartrampf)
     ```

   - To update the category of a profile, simply move the specific line that includes the username and link of the profile from under the previous category heading to below the appropriate, newly chosen category heading. Additionally, to update the screenshot, remove or delete the `[<username>].webp` file from the `screenshot/` folder/directory. Finally, if you need to update the profile username or link, replace the current information with the updated username and link, making sure to maintain the alphabetical order and format.

   Example: Updating profile of Aveek-Saha

   ```diff
     ### Dynamic Realtime

     - [andyruwruw](https://github.com/andyruwruw)
     - [anuraghazra](https://github.com/anuraghazra)
   + - [aveek-saha](https://github.com/aveek-saha)
     - [daniakash](https://github.com/daniakash)
     - [denvercoder1](https://github.com/denvercoder1)

     ### Minimalistic

     - [alexmartinfr](https://github.com/alexmartinfr)
   - - [aveek-saha](https://github.com/aveek-saha)
     - [caneco](https://github.com/caneco)
     - [dennishartrampf](https://github.com/dennishartrampf)
   ```

4. Commit changes and push to the fork repository by following this commit message format: `[Add/Remove/Update] [<profile_username>] profile`.

   Example: Adding Aveek-Saha's profile commit message

   ```bash
   git commit -m"Add Aveek-Saha's profile to the Minimalistic category"
   ```

5. Open and submit a pull request.

### To Fix a Bug, Add an Improvement, or New Feature: 🐛🛠️🚀

We welcome contributions to enhance the quality and functionality of this project.

1. Fork this repository.

2. Clone your new repository to your system.

3. Make your changes.

4. Commit changes and push to the fork repository, ensuring to include a clear and descriptive commit message that adheres to the imperative mood formatting guidelines.

5. Open and submit a pull request.

### Considerations: 🤔

1. Please check your spelling and grammar.

2. Please ensure your text editor is set to remove trailing whitespace. Additionally, using the prettier extension is preferable.

3. Please make an individual pull request for each change.

## Issues Guidelines 📝

If you're experiencing a problem or have an idea for a new feature, please follow the steps outlined below before creating an issue.

### Bug Report 🐛

1. Search existing issues to see if someone else has already reported the same problem before creating a new issue.

2. Create a new issue by clicking the "New Issue" button on the Issues page.

3. Write a clear and descriptive description of the problem. This should include:

   - A brief summary of the issue
   - Expected and actual results
   - Additional context, such as:
     - Screenshots, if applicable
     - Environment details (e.g. browser, operating system, version of the project)

4. Assign appropriate labels to the issue.
5. Submit the issue.

### Feature Request 🚀

1. Search existing issues to see if someone else has already requested a similar feature before creating a new issue.

2. Create a new issue by clicking the "New Issue" button on the Issues page.

3. Write a clear and descriptive description of the feature you would like to see added. This should include:

   - A brief summary of the feature
   - Additional context, such as:
     - Screenshots or mockups, if applicable
     - Any references or examples of similar features in other projects

4. Assign the "feature request" label to the issue.

5. Submit the issue.

Thank you for considering contributing. 🤝
