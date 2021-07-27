![Carey Development Logo](http://careydevelopment.us/img/branding/careydevelopment-logo-sm.png)

# Carey Development CRM

![license](https://img.shields.io/badge/license-MIT-blue.svg) 


This is an ongoing project that demonstrates how to build a customer relationship management (CRM) application
using Angular, Spring Boot, and MongoDB.

Each lesson is a separate branch. The latest state of the whole project is in the master branch.

## Dependencies
DON'T FORGET TO INSTALL THE DEPENDENCIES! You can do that easily by opening a command prompt, going to
the directory where this project is located, and typing:

```
npm install
```

That's it. That should do it.

If you're still having issues, you might need to blow away everything in the node_modules directory
run npm install again.

## All the Guides
If you're interested in following the guides, just view the 
<a href="https://careydevelopment.us/tag/careydevelopmentcrm" target="_blank">careydevelopmentcrm</a>
tag on the Carey Development website. Note that all lessons are in reverse chronological order 
so if you want to start at the beginning, go to the last page.

## Microservices
Keep in mind: this Angular app runs alongside a microservice architecture. Here's a list of the current
microservices the app uses as well as links to their source code on GitHub.

* <a href="https://github.com/careydevelopment/ecosystem-user-service">User Service</a> - handles authentication and features related to user info (updating account details, adding a profile image, etc.)
* <a href="https://github.com/careydevelopment/ecosystem-customer-service">Customer Service</a> - handles CRUD activities related to contacts (sales leads, customers, etc.) and accounts
* <a href="https://github.com/careydevelopment/ecosystem-email-service">Email Service</a> - for integration with email (currently only supports Gmail)
* <a href="https://github.com/careydevelopment/ecosystem-product-service">Product Service</a> - handles CRUD activities related to products
* <a href="https://github.com/careydevelopment/crm-service">CRM Service</a> - handles CRUD activities related to CRM-specific objects such as appointments, meetings, and more
* Geo Service - retrieves lists of geographies such as states and countries (currently not public)

## Configuration
Speaking of microservices, you'll need to update the code to point to the downstream APIs. To do that,
you'll need to edit both of the files in src/environments. 

Right now they're just dummied up, so you'll need to put your own URLs in there.

For example, if you deploy the ecosystem-user-service so that it's located at http://mygreathost.com/user,
then you'll need to set the following property:

baseUserServiceUrl: 'http://mygreathost.com/user'

Keep in mind: environment.ts is meant for non-production systems while environment.prod.ts is meant
for production systems. So update the values accordingly.

## Persistence
The microservices in turn use MongoDB for persistence. For more info about how to set up the MongoDB
databases and collections used by the microservices, check out 
<a href="https://careydevelopment.us/blog/how-to-store-user-credentials-with-spring-boot-and-mongodb">this guide</a>.
