# How Amazon Does QA and DevOps

## ▷ Introduction

One of the biggest challenges that software engineering students face coming out of university and into the workforce is how to translate their development, QA, testing habits, etc. (or lack thereof) into meaningful, consistent, and industry-grade practices. This is one of the challenges that I want to prepare for as I graduate and pursue full-time work in April. Searching for full-time work has almost become a part-time job for me. While getting the job is one thing, though, performing well at a job is another matter entirely. Part of being a good software engineer is having solid DevOps and QA practices established. To further this goal, I've decided to do a deep-dive into how engineers at one of the largest tech companies in the world, Amazon, do their QA and DevOps.

## ⎈ Exploration

To start my exploration into how Amazon approaches QA and DevOps, I decided to look at Amazon's own published materials first and then graduate to secondary sources.

### AWS DevOps Guidance

Amazon Web Services (AWS) has an entire manual of Amazon-derived QA and DevOps best practices for companies and users to implement into their workflows, titled [AWS Well-Architected DevOps Guidance](https://docs.aws.amazon.com/wellarchitected/latest/devops-guidance/devops-guidance.html). While this is a customer-facing guide meant to be used in conjunction with the AWS Well-Architected Tool, they state that the guidance found in the manual is "based on \[Amazon's\] expertise operating and managing services for global customers." Whether or not this perfectly mirrors Amazon's own practices (resources describing which would be confidential in any case), there are still several golden nuggets of wisdom that I was able to find.

1. **Developer operations are people- and culture-focused.** Quality assurance and developer operations pipelines are bottlenecked by the company's culture around them and the support that developers receive in upholding them. Having a focus on people and culture in the company allows for effective DevOps practices to take root and be adopted over a long period of time, driving successful development.
2. **Mutual achievements dominate individual successes.** As the saying goes, there's no "I" in team. Amazon understands this principle as well, and so they recommend fostering a culture of shared accountability, common goals, collaboration, and communication. As teams focus on these cultural aspects, their ability to make progress accelerates and the quality of the product they deliver grows.
3. **Teams own the whole production process.** Amazon focuses on what they call "two-pizza teams," a term coined by Jeff Bezos that describes a team small enough to only require two pizzas to be fed. These teams are highly focused on their specific products and, more importantly, rarely hand off their products to other teams. They oversee the entire process—development, testing, running, and maintaining—which fosters the aforementioned accountability, as well as a precise understanding of the product.
4. **Everything is code; automate, automate, automate.** Just like the motto of this class, one of the driving DevOps principles at Amazon is to automate, automate, keep automating, automate again, and again. If something needs to be done at Amazon—CI/CD, testing, deployment, etc.—it needs to be done automatically. This decreases the likelihood of errors and increases developer effectiveness. 
5. **Separate duties and overlap responsibilities.** Going back to the culture of shared responsibility, Amazon tries to get their teams to share responsibilites. This is expressed in code reviews. When engineers hand off their code to other team members and review the code of other team members, the responsibilities of the team get passed around while ensuring that fresh eyes land on code before it's pushed.
6. **Monitor deep.** Health checks are built into every service and system. High-quality observability facilitates rapid responses to issues and a higher level of awareness of the product and its use.

### AWS re:Invent

Every year, AWS hosts an event called re:Invent. This conference allows the public to get a view into AWS and discuss everything surrounding cloud computing. In re:Invent 2020, Charlie Roberts gave a presentation on [testing software and systems at Amazon](https://www.youtube.com/watch?v=o1sc3cK9bMU&ab_channel=AWSEvents). Here are some of the main points of that presentation.

1. **Teams take ownership.** Like what was stated in the DevOps Guidance manual, teams are expected to take ownership of their products. One fringe benefit of this practice is that it breeds a diversity in the DevOps practices and processes across Amazon and allows teams to tailor those practices to their personal use cases.
2. **It's still day one.** Amazon tries to get clear eyes on as many facets of their products and DevOps processes as they can. Testing with a "day one" perspective means asking questions that provide a fresh and most-important-first look at how to test the product.
3. **Use scarce resources wisely to minimize risk.** A large philosophy surrounding testing at Amazon is that testing is a tool that costs scarce resources (time, money, talent, customer trust, etc.) but minimizes risk when shipping a product. It's important to optimize the resources that you have to make the greatest reduction in risk.
4. **Bring the cost of testing down to as close to zero as possible.** Make testing as fricitionless as possible. In the developer's mind, running tests should be free and fast. Tests should be run as often as possible and as automatically as possible. The cost of getting relevant data and the root cause of a failure from a test should be as close to zero as possible.
5. **Coverage is not the end-all and be-all.** Just because a line of code is getting covered doesn't mean that you wrote an effective test. Mutation testing allows you to test your unit tests and make sure that they not only succeed when you want them to, but fail when you need them to.
6. **Tests should be representative.** The data used in tests and the metrics collected should be representative of the actual use case of the product. If they're not, then your tests could be giving you a false sense of minimizing risk.
7. **Is your CI/CD serving you well?** Good CI/CD pipelines operate in stages, with larger and slower tests pushed back towards the end of the pipeline (see "bring the cost of testing down" above). The main goal teams want to achieve from their pipelines is getting an increase in confidence that they've decreased risk as their pipeline progresses.
8. **Find your failures faster than your customers.** Once again, it's important that testing is representative. Design tests in such a way that they find issues before the customer does.

### Zebrunner Article

I found an article on Zebrunner, a QA journal, by Anton Bravin titled [QA insights from Fortune 500 companies: Agile, QA management & processes optimization](https://www.zebrunner.com/blog-posts/the-best-qa-practices-followed-by-fortune-500-companies). Though he covers several differnent companies in the article, Amazon's practices show up a few times.

1. **Automation is the heart of QA.** Amazon automates everything. As a result, testing becomes a lot cheaper to do and implement.
2. **Pay attention to the canary in the coal mine.** Instead of pushing their product to everyone all at once, Amazon rolls out new releases using the canary method. By shipping to a small section of customers first, they're able to check if the canary dies rather than the coal miner. Automation also means that if a serious enough error is discovered by the canary customers, the version can be rolled back quickly, retaining customer trust.
3. **Tests are only as useful as your confidence in them.** It's important for software engineers to have confidence in the tests they write. To alleviate as much friction as possible and increase confidence in tests, Amazon produces their own internal testing tools.
4. **Developers test their own code.** Relating to the "own your development process" point, software engineers are expected (if not required) to write and run their own tests. While there are QA engineers at Amazon, they mainly write and produce the tools that developers use to test.

## ⏎ Conclusion

Across these different sources, there are a few key points that stood out to me.

First, Amazon (like Professor Jensen) highly focuses on automation. They automate as much of the production and testing pipeline as possible. This reduces user error and eliminates points of friction, making testing and deployment faster and easier to achieve.

Second, Amazon focuses on primary ownership of services. Software engineers and teams are expected to take ownership of their products and overview the entire process from design to maintenance.

Third, Amazon understands the importance of culture as it relates to QA and DevOps. Teams that have cultures of accountability, ownership, and shared responsibility are better equipped to produce and push their services.

Fourth, Amazon eliminates points of friction. This not only relates to automation, where automating tests and CI/CD pipelines allows developers to focus on the meat and potatoes of their processes, but also pertains to things like resource allocation. Swapping scarce resources—time, money, talent, etc.—for available resources—data, compute, and automation—allows Amazon to more effectively minimize the risk they're presenting by releasing new services to their customers.

Fifth and finally, Amazon emphasizes taking a step back and looking at the most important parts of the service. Making sure developers have access to and prioritize the key points—high-quality metrics, root causes of test failures, and a pinpointed view of the purpose for testing—ensures that Amazon is making the most of what they have.

If nothing else, the main thing that I took from learning about how Amazon does their QA and DevOps is that they understand that software engineers are people. People are slow, selfish, and prioritize convenience. All of these traits, unsurprisingly, make for a poor developer experience and reduces the quality of the product their pushing out. By targetting these features through automation, observation, team-based cultures, sophisticated and efficient testing tools, etc., Amazon is able to create hyper-focused development teams that produce quality products that serve hundreds of millions, if not biillions, of people daily across the world.
