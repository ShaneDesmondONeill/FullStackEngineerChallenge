## Design Decisions

The most important aspect of the design seemed to me to be the authentication. As part of my security training I learned that it is best to use a select number of well-tested and trusted methods for authentication. I chose cognito because I wanted to make an app that could be put into production and I was familiar with AWS services. I also know that the amplify library is quite easy to use. However, amplify does not provide role-based authentication out of the box, and it's actually quite tricky to set up. I decided to use a custom authorizer to protect the backend lambda functions. By assuming that all claims in the JWT token are valid after verifying with the public cognito user-pool keys, I can not only restrict access to the apis based on user pool access, but assign different access based on the user group found in the JWT token. This would provide a robust and secure solution.

For the database, I chose dynamodb (NOSQL). Dynamodb is very easy to work with, and I could locate all the required information on a single table. As I assumed I was building a HR tool for internal use, I believed the number of connections would be low compared to a more public facing app, and so dynamodb seemed quite an appropriate choice.

For the backend, I wanted to use something that would allow for local debugging, be quick to develop with, but still would be useable in production and at a reasonable cost. Using the Serverless framework seemed like the obvious choice.

On the frontend, React is what I have used for most of my career and is the best choice currently for a frontend framework for numerous reasons. I decided not to use redux or react-router as this seemed to be a very small app without the complexity that would necessitate their use. In my initial planning, I could accomplish all the requirements in three screens, so this seemed to be a poor use-case for redux and react-router seemed unneeded. I used the excellent create-react-app for rapid development to be started.

I decided to use Typescript on the Frontend and the backend because it would help me identify bugs or problems before they happen, speed my development and make it easier to refactor. That said, the approach I took was not too disciplined as I would have taken given more time. Where it seemed like typescript would not have helped that much I used any types. Using a kind of DRY principle, I added types if I encountered an error that would otherwise have been solved at compile time by TS.

## Assumptions

The biggest assumption made was that tests would not be needed. This is generally bad practice, but not using tests was carefully considered. The time constraints combined with the large potential number and complexity of requirements meant that something had to be sacrificed. Although the spec says that a complete solution was not required (and indeed several requirements were not added), it was decided to add as many as possible to demonstrate a complete vision of what the app should be. Unit testing UI is often not very useful in preventing bugs (integration testing seems much better bang for buck here), and in general: the apis were quite simple (using the AWS toolkit to do most of the heavy lifting). Testing the apis as they were would have required heavy mocking, and it seemed for little benefit in this case. Therefore, it was decided to leave testing or TDD out of the equation.

One of the first assumptions made was about creating admin roles. As this seemed like an event that would be seldomly needed and always remembering the limited scope of the app, it was decided to have a manual process for registering new admins. After registration, the admin must be manually assigned to the admin group by a developer with the appropriate credentials.

Following this, it was decided a significant amount of time would be spend on the design and UX aspect of the app. There are many areas of improvement that could be addressed, however, my goal was to use the pareto principle of achieving 80% of the results with 20% of the work. I think the app fits the aesthetic of Paypay and has a decent look and feel. Looking back, the spacing seems too large and the alignment is sometimes inconsistent. That being said I'm reasonably happy with the results.

Another assumption I made was that it was better to have a more fleshed-out web app with working apis than to have a more bare-bones but polished end product. For example, when adding a user from the admin screen the update is not reflected immediately on the screen, and on the same admin screen assigned employees will not show as checked boxes. There are numerous issues such as this which bothered me, but I did not complete due to lack of time.

Finally, I have included the login information for both an admin and an employee below

Admin:
Username: shack9@gmail.com
Password: testtest

Employee:
Username: shanedesmondoneill@gmail.com
Password: testtest
