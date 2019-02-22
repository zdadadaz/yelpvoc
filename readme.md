#Yelp Voc

* Add landing page
* Add Voc list page that list all voc

Each Voc list has:
 * id
 * word
 * img
 * English definition
 * Chinese definition
 * Ex1
 * Ex2
 * Ex3
 * Familiar
 * Tag

 [
     {
         id:"1",
         word:"deciphering",
         img:"",
         enDefinition:"to discover the meaning of something written badly or in a difficult or hidden way",
         chDefinition:"",
         ex1:"",
         ex2:"",
         ex3:"",
         familiar:"",
         idea:""
     }
 ]

 reddit version

 index      /voclist            get
 new        /voclist/new        get
 create     /voclist            post
 show       /voclist/:id        get

 new        /voclist/:id/comments/new   get
 create     /voclist/:id/comments       post
 

 Authentication
password-local => for password
password-local-mongoose