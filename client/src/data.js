import Thumbnail1 from './assets/flag1.jpg'
import Thumbnail2 from './assets/flag2.jpg'
import Thumbnail3 from './assets/flag3.jpg'

import candidate1 from './assets/candidate1.jpg'
import candidate2 from './assets/candidate2.jpg'
import candidate3 from './assets/candidate3.jpg'
import candidate4 from './assets/candidate4.jpg'
import candidate5 from './assets/candidate5.jpg'
import candidate6 from './assets/candidate6.png'
import candidate7 from './assets/candidate7.png'



export const elections = [
    {
        id:"e1",
        title: " Haevad presedential election 2024",
        description: `hbdujnbjncdcddddddddddddddddddd dedcedcc jhgfghjkkkkkkkkkkk
         iyuyguhkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj kjhgh`,
        thumbnail: Thumbnail1,
        candidates: ["c1","c2","c3","c4"],
        voters:[]

    },
        {
        id:"e2",
        title: "legon presendetial election 2024 ",
        description: `hbdujnbjncdcddddddddddddddddddd dedcedcc
        hjjjjjjjjjjjjjjjjjjjjjjjjjj
        kjjjjjjjjjjjjjjcihuywguhij hijknnnnnnnnbk`,
        thumbnail: Thumbnail2,
        candidates: ["c5","c6","c7"],
        voters: []

    },
        {
        id:"e3",
        title: "standford presedential election 2024",
        description: `hbdujnbjncdcddddddddddddddddddd dedcedccjjjjjjjjjjjjjj
        kjhhhhhhhhhhj jhhhhhhhhjk sjhjkc
        jshjc jshjjuytyrterstdfugi uiyutytdytfuy`,
        thumbnail: Thumbnail3,
        candidates: [],
        voters:[]

    },
]

export const candidates = [
    {
        id:"c1",
        fullName: "enoach ganyo",
        image: candidate1,
        motto: 'sed dds edrfd .',
        voteCount:23,
        election:"e1"
    },
      {
        id:"c2",
        fullName: "John Asiama",
        image: candidate2,
        motto: 'sed dds edrfd .',
        voteCount:18,
        election:"e1"
    },
      {
        id:"c3",
        fullName: "Dora stepsohon",
        image: candidate3,
        motto: 'sed dds edrfd .',
        voteCount:3,
        election:"e2"
    },
      {
        id:"c4",
        fullName: "Chairman mobella",
        image: candidate4,
        motto: 'sed dds edrfd .',
        voteCount:5,
        election:"e1"
    },
      {
        id:"c5",
        fullName: "Anakwaa bapyan",
        image: candidate5,
        motto: 'sed dds edrfd .',
        voteCount:238,
        election:"e2"
    },
      {
        id:"c6",
        fullName: "Vivian jill",
        image: candidate6,
        motto: 'sed dds edrfd .',
        voteCount:42,
        election:"e2"
    },
      {
        id:"c7",
        fullName: "Mahamadu Bawaunia",
        image: candidate7,
        motto: 'sed dds edrfd .',
        voteCount:190,
        election:"e2"
    },
]


export const voters = [
    {
     id:"v1",
     fullName: "Hemanth",
     email: "hemanth@gmail.com",
     password: "hemanth123",
     isAdmin: true,
     votedElections: ["e2"]
    },
      {
     id:"v2",
     fullName: "Naveen",
     email: "naveen@gmail.com",
     password: "naveen123",
     isAdmin: false,
     votedElections: ["e1","e2"]
    },
      {

     id:"v3",
     fullName: "sushanth",
     email: "sushanth@gmail.com",
     password: "sushanth123",
     isAdmin: false,
     votedElections: ["e1","e2"]
    },
      {
     id:"v4",
     fullName: "ramesh",
     email: "ramesh@gmail.com",
     password: "ramesh123",
     isAdmin: true,
     votedElections: []
    },

]