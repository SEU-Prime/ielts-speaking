const state = {
  topics: [],
  selectedId: null,
  part: "all",
  period: "all",
  region: "Mainland",
  savedOnly: false,
  saved: new Set(JSON.parse(localStorage.getItem("ielts-saved") || "[]")),
  timerSeconds: 0,
  timerHandle: null,
  timerRunning: false,
};

const elements = {
  list: document.querySelector("#topic-list"),
  study: document.querySelector("#study-panel"),
  search: document.querySelector("#search-input"),
  part: document.querySelector("#part-filter"),
  period: document.querySelector("#period-filter"),
  region: document.querySelector("#region-filter"),
  savedFilter: document.querySelector("#saved-filter"),
  savedCount: document.querySelector("#saved-count"),
  resultCount: document.querySelector("#result-count"),
};

const personalExamples = [
  [/music/i, ["I mostly listen to mellow indie pop on the way to class", "it helps me relax without distracting me", "a playlist I made for my commute"]],
  [/teachers?/i, ["I still remember my high-school English teacher", "she was patient and helped me feel confident speaking", "a short presentation she helped me practise"]],
  [/social media/i, ["I mainly use WeChat and Xiaohongshu", "they make it easy to keep in touch and find practical ideas", "a useful study tip a classmate shared"]],
  [/tidiness/i, ["I try to keep my desk clear", "a tidy space makes it easier to concentrate", "putting my books back before I finish studying"]],
  [/websites/i, ["I often visit university websites and BBC Learning English", "they give me reliable information in a clear format", "checking a course page before a deadline"]],
  [/watch/i, ["I usually check the time on my phone, but I own a simple watch", "it is convenient and does not need charging", "wearing it to a family event"]],
  [/shopping/i, ["I compare prices online and buy everyday things in local shops", "checking reviews helps me avoid impulse purchases", "waiting for a sale before buying a backpack"]],
  [/cars?/i, ["I usually take the underground or a bus", "it is cheaper and more predictable during rush hour", "sitting in a long traffic jam as a child"]],
  [/parks?|gardens?/i, ["I like the riverside park near my home", "being around trees gives me a break from screens", "walking there with a friend after dinner"]],
  [/science/i, ["I find biology and everyday science the most interesting", "it explains things I can observe in daily life", "a simple experiment at school"]],
  [/mirrors/i, ["I have a small mirror by the front door", "it is useful for a quick check before I leave", "buying a plain one for my room"]],
  [/space|stars/i, ["I enjoy learning a little about planets and space", "it makes me curious about how the universe works", "watching a documentary about the moon"]],
  [/singing/i, ["I sing along to familiar songs at home", "it is an easy way to lift my mood", "joining friends for karaoke"]],
  [/clothing/i, ["I prefer comfortable clothes in simple colours", "they are easy to match and suit most occasions", "choosing a jacket for a family dinner"]],
  [/jokes|comed/i, ["I enjoy light comedy and short funny clips", "a little humour makes a busy day feel easier", "watching a comedy with my roommates"]],
  [/headphones/i, ["I use wireless earphones when I commute", "they let me listen to podcasts without disturbing other people", "taking them off before crossing a busy road"]],
  [/travell/i, ["I usually take a high-speed train for longer trips", "it is comfortable and more predictable than driving", "looking out of the window on a family trip"]],
  [/rubbish|recycl/i, ["I separate bottles, paper and food waste at home", "small habits make recycling easier for everyone", "sorting rubbish with my family"]],
  [/tiredness/i, ["I take a short break and drink some water", "a brief pause helps me reset instead of losing focus", "resting for fifteen minutes after class"]],
  [/shoes/i, ["I choose comfortable trainers for most days", "I walk a lot, so comfort matters more than fashion", "buying a durable pair for daily use"]],
  [/politeness/i, ["I try to greet people and listen without interrupting", "basic courtesy makes conversations more comfortable", "learning to say thank you when I was young"]],
  [/fruit|vegetable/i, ["I buy seasonal fruit from a nearby market", "it is fresh and easy to include in my meals", "trying vegetables my family cooked when I was a child"]],
  [/advertisement/i, ["I notice short video adverts more than printed ones", "a clear message is easier to remember than a long sales pitch", "seeing a sports advert before a big match"]],
  [/paper/i, ["I keep a small notebook for quick reminders", "writing things down helps me remember them", "making paper decorations for a school project"]],
  [/secondary school/i, ["I miss seeing my close friends every day", "school gave us a steady routine and lots of shared memories", "my first week in a new classroom"]],
  [/name/i, ["I repeat a person's name when we first meet", "using it in conversation helps it stick in my memory", "mixing up two classmates' names once"]],
  [/opportunit/i, ["I am open to trying activities related to my studies", "new experiences help me discover what I am good at", "joining a student project"]],
  [/work or studies/i, ["I am studying at university and focusing on my major", "I like seeing how the ideas connect with real life", "working on a small project with classmates"]],
  [/home|accommodation/i, ["I live in a fairly practical apartment with my family", "it is comfortable and close to public transport", "spending time together in the living room"]],
  [/hometown|area you live|city you live/i, ["I live in a medium-sized city with convenient public transport", "it has enough services without feeling overwhelming", "a small park and food street near my home"]],
  [/history/i, ["I enjoy learning about local history through museums and short articles", "real stories make the past easier to understand", "visiting an old street with my family"]],
  [/film|cinema|movie/i, ["I usually watch a film at home with subtitles", "it is relaxing and easy to fit into my schedule", "seeing an animated film with friends"]],
  [/old buildings|building/i, ["I like buildings that combine a useful layout with local details", "good design can make a place feel welcoming", "visiting a public library with an open courtyard"]],
  [/evening time|morning time|morning routines/i, ["I keep my mornings simple and do the important things first", "a steady routine helps me start the day calmly", "having breakfast before an early class"]],
  [/sports/i, ["I enjoy badminton and follow a few major matches", "it is exciting to see skill and teamwork together", "watching a close game with friends"]],
  [/food/i, ["I enjoy home-cooked noodles and seasonal dishes", "they are comforting and remind me of family meals", "having dumplings during a festival"]],
  [/pets|animals/i, ["I like dogs, although I do not have a pet at the moment", "they are sociable and respond warmly to people", "meeting a friendly dog in a neighbourhood park"]],
  [/hobby/i, ["I like taking walks and listening to podcasts", "it is inexpensive and helps me clear my mind", "trying a new route on the weekend"]],
  [/gift/i, ["I prefer practical gifts with a personal touch", "they show that someone has paid attention to what I like", "receiving a notebook from a close friend"]],
  [/reading/i, ["I read articles on my phone and longer books on paper", "the format depends on whether I need to focus", "reading a few pages before bed"]],
  [/walking/i, ["I walk around my neighbourhood most evenings", "it gives me some exercise without needing special equipment", "strolling beside the river after dinner"]],
  [/typing/i, ["I type on a laptop for most of my assignments", "it is quicker to edit and organise my work", "learning touch typing for a school project"]],
  [/scenery|views/i, ["I prefer quiet mountain and riverside views", "natural scenery feels restful after a busy week", "watching the light change over a lake"]],
  [/childhood activities|life stages/i, ["I spent a lot of time playing outside with friends", "those simple activities made it easy to stay active", "riding bicycles around our neighbourhood"]],
  [/dream|ambition/i, ["I would like to build a career that combines creativity and practical problem-solving", "a clear goal gives me direction while leaving room to learn", "working towards a useful qualification"]],
  [/lost and found/i, ["I would check the nearby desk and then report the item to staff", "acting quickly gives the owner a better chance of finding it", "handing a lost wallet to a station worker"]],
  [/computer|tablet/i, ["I use a laptop for coursework and a tablet for reading", "the larger screen is more comfortable for longer tasks", "organising notes before an exam"]],
  [/collecting/i, ["I keep a few postcards from places I have visited", "they take up little space but bring back good memories", "choosing one at a museum shop"]],
  [/street market/i, ["I enjoy browsing a weekend food market", "there is a wider choice and the atmosphere feels lively", "buying fresh fruit from a local stall"]],
  [/feeling bored/i, ["I go for a walk or listen to a short podcast", "a small change of activity usually helps me reset", "taking a break between study sessions"]],
  [/friends/i, ["I usually meet a couple of close friends for a meal", "we can catch up without needing to plan anything elaborate", "talking after class"]],
  [/secondary school/i, ["I miss the friends and teachers I saw every day", "having a regular routine made it easy to stay connected", "working on a class project with friends"]],
  [/history/i, ["I enjoy learning about history through museums and short articles", "real stories make the past easier to understand", "visiting an old street with my family"]],
  [/films?\/cinemas?|movie/i, ["I usually watch comedies and thoughtful animated films", "a good story helps me unwind and gives me something to discuss", "seeing a film with friends at the weekend"]],
  [/evening time/i, ["I usually have dinner, finish a little work and then relax in the evening", "a quiet evening helps me recover after a busy day", "watching a comedy with my family"]],
  [/morning routines?/i, ["I wash up, have breakfast and check my plans for the day", "a simple routine helps me feel awake and organised", "getting ready before an early class"]],
  [/sports programs/i, ["I enjoy watching major football and badminton matches", "close games are exciting, especially when I can share them with friends", "watching a national team play in a tournament"]],
];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function contextFor(topic) {
  const name = topic.title || "daily life";
  return personalExamples.find(([pattern]) => pattern.test(name))?.[1] || [
    "I would choose a familiar example from my studies or daily routine",
    "it is practical and easy to relate to my own experience",
    "talking it through with a close friend",
  ];
}

const specificPartOneAnswers = [
  [/advertisement/i, /advertising on trains|other transport/i, "Yes, I often see adverts on station screens and inside buses, especially near the doors. They are hard to avoid during rush hour."],
  [/advertisement/i, /advertisement that made an impression.*when you were a child/i, "I remember a colourful snack advert with a catchy song when I was at primary school. My friends and I used to sing the jingle during breaks."],
  [/advertisement/i, /bought something because of an advertisement/i, "Yes, I once tried a snack after seeing it advertised online. It tasted fine, although the advert made it look more special than it really was."],
  [/cars/i, /enjoy traveling by car.*when you were a kid/i, "Yes, family road trips felt exciting when I was little. I liked looking out of the window, although I sometimes got bored on long journeys."],
  [/cars/i, /what types of cars do you like/i, "I like compact electric cars because they are quiet and easier to park in a busy city. A simple, comfortable interior matters more to me than a flashy design."],
  [/cars/i, /prefer to be a driver or a passenger/i, "I prefer being a passenger in heavy traffic because I can relax and look at the route. I would rather drive on a quiet road or a longer trip."],
  [/cars/i, /what do you usually do when there is a traffic jam/i, "I usually check the estimated delay, put on a podcast and try to stay patient. If I am not driving, I may message whoever is waiting for me."],
  [/cars/i, /car colours are important/i, "A little. I would choose a neutral colour that is easy to maintain and easy to see on the road, but I would not pay much extra for it."],
  [/cars/i, /buy an expensive car in the future/i, "Probably not. I would rather buy a reliable car that suits my needs and save the rest of my money for travel or other priorities."],
  [/fruit and vegetables/i, /people in your country like planting vegetables/i, "Yes, many people enjoy growing vegetables, especially if they have a balcony or a small garden. It is relaxing, and they can use the produce in home cooking."],
  [/fruit and vegetables/i, /fruits and vegetables you disliked as a child/i, "I disliked bitter melon as a child because I found its taste too strong. I can eat a little now, but it is still not my first choice."],
  [/fruit and vegetables/i, /what kind of fruits and vegetables do you dislike/i, "I am not keen on bitter melon or celery because their flavours can overpower a dish. I still eat them occasionally if they are cooked with other ingredients."],
  [/headphones/i, /when would you use headphones/i, "I use them on the bus or when I am studying somewhere noisy. They let me listen to a podcast or focus on my work without disturbing anyone."],
  [/headphones/i, /conditions would you not use headphones/i, "I take them off when I cross a road, cycle or need to listen for an announcement. In those situations, being aware of what is around me is more important."],
  [/home\/accommodation/i, /what kind of house or apartment do you want to live in in the future/i, "In the future, I would like a bright apartment with a separate study corner and a small balcony. It would be comfortable without being difficult to look after."],
  [/home\/accommodation/i, /please describe the room you live in/i, "My room is fairly simple, with a bed, a desk and a bookshelf. The desk is beside the window, so I get natural light when I study."],
  [/home\/accommodation/i, /difference between where you are living now and where you have lived in the past/i, "My current home is more convenient and better connected to public transport than the place I lived in as a child. I also have a quieter corner where I can study."],
  [/home\/accommodation/i, /plan to live there for a long time/i, "Probably for the next few years, because it is comfortable and close to the places I need to go. I may move later for work or study."],
  [/home\/accommodation/i, /what do you usually do in your apartment/i, "I usually study at my desk, have meals with my family and relax in the living room. At weekends, I also do a few small chores."],
  [/hometown/i, /is that a big city or a small place/i, "It is a medium-sized city. It has the shops and services I need, but it is less overwhelming than a very large city such as Shanghai."],
  [/hometown/i, /please describe your hometown/i, "My hometown is a medium-sized city in eastern China. It has busy shopping streets, older neighbourhoods and a few parks where people go for a walk in the evening."],
  [/hometown/i, /anything you dislike about it/i, "The main thing I dislike is the traffic during rush hour. Some roads get crowded, and I wish there were more shaded places to walk near the busiest areas."],
  [/hometown/i, /learn about the history of your hometown at school|learned anything about the history of your hometown/i, "Yes. We learned about a few local landmarks and how the city developed. I remember it better after visiting an old street with my family."],
  [/hometown/i, /learn about the culture of your hometown in your childhood/i, "Yes, mostly through family celebrations, local food and school events. Those everyday experiences taught me more about local customs than memorising facts did."],
  [/hometown/i, /good place for young people to pursue their careers/i, "It is a reasonable place to start a career because there are local businesses and universities, and the cost of living is manageable. The range of jobs is narrower than in a major city, though."],
  [/jokes & comedies/i, /good at telling jokes/i, "Not especially. I can share a funny story with close friends, but I am not very good at telling jokes with perfect timing."],
  [/jokes & comedies/i, /friends like to tell jokes/i, "A few of them do. Jokes help us relax when we are together, although we usually share funny videos rather than prepare jokes in advance."],
  [/jokes & comedies/i, /ever watched a live show/i, "Yes, I went to a small comedy show with a friend. The jokes were about ordinary student life, so the audience could easily relate to them."],
  [/jokes & comedies/i, /comedy shows popular in your country/i, "Yes, comedy shows are popular because people can enjoy them with friends or family. Stand-up clips are especially easy to share online."],
  [/music/i, /taken any music classes/i, "I took a few beginner piano lessons when I was younger. I did not become very skilled, but learning to keep a steady rhythm was enjoyable."],
  [/music/i, /happy music make you feel more excited/i, "Usually, yes. An upbeat song can lift my mood, especially when I am tired, although I sometimes prefer quiet music when I need to concentrate."],
  [/name/i, /feel when people can.t remember your name/i, "I feel slightly awkward for a moment, but I do not take it personally. People meet many others, so it is an easy detail to forget."],
  [/opportunities/i, /should people try as many different things as they can/i, "They should try a range of things, especially when they are young, but they do not need to say yes to everything. It is useful to keep time for what matters most."],
  [/paper/i, /people still keep handwritten letters/i, "Some people keep them because they feel personal and can bring back memories. Most everyday messages are digital now, but a handwritten note still feels special."],
  [/paper/i, /still write physical letters/i, "Not very often. I usually send messages online, but I sometimes write a card for a birthday or a festival because it feels more thoughtful."],
  [/politeness/i, /what did you do to show your politeness as a child/i, "I was taught to greet adults, say please and thank you, and wait for my turn. My parents reminded me gently when I forgot."],
  [/politeness/i, /how did you learn to be polite as a child/i, "Mostly by watching my parents and teachers. They showed me how to greet people and listen without interrupting, then corrected me when I was rude."],
  [/public gardens and parks/i, /prefer to play in a personal garden or public garden|prefer to play in a public garden or park/i, "I would choose a public park because it gives me more space to walk and play, and I can meet friends there. A private garden is quieter, though."],
  [/public gardens and parks/i, /how are the parks today different from those you visited as a kid/i, "The parks I visit now have more exercise equipment and cafes, while the ones I remember as a child had simpler playgrounds. They are still good places to relax."],
  [/public gardens and parks/i, /what do you like to do when visiting a park/i, "I usually walk along the paths, sit near the water or talk with a friend. I like having somewhere green to unwind after spending time indoors."],
  [/rubbish and recycling/i, /waste sorting common in your country/i, "It is becoming more common, especially in larger cities where separate bins are provided. Some people still find the categories confusing, so clear signs make a real difference."],
  [/rubbish and recycling/i, /what do you do when you see rubbish on the street/i, "If it is safe and there is a bin nearby, I pick it up and throw it away. If not, I avoid touching it and let the local service handle it."],
  [/science/i, /do chinese people often visit science museums/i, "Yes, especially families with children and school groups. Science museums make ideas more hands-on, which can be more engaging than only reading about them in a textbook."],
  [/secondary school/i, /what was your favourite subject at secondary school/i, "English was my favourite subject because I enjoyed learning how people express ideas in different ways. I also liked that we had chances to speak, not just do exercises."],
  [/secondary school/i, /subjects that you found difficult at secondary school/i, "Mathematics was the most difficult for me. I could follow the examples in class, but I needed extra practice before I felt confident solving problems on my own."],
  [/shoes/i, /have you ever bought shoes online/i, "Yes, a couple of times. I check the size chart and reviews first, because the main drawback is that I cannot try them on before they arrive."],
  [/shoes/i, /^how often$/i, "I buy shoes only a few times a year, usually when my everyday pair is worn out. I prefer to choose a comfortable pair that will last."],
  [/singing/i, /ever taken a singing class/i, "I joined a short singing class at school once. It helped me control my breathing, although I still feel more comfortable singing casually with friends."],
  [/social media/i, /ever posted anything on social media/i, "Yes, I have posted photos from trips and shared a few useful study links. I usually keep personal details private and only share things I am comfortable with."],
  [/social media/i, /spend too much time on social media/i, "Sometimes. I open an app to check one message and then spend longer scrolling than I planned, so I try to put my phone away while studying."],
  [/teachers/i, /still in touch with your primary school teachers/i, "I am not in regular contact with them now, but I sometimes see updates from my old school. I still remember a few teachers who encouraged me."],
  [/teachers/i, /in what way has your favourite teacher helped you/i, "My English teacher helped me practise presentations and gave me specific feedback instead of simply pointing out mistakes. That made me more confident speaking in front of the class."],
  [/teachers/i, /like your primary school teachers more than your high school teachers/i, "I do not think I liked one group more. My primary teachers were warm and encouraging, while my high-school teachers helped me become more independent."],
  [/the area you live in/i, /what are some changes in the area recently/i, "A few new cafes and convenience stores have opened nearby, and the bus stop has been improved. The area is more convenient now, although it is a little busier."],
  [/the area you live in/i, /famous people in your area/i, "I do not know any famous people personally. The area is mostly residential, so I am more familiar with local shop owners and neighbours than public figures."],
  [/the area you live in/i, /noisy or a quiet area/i, "It is fairly quiet during the day, but it gets noisier in the evening because there are several restaurants nearby. It is still comfortable to live in."],
  [/the area you live in/i, /people in your neighborhood nice and friendly/i, "Yes, most people are friendly. We usually greet each other in the lift, and neighbours are willing to help if someone has a small problem."],
  [/the city you live in/i, /are there big changes in this city/i, "Yes. There have been new metro lines and more residential buildings in recent years. Getting around is easier, but some areas have become more crowded."],
  [/the city you live in/i, /is this city your permanent residence/i, "For now, yes. It is where I live and study, although I may move to another city if I find a good opportunity there."],
  [/the city you live in/i, /are the people friendly in the city/i, "Generally, yes. People may be busy, but shopkeepers and neighbours are usually helpful when you ask them a clear question."],
  [/the city you live in/i, /city friendly to children and old people/i, "In some ways, yes. There are parks and public transport, but crossings and pavements could be safer and easier for older people to use."],
  [/the city you live in/i, /what.s the weather like where you live/i, "The summers are hot and humid, while winters are cooler and fairly dry. Spring and autumn are more comfortable, so I enjoy spending time outdoors then."],
  [/the city you live in/i, /what city do you live in/i, "I live in a medium-sized city in eastern China. It has convenient public transport, busy commercial areas and quieter residential streets."],
  [/the city you live in/i, /would you recommend your city to others/i, "Yes, especially to someone who wants convenient transport and good local food without the pace of a huge city. It is a comfortable place to spend a few days."],
  [/the city you live in/i, /are there people of different ages living in this city/i, "Yes, it has university students, working adults and many older residents. You can see different age groups using the parks and public spaces throughout the day."],
  [/tidiness/i, /think that it is necessary to be tidy/i, "Yes, to a reasonable extent. A tidy space makes it easier to find things and concentrate, but it does not need to look perfect all the time."],
  [/tiredness/i, /what do you do when you feel tired/i, "I take a short break, drink some water and move away from my screen. If I am still tired, I stop working and get some proper rest."],
  [/tiredness/i, /when would you feel tired/i, "I usually feel tired after a long day of classes or when I have not slept well. Too much screen time can also make it harder to focus."],
  [/tiredness/i, /when you feel tired, do you still go out with your friends/i, "It depends. If I am only a little tired, I may meet them for a short meal, but I stay home when I really need to rest."],
  [/watch/i, /why do some people wear expensive watches/i, "Some people value the craftsmanship or see a watch as a status symbol. Personally, I would focus more on whether it keeps time well and feels comfortable."],
  [/watch/i, /ever got a watch as a gift/i, "Yes, I got a simple watch from my parents for a birthday. I liked it because it was useful and reminded me of them whenever I wore it."],
  [/websites/i, /are there any changes to the websites you often visit/i, "Yes. The sites I use have become more mobile-friendly and include short videos or interactive features. I still prefer pages that are clear and not overloaded with adverts."],
  [/websites/i, /what kinds of websites are popular in your country/i, "Shopping, video and social-media sites are very popular. People also use government and university websites when they need reliable information or to complete practical tasks."],
  [/websites/i, /prefer getting information from websites or books/i, "I use websites for current information because they are quick to search, but I prefer books for a subject I want to study in depth."],
  [/websites/i, /would you like to have your own website/i, "Maybe. I would make a simple site to collect my projects and writing, but I would only maintain it if I had something useful to share."],
  [/websites/i, /what have you learned from websites that help with your life or studies/i, "I have learned practical things such as how to organise study notes and use new software. I compare information across reliable sites before I rely on it."],
  [/work or studies/i, /what subjects are you studying/i, "I am in my final year of a mathematics degree. I enjoy the challenge of turning a complicated question into smaller steps, although some proofs take a lot of patience."],
  [/work or studies/i, /why did you choose to study that subject/i, "I chose mathematics because I enjoy logical problem-solving and wanted a subject that keeps challenging me. It also opens up different paths, from teaching to data analysis."],
  [/work or studies/i, /is your subject popular in your country/i, "Mathematics is an important subject, and many students study it seriously because it is useful in science, finance and technology. Some find the abstract parts demanding, though."],
  [/work or studies/i, /plans for your studies in the next five years/i, "I hope to finish my mathematics degree, gain some practical experience and decide whether I want further study or an analytical job. I would also like to keep improving my English."],
  [/work or studies/i, /benefits of being your age/i, "I have enough independence to make more of my own choices, but I still have time to learn and change direction. That balance is probably the best part."],
  [/work or studies/i, /want to change your major/i, "No, not at the moment. I am still exploring different areas within my subject, and I would rather gain more experience before making a major change."],
  [/work or studies/i, /prefer to study in the mornings or in the afternoons/i, "I prefer studying in the morning because I feel more alert and can finish demanding work before the day gets busy. I leave lighter tasks for later."],
  [/work or studies/i, /how much time do you spend on your studies each week/i, "I spend roughly twenty-five to thirty hours a week on classes and independent study. It varies around deadlines, so I try to plan the heavier weeks in advance."],
  [/work or studies/i, /are you looking forward to working/i, "Yes. I would like to apply what I have learned to real projects and work with a team, although I know the first job will involve a lot of learning."],
  [/work or studies/i, /what technology do you use when you study/i, "I mainly use a laptop to read lecture notes, write assignments and check calculations. Spreadsheets and simple programs are useful when I work with larger sets of data."],
  [/work or studies/i, /what changes would you like to see in your school/i, "I would like more project-based classes and better access to quiet study spaces. Practical tasks help students see how the ideas from lectures are used."],
  [/work or studies/i, /what work do you do/i, "I am currently a university student, so my main responsibility is studying. I sometimes help with small projects, which gives me a chance to apply what I learn."],
  [/work or studies/i, /why did you choose to do that type of work/i, "I chose this field because I enjoy solving problems and making useful things. I also wanted work that would give me opportunities to keep learning."],
  [/work or studies/i, /do you like your job/i, "Yes. I like that the work is varied and lets me solve practical problems, although meeting deadlines can be stressful at busy times."],
  [/work or studies/i, /requirements did you need to meet to get your current job/i, "I am still studying, so I do not have a full-time job yet. For the part-time roles I have considered, communication skills and basic computer knowledge are usually useful."],
  [/work or studies/i, /plans for your work in the next five years/i, "I hope to find an entry-level role where I can use mathematics, perhaps in data analysis or finance. I would like to build practical skills before choosing a speciality."],
  [/work or studies/i, /what do you think is the most important at the moment/i, "At the moment, making steady progress in my studies is most important. I am also trying to keep a healthy routine so I can stay focused over the long term."],
  [/work or studies/i, /want to change to another job/i, "I do not have a full-time job yet, so I am still learning about different roles. I would consider changing direction if I found work that suited my strengths better."],
  [/work or studies/i, /do you miss being a student/i, "I am still a student, so I cannot really miss it yet. I expect I will miss the flexible schedule and seeing classmates every day once I start working."],
  [/work or studies/i, /what technology do you use at work/i, "I am not working full-time yet. In project work, I mainly use a laptop, shared documents and video calls to communicate and keep tasks organised."],
  [/work or studies/i, /who helps you the most/i, "One of my classmates helps me most with difficult coursework. We compare how we approached a problem, and explaining our ideas to each other often makes them clearer."],
  [/computers\/tablets/i, /what would your life be like without computers or tablets/i, "Life would be slower because I use a computer for study, communication and everyday services. I could manage without one, but I would need paper and in-person visits much more often."],
  [/computers\/tablets/i, /in what conditions would it be difficult for you to use a computer or tablet/i, "It would be difficult in bright sunlight, in a very noisy place or when there is no reliable internet. A small screen also makes detailed work uncomfortable."],
  [/computers\/tablets/i, /in what conditions would you use a computer or tablet/i, "I use a computer when I need to write, code or manage several files. A tablet is more convenient for reading or watching something while travelling."],
  [/feeling bored/i, /childhood is boring or adulthood is boring/i, "Adulthood can feel more boring because work and responsibilities make the days predictable. Childhood has more free time, although children can still get bored when they have nothing to do."],
  [/friends/i, /would you invite friends to your home/i, "Yes, especially a close friend or a small group. We can cook something, talk comfortably and avoid the noise of a crowded restaurant."],
  [/friends/i, /how important are friends to you/i, "They are very important because I can share both good news and worries with them. A close friend can offer a fresh perspective without judging me."],
  [/lost and found/i, /will you post on social media if you lose your item/i, "Yes, if I lost something valuable in a public place, I would post a brief message in a local group. I would still contact the venue first."],
  [/lost and found/i, /report to the police when finding something lost by others/i, "For a small item, I would hand it to staff at the place where I found it. If it were valuable or there were no staff, I would contact the police."],
  [/building/i, /are there tall buildings near your home/i, "There are a few apartment towers near my home, but most buildings in my neighbourhood are mid-rise. The taller ones are mainly close to the main road."],
  [/childhood activities/i, /differences between the activities you liked when you were a child and those you like now/i, "As a child, I preferred active games outside with friends. Now I still enjoy walking, but I also spend more of my free time reading or listening to podcasts."],
  [/food/i, /what kind of food did you like when you were young/i, "When I was young, I especially liked noodles and dumplings because they were familiar family meals. I still enjoy them, although my tastes have become more varied."],
  [/food/i, /has your favourite food changed since you were a child/i, "A little. I used to prefer simple, mild dishes, but now I enjoy stronger flavours and more vegetables. I still like the food my family cooked when I was young."],
  [/gifts/i, /ever sent handmade gifts to others/i, "Yes, I once made a small photo card for a friend. It was simple, but I chose pictures that reminded us of a trip we took together."],
  [/gifts/i, /ever received a great gift/i, "Yes, a close friend gave me a notebook with a short message inside. It was not expensive, but it felt thoughtful because she knew I like writing things down."],
  [/life stages/i, /how do people remember each stage of their lives/i, "People often remember important stages through photos, objects and stories they share with family. Small details can bring back a particular period more clearly than dates do."],
  [/life stages/i, /at what age do you think people are the happiest/i, "I do not think there is one happiest age. People may feel happy at different stages for different reasons, such as close friendships when young or more freedom later in life."],
  [/pets and animals/i, /where do you prefer to keep your pet, indoors or outdoors/i, "I would keep a pet indoors, with enough space and regular time outside. It is safer, and the animal can stay close to the family."],
  [/pets and animals/i, /what is the most popular animal in china/i, "Dogs and cats are probably the most popular pets in China, especially in cities. Dogs are sociable, while cats suit people who want a more independent pet."],
  [/pets and animals/i, /how often do you visit a zoo/i, "Not very often, perhaps once every year or two. I would rather visit a zoo that has spacious habitats and a clear focus on animal welfare."],
  [/pets and animals/i, /should schools teach students knowledge about pets or animals/i, "Yes, basic lessons can teach children how to treat animals safely and responsibly. They should also explain that pets need long-term care, not just attention when they are cute."],
  [/reading/i, /when do you need to read carefully, and when not/i, "I read carefully when I study, follow instructions or check important information. For general news or familiar topics, I often scan for the main points."],
  [/reading/i, /prefer scanning or detailed reading/i, "It depends on my purpose. I scan when I need to find one fact quickly, but I read in detail when I am studying or comparing ideas."],
  [/sports team/i, /ever been part of a sports team/i, "Yes, I played badminton in a school team for a short time. We practised after class and entered a local competition, which taught me to support teammates."],
  [/sports team/i, /is team sports popular in your culture/i, "Yes, team sports such as football and basketball are popular because people can play with friends and support local or national teams together."],
  [/sports team/i, /differences between team sports and individual sports/i, "Team sports depend on communication and shared decisions, while individual sports put more responsibility on one athlete. I enjoy the social side of team sports, but both require discipline."],
  [/typing/i, /how do you improve your typing/i, "I practise with short typing exercises and try to keep my hands in the correct position. Checking my accuracy matters as much as trying to type faster."],
  [/dream and ambition/i, /what was your childhood dream/i, "When I was a child, I wanted to become an architect because I liked drawing buildings. I no longer plan to follow that career, but I still enjoy good design."],
  [/evening time/i, /what did you do in the evening when you were little/i, "When I was little, I usually had dinner with my family, finished my homework and watched a little television. My evenings were less independent than they are now."],
  [/evening time/i, /what do you hate doing in the evening/i, "I dislike doing difficult work late at night because I am less focused by then. I prefer to finish important tasks earlier and keep the evening calm."],
  [/films\/cinemas/i, /did you often watch films when you were a child/i, "Yes, I watched animated films with my family at weekends. I did not understand every story at the time, but I enjoyed the characters and music."],
  [/films\/cinemas/i, /ever go to the cinema alone as a child/i, "No, I always went with a family member when I was a child. Going to the cinema alone would have felt unusual at that age."],
  [/films\/cinemas/i, /often go to the cinema with your friends/i, "Not very often. We usually watch films at home because it is cheaper and easier to arrange, but we go to the cinema for a film we are excited about."],
  [/films\/cinemas/i, /good way to spend time with friends/i, "Yes, especially if everyone enjoys the film. It gives you something to share, and you can talk about the story afterwards."],
  [/history/i, /when was the last time you read about history/i, "A few weeks ago, I read an article about an old neighbourhood in my city. It was short, but it explained how the area had changed over time."],
  [/morning routines/i, /what do you do right after getting up in the morning/i, "I wash up, open the curtains and drink some water. Then I check the day's plans and have breakfast before I start studying."],
  [/morning routines/i, /is breakfast important/i, "Yes. Breakfast helps me feel more alert in the morning, especially when I have an early class. I do not need a large meal, just something simple."],
  [/old buildings/i, /should we preserve old buildings in cities/i, "Yes, when a building has historical or cultural value. It is possible to improve safety and access while keeping the features that give the place its character."],
  [/old buildings/i, /prefer living in an old building or a modern house/i, "I would prefer a modern home because it is usually better insulated and easier to maintain. I still enjoy visiting older buildings for their history and design."],
  [/sports programs/i, /ever watched a sports game in a stadium/i, "Yes, I watched a football match at a stadium with friends. The crowd made the game feel much more exciting than watching it on television."],
  [/mirrors/i, /^how often$/i, "I check it briefly most mornings before I leave home. I do not spend long looking at myself, just enough to make sure I look presentable."],
  [/morning time/i, /spend your mornings doing the same things on both weekends and weekdays/i, "Not exactly. On weekdays I get ready quickly and go to class, while at weekends I sleep a little later and have a more relaxed breakfast."],
  [/paper/i, /what did you like to do with paper as a child/i, "I liked making paper planes and simple decorations for school projects. They were easy to make, and I enjoyed seeing what I could create with a few basic materials."],
  [/public gardens and parks/i, /would you like to see more parks in your city/i, "Yes. More small parks would give people a place to rest and exercise, especially in busy neighbourhoods where there is not much open space."],
  [/public gardens and parks/i, /are there any parks you want to go to in the future/i, "I would like to visit a larger botanical garden outside the city. It would be interesting to see more kinds of plants and spend a quiet afternoon there."],
  [/public gardens and parks/i, /did you like going to parks as a child|do you still like going to parks now/i, "Yes. I enjoyed the playgrounds as a child, and now I go for a walk or sit by the river. It is a simple way to get outside."],
  [/the area you live in/i, /where do you like to go in that area/i, "I often go to the small park near my home. It is an easy place to walk, get some fresh air and meet a friend after class."],
  [/the area you live in/i, /do you like the area that you live in/i, "Yes. It is fairly convenient, with shops, a bus stop and a small park within walking distance. It feels lively without being too noisy."],
  [/the city you live in/i, /do you like this city/i, "Yes, I do. It is convenient for daily life, and I like that I can find both busy shopping areas and quieter places to walk."],
  [/the city you live in/i, /are there many young people in your hometown/i, "Yes, there are quite a few, partly because the city has several colleges and local employers. You see students and young families around the centre."],
  [/the city you live in/i, /do you often see your neighbors/i, "Fairly often, especially in the lift or near the entrance. We usually exchange greetings, although we do not visit each other's homes very much."],
  [/the city you live in/i, /how long have you lived in this city/i, "I have lived here for most of my life. It has changed quite a bit, but I still know the neighbourhoods and feel at home here."],
  [/the city you live in/i, /what.s the difference between where you are living now and where you have lived in the past/i, "My current home is closer to public transport and gives me a better place to study. The home I lived in as a child was quieter but farther from the city centre."],
  [/childhood activities/i, /did you prefer to do activities alone or with a group of people when you were a child/i, "I preferred playing with a small group of friends. We could make up games together, and it was more fun than doing the same activity by myself."],
  [/pets and animals/i, /have you ever visited a zoo/i, "Yes, I have. I went with my family when I was younger, and I remember watching the giraffes because they were much taller than I expected."],
  [/films\/cinemas/i, /do you think going to the cinema is a good way to spend time with friends/i, "Yes, if you choose a film everyone wants to see. It is an easy plan, and you have something to talk about afterwards."],
  [/old buildings/i, /have you ever seen old buildings in the city/i, "Yes, there is an old street in my city with traditional shopfronts and stone lanes. It looks quite different from the newer buildings nearby."],
  [/sports programs/i, /do you like watching sports programs on tv/i, "Sometimes. I watch major badminton or football matches, especially if someone I know is interested too, but I do not follow sports every day."],
  [/hometown/i, /what.s your hometown famous for|what is your hometown known for/i, "It is best known for its local food and a historic old town. People from nearby cities often visit at weekends, especially during the spring festival season."],
  [/life stages/i, /what do you think is the most important at the moment/i, "At the moment, making steady progress in my studies and looking after my health are most important. I want to build good habits without putting too much pressure on myself."],
  [/evening time/i, /do you like the morning or evening/i, "I prefer the evening because I can slow down after studying and spend time with family or friends. Mornings are useful, but I am not at my best straight after waking up."],
  [/evening time/i, /spend your evenings doing the same things on both weekends and weekdays/i, "Not exactly. On weekdays I usually finish some work and relax at home, while at weekends I may meet friends or watch a film."],
  [/outer space and stars/i, /do you like science fiction movies/i, "Yes, especially films that imagine how people might live in the future. I enjoy the story and visual ideas, even when the science is not completely realistic."],
  [/hobby/i, /did you have any hobbies when you were a child/i, "I liked drawing and riding my bicycle around the neighbourhood. They were simple hobbies, but they gave me something fun to do after school."],
  [/hobby/i, /do you have the same hobbies as your family members/i, "We share a few interests, such as walking and watching films, but everyone has separate hobbies too. I think it is nice to have both shared and individual activities."],
  [/social media/i, /when did you start using social media/i, "I started using it in secondary school, mainly to keep in touch with classmates. At first I used it only occasionally, but it became more useful as more friends joined."],
  [/social media/i, /do your friends use social media/i, "Yes, most of them do. We use group chats to arrange plans and share photos, although we still prefer meeting in person when we have time."],
  [/work or studies/i, /are you looking forward to working/i, "Yes. I would like to apply what I have learned to real projects and work with a team, although I know the first job will involve a lot of learning."],
  [/work or studies/i, /do you like your subject/i, "Yes. I enjoy working through a difficult problem and understanding why a method works, although writing a clear proof can take time."],
  [/work or studies/i, /do you think that your subject is popular/i, "Mathematics is an important subject, and many students study it seriously because it is useful in science, finance and technology. Some find the abstract parts demanding, though."],
  [/work or studies/i, /do you have any plans for your studies in the next five years/i, "I hope to finish my mathematics degree, gain some practical experience and decide whether I want further study or an analytical job. I would also like to keep improving my English."],
  [/work or studies/i, /do you want to change your major/i, "No, not at the moment. I am still exploring different areas within my subject, and I would rather gain more experience before making a major change."],
  [/work or studies/i, /do you prefer to study in the mornings or in the afternoons/i, "I prefer studying in the morning because I feel more alert and can finish demanding work before the day gets busy. I leave lighter tasks for later."],
  [/work or studies/i, /what do you think is the most important at the moment/i, "At the moment, making steady progress in my studies is most important. I am also trying to keep a healthy routine so I can stay focused over the long term."],
  [/work or studies/i, /what technology do you use at work/i, "I am not working full-time yet. For university projects, I mainly use a laptop, spreadsheets and simple programs to check calculations and work with data."],
  [/the city you live in/i, /is that a big city or a small place/i, "It is a medium-sized city. It has the shops and services I need, but it is less overwhelming than a very large city."],
  [/the city you live in/i, /is your hometown a good place for young people to pursue their careers/i, "It is a reasonable place to start a career because there are local businesses and universities, and the cost of living is manageable. The range of jobs is narrower than in a major city, though."],
  [/the area you live in/i, /do you know any of your neighbors/i, "Yes, I know a few people in my building. We usually chat briefly in the lift, and they have helped me with small things like accepting a delivery."],
  [/the city you live in/i, /what city do you live in/i, "I live in a medium-sized city in eastern China. It has convenient public transport, busy commercial areas and quieter residential streets."],
  [/the city you live in/i, /are the people friendly in the city/i, "Generally, yes. People may be busy, but shopkeepers and neighbours are usually helpful when you ask them a clear question."],
  [/the city you live in/i, /city friendly to children and old people/i, "In some ways, yes. There are parks and public transport, but crossings and pavements could be safer and easier for older people to use."],
  [/the city you live in/i, /what.s the weather like where you live/i, "The summers are hot and humid, while winters are cooler and fairly dry. Spring and autumn are more comfortable, so I enjoy spending time outdoors then."],
  [/the city you live in/i, /what are big changes in this city/i, "Yes. There have been new metro lines and more residential buildings in recent years. Getting around is easier, but some areas have become more crowded."],
  [/public gardens and parks/i, /how are the parks today different from those you visited as a kid/i, "The parks I visit now have more exercise equipment and cafes, while the ones I remember as a child had simpler playgrounds. They are still good places to relax."],
  [/public gardens and parks/i, /what do you like to do when visiting a park/i, "I usually walk along the paths, sit near the water or talk with a friend. I like having somewhere green to unwind after spending time indoors."],
  [/scenery|views/i, /do you like to take scenery pictures|do you like taking pictures of different views/i, "Yes, especially when the light changes near sunset. I take a few photos of mountains or rivers, but I try to enjoy the view before looking at my phone."],
  [/scenery|views/i, /do you look out the window at the scenery when travelling/i, "Yes, if I am not working or reading. Watching the landscape pass by makes a long journey feel more relaxing."],
  [/sports programs/i, /who do you like to watch sports games with/i, "I usually watch with friends who follow the same teams. We can talk about the game as it happens, which makes it more enjoyable."],
  [/sports team/i, /what are the differences between team sports and individual sports/i, "Team sports depend on communication and shared decisions, while individual sports put more responsibility on one athlete. I enjoy the social side of team sports, but both require discipline."],
  [/collecting things/i, /why$/i, "I keep a few old things because they remind me of people or places that matter to me. I do not save everything, since too much clutter would be difficult to manage."],
  [/lost and found/i, /why$/i, "I would hand it to staff or the police because that gives the owner a clear place to ask for it. Keeping it or posting personal details online could create more problems."],
  [/life stages/i, /how do people remember each stage of their lives/i, "People often remember important stages through photos, objects and stories they share with family. Small details can bring back a particular period more clearly than dates do."],
  [/life stages/i, /at what age do you think people are the happiest/i, "I do not think there is one happiest age. People may feel happy at different stages for different reasons, such as close friendships when young or more freedom later in life."],
  [/city you live in/i, /would you recommend your city to others/i, "Yes, especially to someone who wants convenient transport and good local food without the pace of a huge city. It is a comfortable place to spend a few days."],
  [/fruit and vegetables/i, /where do you usually buy fruit and vegetables/i, "I usually buy them at a nearby wet market because the produce is fresh and I can choose what I need. I get a few basics from the supermarket too."],
  [/fruit and vegetables/i, /how often do you eat fruit and vegetables/i, "I eat fruit most days and have vegetables with lunch or dinner. It is an easy way to keep my meals balanced without following a strict diet."],
  [/science/i, /when did you start to learn about science/i, "I started learning science in primary school. I became more interested when our teacher let us do simple experiments instead of only reading about them."],
  [/shopping/i, /how often do you go shopping/i, "I go once or twice a week for groceries and other small things. For clothes or electronics, I shop much less often and compare options first."],
  [/collecting things/i, /where do you usually keep things you need/i, "I keep everyday things such as keys and chargers in the same place by the door. It saves time because I do not have to search for them."],
  [/computers\/tablets/i, /when was the first time you used a computer or tablet/i, "I first used a computer in primary school, when we had a basic class on typing and using educational programs. I started using one regularly for homework a few years later."],
  [/feeling bored/i, /when would you feel bored/i, "I tend to feel bored when I have been doing the same task for too long or when I am waiting with nothing to read or listen to."],
  [/friends/i, /where do you often meet each other/i, "We often meet at a cafe near campus or at a restaurant in the city centre. Those places are easy to reach and give us time to catch up."],
  [/street market/i, /when was the last time you went to a street market/i, "I went to one last weekend with a friend. We bought some fruit, tried a snack from a stall and looked around without planning to buy anything in particular."],
  [/typing/i, /when did you learn how to type on a keyboard/i, "I learned to type in secondary school when I started doing more assignments on a computer. I improved by practising a little whenever I wrote homework."],
  [/walking/i, /where would you like to take a long walk if you had the chance/i, "I would like to walk along the lakeside path outside the city. It is quieter than my neighbourhood, and I could take my time and enjoy the view."],
  [/walking/i, /where did you go for a walk lately/i, "A few days ago, I walked around the riverside park near my home. I went with a friend after dinner, and we talked while following the path."],
  [/films\/cinemas/i, /how often do you watch films/i, "I watch a film once or twice a week, usually at home when I have finished my work. I go to the cinema less often because it takes more planning."],
];

function partOneAnswer(topic, question, index) {
  const [example, reason, detail] = contextFor(topic);
  let q = question.toLowerCase().trim();
  const shortFollowUp = q.replace(/[?？]\s*$/, "");
  if (/^(why|why or why not|how)$/.test(shortFollowUp) && index > 0) q = `${topic.questions[index - 1]} ${shortFollowUp}`.toLowerCase();
  q = q.replace(/[?？]\s*$/, "").trim();
  const start = (value) => value.charAt(0).toUpperCase() + value.slice(1);
  const topicName = topic.title.toLowerCase();
  const specificAnswer = specificPartOneAnswers.find(([topicPattern, questionPattern]) => topicPattern.test(topicName) && questionPattern.test(q))?.[2];
  if (specificAnswer) return specificAnswer;

  if (/^how long have you/.test(q) && /hometown|city you live/.test(topicName)) return "I've lived there for most of my life. The city has changed quite a bit during that time, but I still feel at home there.";
  if (/^how long have you/.test(q)) return "I've lived in the same home for several years, so I know the neighbourhood well. It feels familiar, although I would be open to moving for work or study.";
  if (/^how long/.test(q)) return `Usually about half an hour, although it depends on what I have planned. ${start(example)}.`;
  if (/^how much/.test(q) && /shoe/i.test(topicName)) return "Usually around 300 to 500 yuan for a pair I wear regularly. I would rather pay a little more for comfort and durability than replace them quickly.";
  if (/^how much time/.test(q)) return "It varies with my schedule, but I usually set aside a few hours a week. I spend more time on it when I have a deadline or a specific goal.";
  if (/^how much/.test(q)) return "I try to keep it within a reasonable budget and only spend more when I know I will use it regularly.";
  if (/^how often/.test(q)) return `Fairly regularly, usually a few times a week. ${start(example)}.`;
  if (/^how do you/.test(q)) return `${start(example)}. I find that approach easy to keep up with, and it works well for me.`;
  if (/^where is your hometown/.test(q)) return "My hometown is in eastern China. It is a medium-sized city with convenient transport and several quiet residential areas.";
  if (/^where/.test(q)) return `Usually somewhere convenient, such as near my home or university. ${start(example)}`;
  if (/^when did you/.test(q)) return `I first did it when I was at school. ${start(detail)}, and that gave me a reason to keep doing it.`;
  if (/^when/.test(q)) return `Usually in the evening or at weekends, when I have more time. ${start(example)}.`;
  if (/^who/.test(q)) return `Usually a close friend or someone in my family. ${start(detail)}.`;
  if (/^please describe/.test(q)) return `${start(example)}. It is practical and comfortable, and it suits my everyday routine.`;
  if (/^what (city|country|place|area)/.test(q)) return "I live in a medium-sized city in China. It has convenient public transport, busy commercial areas and quieter residential streets.";
  if (/favorite room|favourite room|^what room|^what part of your home|^what makes you feel pleasant/.test(q)) return "My favourite part is the living room because my family often relaxes there together. It feels comfortable and gets plenty of natural light.";
  if (/^what did you do in the morning when you were little/.test(q)) return "I usually had breakfast with my family and got ready for school. My mornings were less organised than they are now, so my parents often reminded me to hurry up.";
  if (/what is your hometown famous for/.test(q)) return "It is best known for its local food and a historic old town. People from nearby cities often visit at weekends, especially during the spring festival season.";
  if (/difference|different from|similarity/.test(q)) return `The main difference is that my current routine is more organised than it used to be. I have less free time now, so I plan ahead and choose activities more carefully.`;
  if (/^on what|^in what/.test(q)) return `I think it matters most in situations where other people are involved, such as meeting a new person or sharing a public space. A little consideration makes everyone more comfortable.`;
  if (/^(why|what makes|what do you like|what do you enjoy)/.test(q)) return `Mainly because ${reason}. For example, ${detail}, which makes it enjoyable for me.`;
  if (/^what (kind|type|sort)|^which /.test(q)) return `${start(example)}. I prefer it because ${reason}.`;
  if (/^what/.test(q)) return `${start(example)}. ${start(detail)}, which is why it suits me.`;
  if (/^were there/.test(q)) return `Yes, there were. ${start(detail)}, and I remember it because ${reason}.`;
  if (/^was there/.test(q)) return `Yes, there was. ${start(detail)}, and I remember it because ${reason}.`;
  if (/^were you/.test(q)) return `Yes, I was. ${start(detail)}, and I remember it because ${reason}.`;
  if (/^did you/.test(q)) return `Yes, I did. ${start(detail)}, and I remember it because ${reason}.`;
  if (/^have you ever/.test(q)) return `Yes, I have. ${start(detail)}, and it was memorable because ${reason}.`;
  if (/^would you|^will you/.test(q)) return `Yes, probably. ${start(example)}, so it would fit my routine well.`;
  if (/^do you prefer/.test(q)) return `${start(example)}. I prefer it because ${reason}.`;
  if (/^are there|^is there|^do you|^does |^can you/.test(q)) return `Yes, generally. ${start(example)}. I like it mainly because ${reason}.`;
  return `${start(example)}. It is a small part of my routine, but it makes my day more enjoyable.`;
}

const partTwoExamples = [
  [/tall building/i, "One tall building I remember is Shanghai Tower. I first saw it during a family trip, and its curved glass exterior stood out against the skyline. We went up to the viewing area, where I could see the river and the busy streets far below. What I liked most was how the city looked organised from that height. It was impressive, but the visit also made me appreciate quieter neighbourhoods. I would recommend it to anyone who wants to understand how large and modern Shanghai has become."],
  [/interesting video|tv show|online program/i, "Recently, I watched a short online documentary about how city parks support birds and insects. I found it on a video platform one evening while taking a break from studying. It combined clear explanations with close-up footage, so the information never felt like a lecture. I learned that even small green spaces can provide food and shelter for wildlife. I sent it to a friend who enjoys nature, and we talked about it afterwards. I liked it because it was entertaining but also gave me a practical reason to notice the environment around me."],
  [/boring place/i, "A place I found boring was a government service hall where I had to renew a document. I went there with my mother on a weekday morning, but the queue moved very slowly. We sat in a crowded waiting area with little to look at, and most people were checking their phones. The staff were helpful, so the problem was not the service itself; there was simply a lot of waiting. I felt restless after an hour. It reminded me to book appointments online whenever that option is available."],
  [/favorite city|favourite city|recommend.*place|place you have travelled/i, "I would recommend Hangzhou, which I visited with my family during a short holiday. We spent most of our time around West Lake, but we also explored a few older streets and tried local food. The city has a good balance: it feels lively, yet there are plenty of quiet places to walk. I especially liked seeing the lake in the early evening, when the light was soft and the crowds had thinned. It is an easy city to enjoy at a relaxed pace, so I think it suits both first-time visitors and people who like nature."],
  [/city.*(interesting|famous)|interesting\/famous city|city you enjoyed visiting|city.*visit again/i, "A city I would gladly visit again is Chengdu. I went there with two friends and stayed for a long weekend. We tried local food, visited a museum and spent an afternoon in a large park watching people play mahjong and dance. The city felt busy but not too rushed, and getting around was straightforward. I also liked how the modern shopping areas sit alongside traditional teahouses. I left feeling that there was still much more to explore, especially the neighbourhoods outside the main tourist areas."],
  [/got up early|early morning|getting up early/i, "I remember getting up before sunrise for a trip to Huangshan with my family. We wanted to start the hike early to avoid the crowds and have enough time to reach the viewing points. At first, I was sleepy and did not feel like leaving my warm bed. Once we reached the mountain, though, the cool air and the changing colours of the sky woke me up. The view was worth the effort. I felt tired later that day, but also pleased that I had experienced the mountain at such a peaceful time."],
  [/grow plants|grow vegetables|gardening/i, "My grandmother enjoys growing vegetables in pots on her balcony. She grows spring onions, tomatoes and a few herbs, choosing plants that do not need much space. She waters them in the morning and checks the leaves almost every day. When I visit, she sometimes asks me to help pick what is ready. I think she enjoys the routine as much as the vegetables themselves. It gives her something calming to do, and the food tastes fresher. Seeing her balcony has made me consider growing a few herbs of my own."],
  [/new law|law on environmental|environmental law/i, "I would introduce a stronger system for sorting household waste in my country. The rules would require apartment buildings to provide clearly labelled bins and regular collection, while giving residents simple guidance about what belongs in each one. I thought of this because people are often willing to recycle but are unsure how to do it. The law could begin with reminders and small incentives rather than immediate fines. I believe most people would accept it if the system were convenient. It would reduce unnecessary waste and make environmental responsibility part of everyday life."],
  [/friend from your childhood/i, "I would talk about my childhood friend, Lin, whom I met in primary school. We lived in the same neighbourhood and often walked home together after class. We used to play badminton, exchange comics and talk about small things that seemed important at the time. Lin was cheerful and dependable, so I always felt comfortable around him. We went to different secondary schools and are not in touch every week now, but we still send each other messages occasionally. I value that friendship because it began naturally and is connected with some of my happiest early memories."],
  [/medical field/i, "My cousin wants to work in the medical field, probably as a nurse. I have known her since I was young, and she began thinking seriously about this career after volunteering at a community health event. She is patient, careful and good at listening, which I think are important qualities for looking after people. She also understands that the work can be tiring and requires a lot of study. I admire her because her choice is based on wanting to help, rather than simply choosing a prestigious job. I hope she finds a role where she can make a real difference."],
  [/successful business/i, "My aunt runs a small coffee shop near a university. She started it because she enjoyed making coffee and noticed that students needed a quiet place to study. At first, she had only a few tables and a limited menu, but she listened carefully to customers and gradually improved the space. The shop is successful because it feels personal, the prices are reasonable and the quality is consistent. She also remembers regular customers, which makes them feel welcome. Watching her has taught me that a business needs more than a good idea; it also needs patience and attention to people's needs."],
  [/plan.*change|change.*plan|change.*recently|recent change/i, "I had to change a weekend hiking plan last spring because heavy rain was forecast. I had already invited two friends and arranged the transport, so I was disappointed at first. After checking the weather, we decided not to risk the mountain trail and instead visited a museum and had lunch nearby. The new plan was less adventurous, but we still had a good day together. I felt relieved that we had made a sensible choice. It reminded me that being flexible can save a trip, even when the original plan sounds more exciting."],
  [/worked in a group|group work/i, "Last semester, I worked with three classmates on a statistics project using public transport data. We cleaned the data, compared travel times and prepared a short presentation. The main difficulty was agreeing on how to handle a few unusual results. I suggested checking the source records before removing anything, which helped us reach a more reliable conclusion. We divided the remaining tasks and practised explaining our charts in plain language. I enjoyed the project because it showed me how mathematical methods can answer a practical question, and everyone brought a different strength to the group."],
  [/important decision|decision.*happy with the result/i, "An important decision I made was to join a university club even though I was nervous about meeting new people. I considered keeping my free time for myself, but I knew I wanted to become more confident. A friend encouraged me to try one meeting before making up my mind. I joined the photography club and gradually got to know the other members. The decision was not difficult once I focused on what I could gain. I am happy with the result because I made friends and found an activity I genuinely look forward to."],
  [/live sports event|sportsperson|successful sportsperson|athlete/i, "A live sports event I enjoyed was a university basketball final that I watched with my classmates. The game was close, and both teams kept changing their tactics. The crowd became especially loud during the final few minutes, when one team scored just before the buzzer. I liked being there because the energy was very different from watching a match on a screen. I do not follow every team closely, but I could still appreciate the players' focus and teamwork. After the game, we talked about the best moments on the way home."],
  [/special occasion|special event.*food|special.*food/i, "A food I associate with special occasions is dumplings during the Spring Festival. My family usually prepares them together on New Year's Eve, and everyone helps with a small part of the process. Some people make the filling, while others fold the wrappers. The meal is not particularly fancy, but the shared preparation makes it meaningful. I enjoy it because it brings several generations to the same table and gives us time to talk. We eat dumplings at other times too, but they feel different during the festival because they are tied to family traditions."],
  [/learning and speaking new languages|language learning/i, "My friend Mei is very good at learning languages. She speaks Mandarin and English and has recently started learning Spanish through short daily lessons. She keeps a vocabulary notebook, listens to podcasts and tries to use new phrases in conversation instead of only memorising them. What impresses me is her consistency; she studies for a little while most days rather than doing everything at once. She says making mistakes is part of the process. I find her approach encouraging because it makes language learning seem manageable, even for someone with a busy schedule."],
  [/technological problem|electronic device|using an electronic/i, "I once had a serious problem with my laptop just before a group presentation. It suddenly stopped connecting to the classroom projector, although the slides worked on my screen. I restarted it and checked the cables, but nothing changed. A classmate suggested exporting the slides as a PDF and opening them on the classroom computer. That simple solution saved us from delaying the presentation. I felt stressed for a few minutes, then relieved that we had a backup. Since then, I keep an extra copy of important files in cloud storage."],
  [/advertisement.*famous|famous person.*advertisement/i, "I remember an advert for sports shoes featuring the athlete Eileen Gu. I saw it online a few months ago while watching a short video. The advert showed her training and then wearing the shoes in an everyday setting, so it felt energetic without being too complicated. I do not buy products just because a famous person recommends them, but her confidence made the advert memorable. It also connected the product with discipline and an active lifestyle. I thought it was effective because the celebrity suited the message rather than appearing in it for no reason."],
  [/message or email|received a message|no reply/i, "I once sent an important message to a classmate about the time of a group meeting and did not receive a reply for most of the day. I was worried that the plan had changed, so I checked the group chat and eventually called her. It turned out that she had been in class and had not seen her phone. I felt a little anxious, but the issue was solved quickly. Since then, I try not to assume that a late reply means someone is ignoring me, especially when the message is not urgent."],
  [/long-term goal|ambition/i, "A long-term goal I have is to use my mathematics degree in a job involving data analysis. I am building my skills through coursework and small projects, and I am also improving my English so I can read research and communicate with a wider range of people. I know I still need practical experience, so I plan to apply for internships after graduation. Reaching this goal would make me proud because it would let me use abstract ideas to solve real problems and keep learning throughout my career."],
  [/difficult.*successful|met difficulties/i, "A person I admire is a friend who struggled with mathematics at school but eventually earned a place in an engineering programme. Instead of giving up, he asked questions after class and followed a steady study plan. He also used practice problems to work out exactly where he was making mistakes. It took him more than one term to see a clear improvement, so his success was not immediate. I respect him because he stayed patient and was willing to change his approach. His experience reminds me that progress often comes from consistent effort rather than natural talent alone."],
  [/perfect job|short-term job|job.*foreign country|successful company/i, "A job I would enjoy is working as a data analyst. I like finding patterns in information and explaining what they mean in a clear way. The role would let me use statistics and problem-solving, but it would also involve working with people who understand the subject from different angles. I would need to build my skills in data tools and communication and gain practical experience after graduation. I think it would suit me because I enjoy both abstract reasoning and real-world questions. A supportive team and chances to keep learning would matter more to me than an impressive job title."],
  [/famous person.*meet/i, "I would like to meet the writer Yu Hua. I have read some of his work and would be interested to hear how he turns ordinary experiences into stories that stay with readers. If I met him, I would ask how he develops characters and whether his ideas usually come from real people. I would probably feel nervous at first, but I would try to listen more than speak. I admire writers who can describe complicated emotions in simple language. Meeting him would be memorable because it might give me a different view of books I have already read."],
  [/not allowed to use.*phone|mobile phone/i, "I was once asked to put my phone away during a university examination. The rule was explained before we entered the room, and everyone had to leave their devices in a designated area. I understood the reason because phones could distract students or create concerns about fairness. At first, I felt slightly uneasy because I often check the time on my phone. After the exam began, though, I stopped thinking about it and concentrated on the questions. The experience showed me that clear restrictions can be reasonable when they protect everyone's focus."],
  [/gave advice/i, "A friend once asked me whether she should take part in a public-speaking competition. She was interested but worried that she would make mistakes in front of an audience. I told her to sign up for a smaller event first and treat it as practice rather than a test of her ability. I shared how nervous I had felt during my first presentation. She decided to try, and although she did not win, she became much more confident. I felt pleased because the advice helped her take a step she had been avoiding."],
  [/piece of technology|technology.*own/i, "I would like to own a lightweight e-reader with a comfortable screen and a long battery life. I read quite often, but carrying several books is inconvenient when I travel. An e-reader would let me keep reading materials in one place and adjust the text size when I need to. I would use it on the train and before bed, rather than replacing every book I own. It would be useful because it combines portability with a focused reading experience. I would choose a simple model, since I do not need many extra features."],
  [/good at planning|plans a lot|organized|organised/i, "My mother is a very organised person. She writes appointments in a calendar, prepares things the night before and leaves enough time for unexpected delays. I noticed this most when our family moved house; she labelled the boxes and made a simple list of what needed to be done each day. As a result, the move felt much less stressful. I admire her because her planning is practical rather than complicated. It helps her make room for family time, and I have started using a calendar in a similar way."],
  [/child who loves drawing|drawing\/painting/i, "I would describe my young cousin, who has loved drawing since primary school. She often sketches animals, plants and characters from books, using coloured pencils and a small notebook. She is happy to spend a long time adding tiny details, but she does not worry too much if a picture is imperfect. Her parents keep some of her drawings on the wall, which encourages her to continue. I enjoy looking at her work because it shows how observant she is. Drawing also gives her a quiet way to express ideas she may not say aloud."],
  [/program or app|app on your/i, "An app I use regularly is a calendar app on my phone. I add assignment deadlines, appointments and reminders, and I can see the whole week at a glance. I started using it when several deadlines fell in the same week and I was worried I might forget something. The app is simple, so it does not take long to update. It helps me plan realistically and reduces the need to keep everything in my head. I still leave some free time in the calendar because a schedule should be useful, not too strict."],
  [/many people were smiling|occasion when.*smiling/i, "One occasion when many people were smiling was my cousin's graduation celebration. Our family met at a restaurant after the ceremony, and she arrived wearing her gown with a bunch of flowers. Everyone was proud of her, especially because she had worked hard through a demanding course. We took photos, shared a meal and listened to her talk about what she wanted to do next. The atmosphere felt warm rather than formal. I remember it because the happiness came from a real achievement that the whole family could celebrate together."],
  [/proud of a family member/i, "I felt proud of my older sister when she passed a professional exam after preparing for several months. She had to balance studying with her job, so she made a careful routine and used her weekends wisely. There were moments when she felt discouraged, but she kept going and asked colleagues for advice. When she received the result, she called our parents straight away. I was proud because the achievement reflected both her knowledge and her persistence. It also reminded me that quiet, steady effort can lead to something important."],
  [/kept in your family/i, "An important object in my family is an old recipe notebook that belonged to my grandmother. It contains handwritten notes about dishes she used to cook for family gatherings. The pages are worn and some measurements are only approximate, but that is part of its charm. My mother still uses it when preparing a few traditional meals. I like it because it connects us with family memories in a very ordinary, practical way. It is not valuable in a financial sense, but we would all be sad if it were lost."],
  [/bicycle\/motorcycle\/car trip/i, "I would like to take a cycling trip around a lake with a couple of friends. We could rent bicycles, follow the path at an easy pace and stop whenever we find a good place to rest. I would choose a mild day and pack water and a light meal. The trip would not need a complicated schedule, which is part of its appeal. I enjoy cycling because it lets me notice the scenery while still feeling active. I think sharing the route with friends would make the day more memorable."],
  [/solved a problem in a smart way/i, "A classmate once solved a problem cleverly when our presentation file would not open on the classroom computer. We had already tried restarting the machine, but it did not help. She remembered that we had uploaded a copy to a shared drive, so she opened it in a browser and presented from there. The solution was simple, but it saved us a lot of time. I admired her calmness because the rest of us were getting nervous. It reminded me that staying composed can make it easier to notice options that are already available."],
  [/learned something without a teacher/i, "One of my friends taught himself to play the guitar using online lessons. He began with basic chords and practised for about twenty minutes most evenings. When his fingers hurt or a song sounded wrong, he slowed the video down and tried again instead of quitting. After a few months, he could play several songs for us. I admire his self-discipline because there was no teacher checking his progress. His example showed me that online resources can be effective when someone has a clear goal and a regular routine."],
  [/didn.t enjoy the music|event.*music/i, "I once attended a campus music event that I did not enjoy very much. It was held in an outdoor square, and I went with some classmates because they wanted to see the performers. The music was much louder than I expected, and most of the songs were unfamiliar to me. I stayed for a while to enjoy the atmosphere, but eventually I moved to a quieter area and chatted with my friends. I do not regret going, since it was a new experience, but next time I would check the programme before I attend."],
  [/movie.*enjoyed|film you watched and enjoyed/i, "A film I enjoyed recently was an animated story about a young person trying to find a place in a new city. I watched it at home with a friend on a quiet evening. The visuals were colourful, but what I liked most was the way the characters changed as they faced small setbacks. The story was easy to follow and had a few genuinely funny moments. I felt relaxed afterwards, but I also thought about how difficult it can be to start again somewhere unfamiliar. I would happily watch it a second time."],
  [/interesting building/i, "An interesting building I have visited is the Suzhou Museum. It was designed by I. M. Pei and combines modern shapes with colours and courtyards that suit the surrounding old neighbourhood. I went there with my family on a weekend and spent time looking at both the exhibits and the architecture. The rooms feel bright but calm, and the building never competes with the objects inside it. I liked it because it shows how a modern public space can respect local history. I would recommend it even to people who are not regular museum visitors."],
  [/imagination/i, "I used my imagination during a school writing assignment about a future city. We had to describe how people might travel and live there, so I pictured quiet streets with more trees and fewer private cars. I added a small story about a student commuting by shared electric bus. It was not meant to be a realistic engineering plan; the goal was to explore possibilities. I enjoyed the task because there was no single correct answer. It helped me realise that imagination can make an ordinary topic more interesting and can also lead to practical ideas."],
  [/person who often helps others|person who likes to look after the natural/i, "My neighbour is someone who regularly helps the people around her. She organises small clean-up mornings in our residential area and checks whether elderly neighbours need help carrying groceries. I first noticed this when she picked up litter near the entrance and invited a few of us to join in. She never makes a big show of it; she simply sees a task and starts. I admire her because her actions are consistent and make the neighbourhood more pleasant. She has encouraged me to be more attentive to the people and places around me."],
  [/spent more than expected/i, "I once spent more than I had planned on a laptop for university. I originally wanted a basic model, but the cheaper options had limited memory and would not handle the software I needed. I compared several brands, read reviews and eventually chose a mid-range one. It cost more than my first budget, but I use it almost every day for assignments and online classes. I felt cautious about the purchase at first, then satisfied when it worked reliably. I learned to compare long-term usefulness with the initial price."],
  [/encouraged someone/i, "I encouraged a friend to give a short presentation at a student event, even though she was nervous about speaking in public. I suggested that she start by sharing an idea she already knew well and practise once with a small group. I also reminded her that the audience was there to listen, not to judge every mistake. She decided to take part and did a good job. Afterwards, she said she was glad she had tried. I felt happy for her because a little support helped her move beyond her usual comfort zone."],
  [/look after the natural world/i, "My uncle cares a lot about the natural world. He grows plants on his balcony, avoids wasting food and joins a local group that cleans up a nearby riverbank. I became aware of his habits when I visited him and saw that he reused containers for seedlings. He does not expect one person to solve every environmental problem, but he believes daily choices still matter. I respect him because he acts on his values without lecturing other people. His example has made me more careful about litter and unnecessary plastic."],
  [/famous person being interviewed|interviewed/i, "I watched an interview with a well-known Chinese athlete on a video platform after she won an international competition. The host asked about her training routine, but the most interesting part was how she talked about dealing with pressure. I watched it at home one evening and later shared a short clip with a friend who follows sports. The interview felt honest because she described setbacks as well as success. I came away feeling impressed by her discipline. It also showed me that a good interview can reveal more than a person's public image."],
  [/noisy place/i, "A noisy place I have been to is a busy railway station during the Spring Festival travel period. I went there with my family to catch a train, and the hall was full of announcements, rolling suitcases and people talking. It was difficult to hear one another, so we stayed close and checked our platform carefully. The noise was understandable because thousands of people were travelling at the same time, but it still felt tiring. I was relieved once we found our seats. Since then, I try to arrive early and avoid rushing through crowded stations."],
  [/natural place in your city|natural place/i, "A natural place I enjoy visiting is a lakeside park not far from where I live. I usually go there at weekends with a friend, especially when the weather is mild. There is a walking path, a few shaded benches and enough open space to see the water. We might walk for half an hour and then sit down to talk. I like the park because it gives me a break from traffic and screens without requiring a long journey. It is a simple place, but I always feel calmer after spending time there."],
  [/saved money/i, "I once saved money to buy a good pair of wireless headphones. I wanted them for commuting and online classes, but I did not want to spend impulsively. I set aside a small amount each week and compared a few models before choosing one with a comfortable fit and a reliable battery. It took about two months, so buying them felt more satisfying than using a payment plan. I have used them regularly since then. The experience taught me that saving towards a specific goal makes it easier to control small everyday spending."],
  [/new skill you learned when you were a child/i, "A useful skill I learned as a child was riding a bicycle. My father taught me in a quiet open space near our home. At first, he held the back of the seat while I tried to keep my balance, and I fell a couple of times. After several attempts, I managed to ride a short distance by myself. I felt proud because it was the first time I learned something through practice rather than being told about it. I still enjoy cycling now, and the memory reminds me to be patient when learning."],
  [/really likes taking photos/i, "My father is someone who really enjoys taking photos. He usually photographs street scenes, family gatherings and small details such as old shop signs. He carries a camera when we travel, but he also uses his phone for everyday moments. I got used to this when I was young, and now I sometimes look through his albums to remember trips. I like that he pays attention to light and composition, but he does not interrupt every moment to take a picture. His photos help our family keep memories that might otherwise fade."],
  [/older than you that you admire/i, "I admire my grandfather, who is much older than me and has always been patient. I learned a lot about him through family meals, when he tells stories about his first job and how the city has changed. We sometimes take a walk together or look at old photographs. What I respect most is that he stays curious and is willing to learn how to use new technology. He does not complain about younger generations, even when our habits are different. Spending time with him helps me see how much experience can teach us."],
  [/good service in a shop/i, "I once received excellent service at a small electronics shop near my university. I went there because my laptop charger had stopped working, and I was unsure which replacement to buy. The staff member checked the model number, explained two suitable options and let me compare them without pressure. The charger worked properly, and the price was fair. I appreciated the service because the advice was clear and focused on what I needed rather than on selling the most expensive product. I left feeling confident about the purchase and would go back there."],
  [/making things by hand/i, "A friend of mine is good at making things by hand, especially small clay cups and decorations. She learned the basics in an art class and now practises at a community studio. She chooses the clay, shapes it carefully and paints simple patterns after it has dried. I have watched her work, and it takes much more patience than I expected. I admire her because she can turn an ordinary material into something useful and personal. She once made a small cup for me, which I still keep on my desk."],
  [/enjoyable evening.*friends/i, "One enjoyable evening I had with friends was after we finished a difficult group assignment. We met at a small hot-pot restaurant, shared a meal and then walked to a nearby park. Nobody had planned anything special; we mainly wanted to relax and talk about something other than coursework. The conversation was easy, and we laughed about a few mistakes we had made during the project. I enjoyed it because it felt like a genuine break after a busy week. I realised that simple time with friends can be more refreshing than an elaborate night out."],
  [/waste of time/i, "An activity I sometimes feel is a waste of time is scrolling through short videos when I am tired. I usually do it in the evening, telling myself I will stop after a few minutes. In reality, one video leads to another, and I can lose half an hour without remembering much of what I watched. I do it because it is an easy way to switch off, but it does not always help me feel rested. I have started setting a timer and putting my phone away before bed, which gives me more control."],
  [/crowded place/i, "A crowded place I visited was a popular night market during a holiday. I went with two friends to try local snacks and look around the small stalls. It was difficult to walk quickly because so many people were stopping to take photos or decide what to buy. Still, the atmosphere was lively, and we discovered a few dishes we had never tried before. I stayed close to my friends and agreed on a meeting point in case we got separated. It was enjoyable for a short visit, although I would not want to go there every weekend."],
  [/person who learns history/i, "My friend Jun enjoys learning history, especially the history of cities. He reads books, listens to podcasts and visits museums when he travels. When we went to an old neighbourhood together, he explained how the streets had changed over time and pointed out details I would have missed. I like his interest because he does not treat history as a list of dates; he wants to understand how ordinary people lived. Talking with him makes places feel more meaningful. I have started reading short historical articles after hearing his recommendations."],
  [/person who taught you a new skill/i, "A person who taught me a new skill was my high-school art teacher. She showed me how to take better photographs using natural light and a simple composition. We practised outside the classroom, comparing how the same subject looked from different angles. She gave clear suggestions but let us experiment instead of following one fixed rule. I felt encouraged because I could see an improvement after each attempt. I still use some of her advice when I take pictures on my phone. I remember her as a supportive teacher who made learning enjoyable."],
  [/movie\/film you don.t like/i, "A film I did not enjoy was a horror movie my friends chose for a movie night. The story began with an interesting mystery, but it relied on sudden loud sounds and repeated scenes to create tension. I found it more tiring than frightening, and some parts felt predictable. I watched it with my friends at home, so we joked about it afterwards and still had a good evening. I do not mind horror as a genre, but I prefer films with believable characters. This one was not really my style."],
  [/short trip.*do not like|short trip you often take/i, "A short trip I often take but do not enjoy is the bus journey across town during the evening rush hour. It normally takes about forty minutes, but traffic can make it much longer. I usually take it to visit a relative, so I cannot avoid it completely. The bus is affordable, although it gets crowded and it can be hard to find a seat. I listen to a podcast to make the time pass more quickly. I would prefer to travel earlier, but my schedule does not always allow that."],
  [/popular person/i, "A popular person I know is a classmate who is friendly without trying too hard to impress people. She remembers details about others, includes quieter students in conversations and is reliable when group work needs to be done. I noticed this during a class project, when she made sure everyone had a chance to share an idea. People like her because she makes them feel comfortable, not because she is the loudest person in the room. I respect that quality and have tried to be more welcoming in my own conversations."],
  [/public building/i, "A public building I enjoy visiting is the central library in my city. It has a bright reading area, helpful staff and a quiet floor where students can work. I first went there to prepare for an exam, but now I sometimes visit just to read or borrow a book. The building is modern and easy to navigate, with clear signs and plenty of natural light. I like it because it gives people a calm place to learn without having to buy anything. It feels like a useful shared space for the whole community."],
  [/party for a special event/i, "A party that impressed me was a small graduation celebration for one of my close friends. It was held at her home, and her family had prepared simple food and decorated the living room with photos from university. We played music, shared stories and gave her a few thoughtful gifts. What made it special was how personal it felt; nobody was trying to make it look perfect. My friend was happy to see people from different parts of her life together. I remember the evening because the celebration reflected the effort she had put into reaching her goal."],
  [/healthy habits|healthy daily routine/i, "My roommate has a healthy daily routine. He usually goes to bed at a reasonable time, prepares a simple breakfast and cycles to campus when the weather is good. He also takes short breaks while studying instead of sitting for hours without moving. I noticed these habits because he seems energetic even during a busy term. He is not strict about everything and still enjoys eating out with friends. I admire that balance because it makes his routine realistic. Seeing him has encouraged me to be more consistent with sleep and exercise."],
  [/book you enjoyed|book.*made you happy/i, "A book that made me happy was The Little Prince. I read it again recently after a friend recommended it, and I enjoyed how simply it talks about friendship and responsibility. The story is easy to follow, but some of its ideas feel more meaningful when you are older. I read a few chapters in the evening and found myself thinking about them afterwards. It made me feel calm rather than excited. I would recommend it because readers of different ages can take something personal from the same story."],
  [/person did something to help you solve a problem|time when you helped someone/i, "I once helped an elderly visitor find the right bus stop near a busy shopping area. She was looking at a map on her phone but seemed unsure which side of the road to wait on. I checked the route with her and walked to the correct stop, which was only a few minutes away. She thanked me and looked much less worried. The situation was simple, but I was glad I had taken the time. It reminded me that practical help does not need to be complicated to make someone's day easier."],
  [/first met|impression.*person|person.*know.*more/i, "I once met a new classmate at the start of a university course and immediately wanted to know more about her. She asked thoughtful questions and listened closely instead of trying to dominate the conversation. We were assigned to the same group, so I had a chance to speak with her again. I learned that she had travelled widely and was interested in photography. My first impression was that she was calm and open-minded, and that turned out to be true. I would like to know more about how she chooses the stories she photographs."],
  [/gift.*friend|gift you gave/i, "A gift I gave to a friend was a small instant camera for her birthday. She enjoys taking photos, so I thought she would like something that made it easy to print a few memories. I saved up and chose a simple model after checking reviews. When she opened it, she immediately started taking pictures of everyone at the party. I felt pleased because the gift matched her interests and gave us something fun to do together. She still brings it to trips, and the photos have become little reminders of our time as friends."],
  [/lost.*public|public place.*lost/i, "I once left my wallet on a bench in a public library. I noticed it was missing when I reached the bus stop, so I went back and asked the information desk for help. Luckily, another visitor had handed it in. I checked that everything was there and thanked the staff before going home. I felt embarrassed, but also relieved that someone had acted honestly. Since then, I keep my wallet in the same zipped pocket and check for it before I leave a place. The experience made me more careful with my belongings."],
  [/save.*time|time-saving|saving time/i, "A change that has saved me time is preparing my bag and clothes the night before class. I started doing it when I had several early mornings in a row and kept forgetting small things. Now I check my timetable, charge my devices and put the books I need by the door. It only takes a few minutes, but it makes the morning less rushed. I feel calmer and am less likely to arrive late. The habit is simple enough to keep, so I would recommend it to anyone whose mornings feel chaotic."],
  [/special cake/i, "A special cake I received was a small homemade birthday cake from my family. It was decorated with fresh fruit rather than elaborate icing, and my sister had written a short message on top. We shared it after dinner at home, so the occasion felt relaxed and personal. I appreciated the cake because my family had spent time making it instead of simply buying something expensive. It tasted good, but the memory matters more than the recipe. I still have a photo of it, and seeing it reminds me of that warm evening."],
  [/important river|lake/i, "An important river near my region is the Yangtze River. It supports transport, agriculture and many communities, and it has also played a major role in the country's history. I learned about it in school, but visiting a riverside city helped me understand its scale better. People use the river area for walking and recreation, while local businesses depend on it in different ways. I think protecting its water quality is essential because so many people and ecosystems are connected to it. It is both a natural resource and part of our shared cultural landscape."],
  [/spend very little|spent little|inexpensive day|cost you little|didn.t cost you much/i, "One day out that cost very little was a walk around a public park with a friend. We brought water from home, explored a path we had not taken before and bought one small snack from a street stall. We spent most of the afternoon talking and taking photos, so there was no need to pay for an attraction. I enjoyed it because the day felt full without being expensive. It reminded me that free public spaces can provide a lot of enjoyment when you have good company and a bit of curiosity."],
  [/organize.*happy|organise.*happy|happy event/i, "I helped organise a small welcome event for new students in my department. We booked a classroom, prepared a simple quiz and asked a few senior students to share practical advice. I made a checklist and divided tasks so nobody had to handle everything alone. At the beginning, I worried that people might not join in, but the quiz helped everyone relax and talk to someone new. I felt pleased when students stayed afterwards to chat. The event was not complicated, but careful planning made it welcoming and enjoyable."],
  [/traffic jam/i, "I remember being stuck in a traffic jam on the way to a family dinner across town. It was a rainy Friday evening, and several roads were moving very slowly. I was travelling with my parents, so we listened to the radio and changed our route using a map app. We still arrived late, but the restaurant kept our table. I felt impatient at first, then accepted that there was little we could do. The experience made me more likely to leave extra time when travelling during rush hour."],
  [/new skill you learned/i, "A new skill I learned when I was a child was riding a bicycle. My father taught me in a quiet open space near our home. At first, he held the back of the seat while I tried to balance, and I fell a couple of times. After several attempts, I managed to ride a short distance by myself. I felt proud because I had learned through practice rather than simply being told what to do. I still enjoy cycling, and the memory reminds me to be patient with beginners."],
  [/\bclass(?:es)?\b|\blesson\b|\bcourses?\b/i, "One course that impressed me was linear algebra. Our lecturer used geometric diagrams to show how matrices can transform points and shapes, which made an abstract topic much easier to picture. I worked through examples with classmates and gradually saw how the same ideas could be used in computer graphics and data analysis. The course was challenging, especially when we had to write proofs, but the lecturer explained each step clearly. I liked it because it connected precise theory with practical applications, and it made me more confident about tackling difficult mathematical problems."],
  [/happy person you know/i, "One of the happiest people I know is my friend Rui. He does not need a special occasion to enjoy himself; he often feels pleased after a good meal, a walk or a conversation with friends. When something goes wrong, he gives himself a little time and then focuses on what he can do next. I think he is happy because he notices small positive things instead of comparing his life with other people's. Spending time with him lifts my mood, and it has reminded me that happiness can come from ordinary routines."],
  [/home that you like to visit but do not want to live/i, "I like visiting my uncle's home, although I would not want to live there myself. It is an old apartment in the centre of the city, full of books, family photos and interesting objects he has collected over the years. There is always something to look at, and my relatives often gather there for dinner. However, the rooms are small and the street outside is noisy, so it would not suit my daily routine. I enjoy the warm atmosphere as a guest, but I prefer a quieter and more spacious home."],
  [/story\/book with animals|book with animals/i, "A story with animals that I remember well is Charlotte's Web. I read it when I was younger, and I liked the friendship between Wilbur the pig and Charlotte the spider. The language is clear, but the story deals with kindness, loyalty and loss in a thoughtful way. I remember talking about it with a teacher after we finished the book. It made me feel both happy and a little sad, which is why it stayed in my mind. I would still recommend it to children because it is entertaining while encouraging empathy."],
  [/changed an important opinion/i, "I changed my opinion about online classes after taking one during a busy semester. I used to think they were less effective than face-to-face lessons because it was harder to stay focused. However, a well-organised course gave us useful recordings and small discussion groups, so I could review difficult parts at my own pace. I still prefer meeting teachers in person for complicated topics, but I now see that online learning can work well when students take part actively. The experience taught me to judge a method by how it is used rather than by its format alone."],
  [/city.*visit again|place you would like to visit in your free time/i, "I would like to spend more time in Hangzhou, especially around West Lake and the older parts of the city. I have already visited once, but the trip was short and we followed a busy schedule. Next time, I would go in spring, walk along the lake in the morning and leave time to explore small streets without rushing. I would probably travel with a close friend and try a few local dishes. I want to return because the city feels calm and lively at the same time, and there is still plenty I have not seen."],
  [/piece of local news/i, "A piece of local news that interested people in my area was the opening of a new public library and community centre. The building added a quiet place to study, rooms for local activities and a small children's area. I first heard about it through a neighbourhood group, and several families shared photos after visiting. People were interested because the area had needed more public spaces for a long time. I think the centre will be useful if it offers regular events and stays easy to reach. It is a practical improvement that can bring neighbours together."],
  [/thing you did to learn another language/i, "One thing I did to improve my English was listen to a short podcast every morning and write down a few useful phrases. I chose episodes about everyday topics, so the language was easier to reuse in conversation. At first, I paused often to check new words, but later I tried to understand the main idea without stopping. I also repeated some sentences aloud to practise pronunciation. The routine only took about fifteen minutes, which made it easy to continue. I noticed gradual progress, especially when I felt more comfortable speaking in class."],
];

function partTwoAnswer(topic) {
  const prompt = topic.prompt || "";
  if (/a law on environmental protection/i.test(prompt)) {
    return "One example is household waste-sorting rules used in cities such as Shanghai. Residents separate rubbish into categories such as recyclables and food waste, and apartment buildings provide clearly labelled bins. I first learned about the rules through local news and then noticed the signs near residential buildings. They benefit the city because recycling becomes easier and less waste is sent to landfill. Some people found the system confusing at first, but clear instructions have helped. I think it is a practical law because it turns environmental protection into a small habit people can follow every day.";
  }
  if (/a new law you would like to introduce/i.test(prompt)) {
    return "If I could introduce one new law, I would require public buildings and transport to provide basic wheelchair access. Older buildings could be given a reasonable deadline and financial support to make the changes. I thought of this after seeing how difficult it can be for someone using a wheelchair to enter a shop or reach a station platform. The law would benefit people with disabilities, older residents and parents with prams. I would support it because access to public services should not depend on a person's mobility. The details would need careful planning, but the aim is straightforward and fair.";
  }
  if (/a short-term job you want to have in a foreign country/i.test(prompt)) {
    return "A short-term job I would like to try is working as a research assistant at a university in Singapore. I could help organise survey results, check calculations and prepare simple charts for a research project. I would be interested because it would let me use mathematics outside the classroom and learn how researchers work in a different country. The position might last for a few weeks during the summer. I would also get to practise English with an international team and become more independent. It would be a useful first step before applying for a full-time role after graduation.";
  }
  if (/a person who works in a successful company/i.test(prompt)) {
    return "My cousin works as a data analyst for a large online retail company. She studies sales information and helps the team understand which products customers are looking for. The company has grown because it offers a wide range of goods and makes ordering convenient, but I think reliable delivery and customer service are just as important. My cousin says people from business, technology and statistics work closely together. I find her job interesting because it uses numerical skills to answer practical questions. Her experience has shown me that a company needs to understand its customers and keep improving its service if it wants to succeed.";
  }
  if (/a successful sportsperson you admire/i.test(prompt)) {
    return "A successful sportsperson I admire is Eileen Gu, the freestyle skier. I first heard more about her when she competed at the Beijing Winter Olympics. She is known for her skill in several events and for performing under pressure at a very high level. I also admire the amount of training and discipline her sport requires, because one small mistake can affect a whole run. What makes her interesting to me is that she seems confident but still focused on improving. Her achievements have encouraged more young people to take an interest in winter sports, and I respect the commitment behind that success.";
  }
  if (/person did something to help you solve a problem/i.test(prompt)) {
    return "A classmate once helped me solve a problem with a presentation just before it was due. My laptop would not connect to the classroom projector, and restarting it did not work. He stayed calm, exported the slides as a PDF and opened the file on the classroom computer. We were able to present on time, so I felt relieved and grateful. I thought his solution was clever because he focused on what we needed to do rather than wasting time trying every possible repair. Since then, I have kept a backup copy of important files, and I still remember how useful his quick thinking was.";
  }
  if (/a person who likes to look after the natural world/i.test(prompt)) {
    return "My neighbour is someone who genuinely cares about the natural world. She helps organise a clean-up along the small river near our residential area and encourages people to sort their rubbish properly. She also grows native plants in a shared garden to attract butterflies. She does these things regularly, even though they are not part of her job. I admire her because she makes environmental care practical and invites other residents to join in instead of criticising them. Her efforts have made the area cleaner, and they have encouraged me to pay more attention to the nature around my home.";
  }
  if (/a time when you organized a happy event successfully/i.test(prompt)) {
    return "I once organised a welcome event for new students in my department. A few classmates helped me book a room, prepare a short quiz and invite senior students to share advice. I made a simple checklist and divided the jobs so everyone knew what to do. At first, I worried that the new students might feel shy, but the quiz gave them an easy way to start talking. By the end, people were chatting in small groups and several stayed to ask questions. I felt pleased because the event was relaxed and useful. It taught me that clear preparation can make a simple gathering feel welcoming.";
  }
  if (/gift you would like to buy for your friend/i.test(prompt)) {
    return "I would buy a close friend of mine a small instant camera. We met at university and have known each other for about three years. She enjoys taking photos, especially when we travel, so I think she would use it often. I would choose a model that is easy to carry and not too expensive, then add a pack of film and a handwritten note. I like this gift because it suits her interests and gives her a way to keep real prints of shared memories. It feels more personal than choosing something simply because it is fashionable.";
  }
  if (/received a message.*long time to reply/i.test(prompt)) {
    return "I once received a message from a classmate asking for notes from a lecture, but I did not reply until the next evening. I had seen the notification while travelling and then forgot about it once I got home. When I remembered, I apologised and sent the notes straight away. I felt a little embarrassed because she needed them to prepare for a quiz. Since then, I try to reply briefly as soon as I read an important message, even if I cannot give a full answer at that moment.";
  }
  const match = partTwoExamples.find(([pattern]) => pattern.test(prompt));
  if (match) return match[1];
  return "I would like to talk about an experience that has stayed in my memory. It happened a while ago, when I was spending time with people close to me. At first, I was not sure what to expect, but a small detail made the experience more interesting. We talked, worked through what was happening and learned something from it. I remember it because it felt genuine rather than perfectly planned. Looking back, I am glad it happened, and I would describe it as a useful experience that I can still relate to today.";
}

const discussionProfiles = [
  [/technology|devices?|phones?|computers?|internet|\bAI\b|\bapps?\b|messages?|online/i, {
    cause: "People adopt technology when it removes a real inconvenience. A shared calendar, for instance, can prevent missed appointments because everyone sees the same up-to-date information.",
    benefit: "Its main benefit is speed: people can find information or contact someone in seconds. That is useful for everyday tasks, provided the information is checked before it is trusted.",
    contrast: "Digital tools are faster for routine tasks, while face-to-face communication is often clearer when a subject is sensitive or complicated. The best choice depends on how much discussion is needed.",
    action: "Schools and families should teach people to use the tool for a clear purpose, check sources and protect personal information. Practical guidance works better than simply banning every new technology.",
    view: "It can be helpful, but it should support people's judgement rather than replace it. Clear limits matter most when privacy, learning or safety could be affected.",
    example: "Navigation apps, for example, help people compare routes and avoid delays. They are useful, but a traveller still needs to check the destination and local conditions.",
  }],
  [/environment|nature|recycl|pollut|plant|garden|green/i, {
    cause: "People are more likely to protect nature when they can see a practical result. A clean local park, for example, gives residents a reason to keep the area free of litter.",
    benefit: "Green spaces improve daily life by giving people room to walk, exercise and cool down in hot weather. They can also support local wildlife, especially when connected by trees and planting.",
    contrast: "Economic growth provides jobs and services, but environmental damage can create health costs that are difficult to reverse. Good planning should allow development while setting clear limits on pollution.",
    action: "Authorities can provide convenient recycling points, reliable public transport and clear information. Individuals are more likely to cooperate when the greener option is also easy to use.",
    view: "Yes, as long as the rules are practical and applied fairly. Education and convenient facilities usually build lasting habits; punishment is more useful for repeated or serious violations.",
    example: "A community garden is a good example: residents grow food, learn about plants and meet their neighbours in one shared space. Even a small area can be useful.",
  }],
  [/\blaw\b|\brules?\b|obey|punish|government|school rules/i, {
    cause: "Rules are needed when one person's choices can affect other people. A school, for example, needs consistent expectations so lessons can continue and students feel safe.",
    benefit: "Clear rules make expectations predictable and help protect people's safety and rights. They work best when everyone understands the reason behind them.",
    contrast: "A reminder or explanation can correct an honest mistake, whereas a penalty may be necessary for repeated or harmful behaviour. The response should match the seriousness of the action.",
    action: "Parents and teachers should explain the reason for a rule, model it themselves and apply it consistently. Children are more likely to follow a rule they understand.",
    view: "Yes, when they are fair, clearly explained and open to review. Rules that are too strict or unrelated to real needs can create resentment instead of responsibility.",
    example: "A useful school rule might ask students to put phones away during lessons. It protects concentration, while still allowing students to use their devices when the lesson requires them.",
  }],
  [/urban|city|cities|building|crowd|noise|public place|park/i, {
    cause: "People move to cities because jobs, education and public services are closer together. The same concentration can create heavy traffic when housing and transport are poorly planned.",
    benefit: "Dense neighbourhoods can support frequent public transport, local shops and shared facilities. Residents may reach work or school without needing a long car journey.",
    contrast: "Cities offer more services and job choices, while the countryside is usually quieter and has more open space. Neither is ideal for everyone; age, work and health all matter.",
    action: "City planners should connect housing with reliable transport and protect parks as neighbourhoods grow. That reduces long commutes and keeps public space within walking distance.",
    view: "Growth can be positive if housing, transport and green space keep pace with the population. Without that planning, a larger city can simply mean longer journeys and crowded services.",
    example: "A well-connected neighbourhood shows what good design can do: residents can reach a bus, a small park and everyday shops on foot instead of driving across town.",
  }],
  [/travel|tour|holiday|trip|journey|transport|tourist/i, {
    cause: "People travel to take a break, see unfamiliar places or spend time with family. Younger travellers may have fewer work and care commitments, while older people may prefer a slower pace.",
    benefit: "Travel lets people experience local customs directly and gives income to hotels, restaurants and guides. The benefit is greatest when visitors respect the place they are visiting.",
    contrast: "A book gives background information at a low cost, but travelling brings sounds, food and daily life into view. They work well together: reading first can make a visit more meaningful.",
    action: "Travellers can plan transport and accommodation early, then leave some free time for unexpected discoveries. A flexible schedule is usually more enjoyable than trying to see everything.",
    view: "It is useful to plan the main details, especially transport and accommodation, but an itinerary should leave room to rest. The right length depends on distance, budget and purpose.",
    example: "A short city break can work well if visitors choose one or two main activities each day. That leaves time to explore local streets instead of rushing between attractions.",
  }],
  [/child|young|school|learn|teacher|skill|history|language|education|\bclass(?:es|room)?\b/i, {
    cause: "Children are more engaged when a lesson connects with something they already know or can try themselves. A simple experiment is easier to remember than a list of facts.",
    benefit: "Learning early gives children time to practise and make mistakes while an adult can guide them. Skills such as reading, cooperation and basic problem-solving are useful across subjects.",
    contrast: "Children often learn through play and repetition, whereas adults tend to connect new information with existing experience. Adults may focus better, but children are often less self-conscious about practising.",
    action: "Teachers can break a skill into small steps, demonstrate it and give students a chance to practise. Parents can support that process without expecting immediate perfection.",
    view: "Yes, when the lesson is suitable for their age and taught in an engaging way. Short activities and real examples usually work better than pressure to memorise details.",
    example: "A class project, museum visit or conversation at home can introduce history naturally. Children are more likely to stay interested when they can ask questions and connect the topic to real life.",
  }],
  [/health|sport|athlet|exercise|food|routine|tired|doctor|medical|medicine|hospital/i, {
    cause: "People are more likely to keep a healthy habit when it fits their normal day. Walking to a nearby shop, for example, is easier to maintain than a demanding routine that needs special equipment.",
    benefit: "Regular activity can improve fitness and mood, and team sports also give people a chance to practise cooperation. The activity does not have to be competitive to be worthwhile.",
    contrast: "Younger people may focus on performance, while older people often choose activities that protect mobility and heart health. In both cases, enjoyment makes a routine easier to keep.",
    action: "Schools and communities can offer safe spaces, affordable classes and different levels of activity. People are more likely to participate when beginners do not feel judged.",
    view: "Yes, but access matters as much as information. Safe parks, affordable healthy food and realistic work schedules make healthier decisions possible for more people.",
    example: "A weekly walk with a friend is a realistic starting point. It provides gentle exercise and social contact, so people may be more likely to continue than if they train alone.",
  }],
  [/business|company|money|shop|advertis|consumer|service|purchase|saving/i, {
    cause: "People start businesses to act on an idea, gain independence or meet a need they have noticed. A clear customer problem is a stronger starting point than enthusiasm alone.",
    benefit: "Competition gives customers more choice, and successful businesses create jobs and useful services. Small shops can also offer personal advice that is harder to find in a large chain.",
    contrast: "Large stores often offer wider choice and lower prices, while small shops can provide more personal service. Online shopping is convenient, but it is harder to judge quality before delivery.",
    action: "Businesses need to understand their customers, control costs and provide consistent service. Governments can make rules clear and offer training, but a business still needs a workable plan.",
    view: "Profit matters because it keeps a business operating, but it is not the only measure of success. Fair treatment of staff and lasting customer trust also matter.",
    example: "A neighbourhood shop can keep customers by stocking useful local products and remembering regular buyers. That personal service gives people a reason to return even when a chain is nearby.",
  }],
  [/work|job|career|leader|team|manager|company/i, {
    cause: "People work better when expectations are clear and their contribution is recognised. Confusion about roles can waste time, even when the team members are capable.",
    benefit: "Working together lets people combine different strengths and share difficult tasks. It is especially useful when a problem needs both technical knowledge and communication.",
    contrast: "Working alone gives people more control and can suit tasks needing concentration. A team is better for complex projects, provided members agree on roles and communicate regularly.",
    action: "A good leader sets a clear goal, listens to the team and makes responsibilities fair. People are more willing to follow someone who gives useful feedback and takes responsibility too.",
    view: "Yes, but organisation should support the work rather than create unnecessary rules. A simple plan with room to adapt is usually more useful than a perfect schedule.",
    example: "For a group assignment, dividing research, writing and presenting lets each student contribute a strength. A short check-in can catch problems before the deadline.",
  }],
  [/friend|family|elder|older|old people|generation|popular|pet|animal|relationship/i, {
    cause: "People value relationships because they provide support, shared memories and a sense of belonging. A brief conversation can matter a lot when someone is going through a difficult period.",
    benefit: "Spending time with other people helps children learn to listen and cooperate. For older adults, regular contact can also reduce loneliness and keep them involved in community life.",
    contrast: "Friends often share interests and choose each other, while family relationships include people from different ages and backgrounds. Both can offer support in different situations.",
    action: "People can keep relationships strong by making time to listen, sharing everyday tasks and talking openly about disagreements. Regular, low-pressure contact is often enough.",
    view: "No, not necessarily. Shared values and mutual respect are more important than identical interests; friends can enjoy different hobbies and still understand each other well.",
    example: "Cooking a meal or taking a walk together gives relatives time to talk without forcing a serious conversation. Small routines can help people stay close.",
  }],
  [/film|movie|book|story|photo|video|music|\bart\b|advertis|media|news|reading|interview/i, {
    cause: "People choose media that fits their mood and interests. A short video is convenient during a break, while a book or documentary can hold attention for a more detailed subject.",
    benefit: "Stories and images can introduce people to unfamiliar lives and places. A well-made film, for example, can make a historical setting easier to picture than a short written summary.",
    contrast: "Books let readers imagine details and move at their own pace, whereas films provide sound and images immediately. The better choice depends on whether someone wants depth or convenience.",
    action: "Creators should give audiences accurate information, a clear story and a reason to keep watching or reading. Viewers can compare sources when a subject involves real events.",
    view: "Both forms have value, although visual media is easier to consume quickly. Books often allow more detail, so watching a film does not always replace reading the original story.",
    example: "People often choose comedies for shared viewing because humour gives a group something to react to together. Documentaries attract viewers who want a clear introduction to a real subject.",
  }],
  [/decision|change|\bplans?\b|\bplanned\b|\bplanning\b|goal|ambition|routine|schedule|deadline|time management/i, {
    cause: "People set goals to give their effort a direction and make progress easier to judge. A clear short-term target can make a larger ambition feel manageable.",
    benefit: "Planning reduces avoidable stress because people can see what needs to be done and when. It is especially helpful when several people depend on the same arrangement.",
    contrast: "A quick decision is sensible when the consequences are small and reversible. For an important choice, taking time to compare options and ask for advice can prevent regret.",
    action: "It helps to break a goal into smaller steps, set a realistic deadline and review progress. If circumstances change, adjusting the plan is more useful than following it blindly.",
    view: "Having a goal is useful, but it should not become a source of constant pressure. People need room to change direction when their interests or circumstances develop.",
    example: "Someone preparing for an exam could set a weekly revision target and check which topics still need work. Small, visible progress is easier to maintain than a vague promise to study more.",
  }],
  [/history|culture|festival|party|tradition|food|gift|historic/i, {
    cause: "Traditions continue because they give families and communities a shared way to mark important events. Food, music and familiar customs can make those occasions feel distinctive.",
    benefit: "Cultural events help people understand where local customs come from and give visitors a chance to take part. They can also support local performers and small businesses.",
    contrast: "Older customs often emphasise family and shared rituals, whereas modern celebrations may be more personal and flexible. Many people combine both rather than choosing one.",
    action: "Schools and families can pass traditions on by explaining their meaning and letting children take part. A custom is more likely to survive when it remains relevant to daily life.",
    view: "Yes, as long as celebrations respect local residents and public money is used transparently. A modest event can build community pride without needing an expensive spectacle.",
    example: "A family meal during a festival is a simple example: preparing familiar dishes brings relatives together and gives younger family members a chance to learn the custom.",
  }],
  [/daily routine|everyday choices/i, {
    cause: "People's choices usually reflect their needs, budget and daily routine. What works well for one person may not suit someone with different responsibilities.",
    benefit: "A practical choice can save time and make everyday life more comfortable. It is also easier to keep up when people can see a clear benefit for themselves.",
    contrast: "The two options offer different strengths, so the better one depends on cost, convenience and personal preference. There is rarely one answer that suits everyone.",
    action: "People should compare the likely benefits with the cost and consider who else may be affected. A small trial is often a good way to see whether an idea works.",
    view: "It can be a good idea when it solves a real problem and does not create a larger one. The details matter more than whether the idea sounds attractive in general.",
    example: "For example, trying a new routine for a week gives someone a chance to see whether it is genuinely useful before making a long-term commitment.",
  }],
];

const specificPartThreeAnswers = [
  [/should documentary films be completely truthful/i, "They should be accurate about the facts, but a documentary still involves choices about what to include and how to present it. Filmmakers should make those choices clear and avoid changing footage in a way that misleads viewers."],
  [/movies help people better understand the cultural background/i, "Yes, a film can show everyday details such as food, family relationships and social customs that a short article might not explain. It is only one perspective, though, so viewers should not treat one film as a complete picture of a culture."],
  [/movies.*more creative than books/i, "Books often leave more room for imagination because readers picture the characters and settings themselves. Films can be creative through music, acting and visual design, so I would say the two forms encourage different kinds of creativity."],
  [/differences between watching movies at home and in a cinema/i, "At home, people can pause a film, choose their own snacks and spend less. A cinema offers a larger screen and stronger sound, which makes a new release feel more immersive, especially when watching with friends."],
  [/kinds of movies are the most popular in china/i, "Comedy, action and family films usually attract large audiences in China. They are easy to watch with friends or relatives, and a familiar story is a comfortable choice when people go to the cinema together."],
  [/problems.*transportation.*everyone commutes/i, "When many people travel at the same time, buses and trains become crowded and roads slow down. Staggered work hours and reliable public transport can spread demand across the day and make commuting less stressful."],
  [/benefits of travelling abroad/i, "Travelling abroad exposes people to a different language and everyday customs, which can make them more independent. It also gives them a chance to see familiar issues from another perspective, not just visit famous landmarks."],
  [/travelling or reading books about it/i, "Reading is a cheaper way to learn a country's history and background, while travelling lets people experience its atmosphere and daily routines directly. I would read a little before a trip and then use the visit to understand it better."],
  [/how much time.*spend on a trip abroad/i, "For a long-distance trip, about a week is a reasonable starting point because it allows time to adjust and visit a few places without rushing. The ideal length still depends on budget, leave from work and how far someone travels."],
  [/who prefers travelling abroad.*young or the old/i, "Younger people may find it easier to travel abroad because they often have fewer family responsibilities and are more willing to try unfamiliar activities. Older people travel too, but they may choose a slower itinerary or a group tour."],
  [/do chinese people like travelling abroad/i, "Yes, many Chinese people enjoy travelling abroad when time and budget allow. Some are interested in shopping or famous sights, while others want to try local food and see how people live in another country."],
  [/most children think education is boring/i, "School can feel boring when lessons rely heavily on memorising facts and children cannot see how the subject relates to real life. More discussion, experiments and practical examples can make the same material easier to engage with."],
  [/young people.*willing to listen.*experiences of older people/i, "Some young people assume that advice from older people belongs to a different time and may not fit their situation. They are more willing to listen when an older person shares a relevant story instead of simply telling them what to do."],
  [/qualities of being a good teacher/i, "A good teacher explains ideas clearly, notices when students are confused and treats mistakes as part of learning. Being patient matters as much as knowing the subject, because students learn at different speeds."],
  [/good teachers always popular among students/i, "No. A teacher can be effective without being everyone's favourite, especially if they set challenging but fair expectations. Students may appreciate that teacher more later, when they realise how much they learned."],
  [/important for a teacher to be popular/i, "It helps if students feel comfortable asking questions, but popularity should not be a teacher's main goal. Clear explanations, fairness and genuine interest in students are more important for learning."],
  [/what kinds of things do the elderly remember for a long time/i, "Older people often remember emotionally important events, such as a family milestone, a first job or a difficult period they overcame. Repeatedly sharing those stories with relatives can also make the memories easier to recall."],
  [/what sports are popular among older people/i, "Walking, tai chi and badminton are common choices because people can adjust the pace to their fitness level. Many older adults value regular movement and social contact more than intense competition."],
  [/what do old people usually do in their daily life/i, "Many older people spend time on household routines, hobbies and keeping in touch with family or neighbours. Their schedules vary, but having social contact and a sense of purpose can make retirement more satisfying."],
  [/do most people prefer shopping at big stores or small stores/i, "It depends on what they need. Big stores offer wider choice and can be cheaper, while small shops are convenient for everyday items and often give more personal service."],
  [/what makes a business successful/i, "A business needs to meet a real customer need, control its costs and deliver a reliable product or service. A strong idea helps, but listening to customers and adapting are what keep it competitive."],
  [/what makes a business fail/i, "A business may fail when it misjudges demand, spends too much before earning steady income or ignores customer feedback. Even a good product can struggle if people do not understand why they need it."],
  [/should students have physical education and do sports at school/i, "Yes. Physical education gives students regular exercise and teaches them to cooperate, handle both winning and losing and look after their health. Schools should offer different activities so students with varied abilities can take part."],
  [/what can people do to save time/i, "People can save time by grouping similar tasks, preparing what they need in advance and limiting distractions. A short plan for the day is often enough; scheduling every minute can become stressful."],
  [/does technology help people save time/i, "Yes, tools such as navigation apps and online booking can remove routine steps. They save the most time when people use them for a clear task, rather than checking notifications throughout the day."],
  [/why do people need friends/i, "Friends provide emotional support and give people someone to share ordinary experiences with. They can also offer an honest perspective when family members are too involved in a problem."],
  [/popular.*nowadays|easier to become popular/i, "It is easier to reach a large audience now because social media lets people share their work directly. Staying popular is less predictable, though, since online attention can shift very quickly."],
  [/do people read the newspaper where you live/i, "Fewer people read a printed newspaper every day because news is available on phones. Some still prefer print for a longer article or a quieter reading habit, while many use news apps for quick updates."],
  [/good teachers (?:are )?always popular among students/i, "No. A teacher can be effective without being everyone's favourite, especially if they set challenging but fair expectations. Students may appreciate that teacher more later, when they realise how much they learned."],
  [/differences between how young people and older people celebrate events/i, "Younger people may prefer a party with music and friends, while older relatives might value a family meal and familiar traditions. In many families, a celebration combines both, so everyone has a chance to enjoy it."],
  [/why do some young people feel bored when talking with old people/i, "They may have fewer shared interests or feel that the conversation is one-sided. It becomes more engaging when both generations ask questions and exchange experiences instead of one person only giving advice."],
  [/do older people prefer spending time with family or with friends/i, "It depends on the person and the occasion. Family may provide regular support, while friends share interests and independence; many older people value both kinds of company."],
  [/differences between young people.s leisure time activities and those of old people/i, "Young people often spend more free time on sport, social media or going out, while older adults may prefer walking, gardening or meeting friends nearby. These are broad tendencies, though, and personal interests matter more than age."],
  [/why is there a generation gap between the young and the old/i, "The gap often comes from growing up with different technology, social expectations and economic conditions. It can be reduced when people explain their experiences and stay curious about how life has changed."],
  [/has old people.s life quality improved when compared to the past/i, "In many ways, yes. Healthcare, transport and communication have improved, so older people can stay healthier and in touch with relatives. However, loneliness and access to good care are still concerns."],
  [/what can young and old people learn from each other/i, "Older people can share practical experience and explain how society has changed, while younger people may introduce new technology and ideas. Both sides benefit when the exchange is respectful rather than a lecture."],
  [/which group pays more attention to health, young people or old people/i, "Older people may pay closer attention because health problems become more noticeable with age. Younger people can be less concerned, although many now exercise and think carefully about food."],
  [/differences between the videos that young people and old people like to watch/i, "Younger viewers may watch more short clips and online creators, while older viewers may prefer news, dramas or longer programmes. There is plenty of overlap, so age alone does not predict someone's taste."],
  [/who tend to change their daily routine more, young people or old people/i, "Young people may change routines more often because they move between school, work and new social activities. Older adults can change too, especially after retirement or a change in health."],
  [/some people say large cities are suitable for old people/i, "Cities can suit older people because hospitals, shops and public transport are nearby. On the other hand, traffic, noise and stairs can be difficult, so accessible housing and safe pavements are important."],
  [/modern cities are suitable for young people or old people/i, "Modern cities offer young people more education and job choices, while older residents may value nearby healthcare and services. A city can work for both if transport and public spaces are accessible."],
  [/which is more suitable for young people, urban life or rural life/i, "Urban life often gives young people better access to education and jobs, while rural areas can be quieter and less expensive. For older people, the best choice depends on healthcare, family support and transport."],
  [/differences between the tv programs young people like to watch and those old people like to watch/i, "Young viewers may follow online series, reality shows or short videos, while older viewers may choose news and traditional dramas. These preferences are changing as streaming services become common across age groups."],
  [/do most elderly people live in the city or in the countryside/i, "More older people live in cities because services and healthcare are easier to reach, although many stay in smaller towns or villages near family. The pattern varies between regions."],
  [/how do young and old people use mobile phones differently/i, "Younger people often use phones for social media, games and study, while older people may rely more on calls, messages and practical services. As devices become easier to use, the gap is narrowing."],
  [/when would old people ask young people for advice/i, "They might ask for help with a new app, online services or a device they have not used before. Older people have plenty of experience too, so advice can go in both directions."],
  [/do you think only old people have time for leisure/i, "No. Older people may have more free time after retirement, but students and working adults also make time for leisure. It depends on someone's workload, family duties and personal priorities."],
  [/what sports matches are suitable for children to attend/i, "Matches with a family-friendly atmosphere and clear rules are usually suitable, such as local football or basketball games. Shorter events and safe seating help children stay interested and comfortable."],
  [/what group tasks are there in schools/i, "Students often do group presentations, science experiments and shared research projects. These tasks teach them to divide responsibilities, listen to different ideas and combine their work."],
  [/how can parents and teachers help children understand and follow rules/i, "They should explain why a rule exists, follow it themselves and apply it consistently. Children are more likely to cooperate when expectations are clear and consequences are fair."],
  [/are children unhappy with the school rules/i, "Some are, particularly when a rule feels unfair or its purpose is unclear. If teachers explain the reason and listen to students, children are more likely to accept it."],
  [/do people.s movie preferences change as they get older/i, "They can. People may enjoy action films when they are younger and later prefer stories that reflect family or work experiences, but personal taste does not always follow age."],
  [/should schools teach children about animals/i, "Yes. Children should learn how to behave safely around animals and understand that pets need long-term care. That can prevent harm to both animals and children."],
  [/prefer attending big parties or small gatherings with close friends/i, "I usually prefer a small gathering because it is easier to have a proper conversation. A large party can be exciting for a wedding or graduation, when many people are celebrating together."],
  [/which is more effective, online advertising or offline advertising/i, "Online adverts can reach specific groups and are easy to measure, while posters or shop displays can catch the attention of people nearby. The better choice depends on the product and audience."],
  [/situations do people spend a long time responding to others.s messages/i, "People may take longer when a message needs a thoughtful answer, when they are busy or when they want to avoid misunderstanding the tone. For an urgent matter, it is better to say when they can reply."],
  [/are there many tall buildings in your country/i, "Yes, especially in large cities such as Shanghai and Shenzhen. They are often offices or apartment blocks, while smaller towns tend to have more low-rise buildings."],
  [/should modern buildings replace traditional buildings/i, "Not completely. Modern buildings can provide safer and more efficient spaces, but historic ones give a city character. Renovating useful old buildings is often better than replacing every one."],
  [/is it important to protect historic buildings/i, "Yes, because they preserve local history and give residents a sense of identity. Protection should allow practical uses too, so buildings remain part of everyday life rather than empty monuments."],
  [/at what age do you think people should begin to learn history/i, "Primary school is a good time to begin, using stories, pictures and visits rather than detailed dates. As children get older, they can compare sources and understand more complex events."],
  [/is it easy to start up a company/i, "It is easier to register a small business than it used to be, but making it last is difficult. Owners need to understand customer demand, manage costs and handle competition."],
  [/does money equal success/i, "No. Money can show that a business is doing well, but success can also mean useful work, satisfied customers and fair treatment of staff. The right measure depends on the goal."],
  [/is advertising important for a company/i, "Yes, because advertising helps potential customers learn that a product exists. It cannot make up for poor quality, though, so a company also needs a reliable product and good service."],
  [/has technology changed people.s friendships/i, "Yes. Messaging and video calls make it easier to stay in touch across distance, while social media helps friends share everyday moments. It still takes time and attention to keep a friendship close."],
  [/online communication through social media will replace.*face.*face communication/i, "I do not think it will replace face-to-face communication completely. Messages are convenient for quick contact, but meeting in person makes it easier to read body language and have a deeper conversation."],
  [/what.s the difference between having younger friends and older friends/i, "Younger friends may share current interests and similar routines, while older friends can offer experience and a different perspective. A good friendship depends more on trust than on age."],
  [/can technology help people remember things better/i, "Yes. Calendars, reminders and photo libraries can help people keep track of appointments and memories. They are useful prompts, although people still need to decide what information is important."],
  [/how do you show your respect in your messages/i, "I use a polite greeting, keep the message clear and reply within a reasonable time. For a serious topic, I avoid jokes or abrupt wording that could be misunderstood."],
  [/do you think staying in a natural place would help change people.s mood/i, "Yes. A quiet natural setting can reduce noise and give people a break from screens and daily pressure. Even a short walk among trees can help someone feel calmer."],
  [/do you think most people.s decisions are made in their 20s/i, "Many important choices happen in people's twenties, such as what to study or where to work, but major decisions continue throughout life. People can change direction as their circumstances develop."],
  [/do you think it is a good idea to make a small decision every day/i, "Yes, as long as it does not become another source of pressure. Small choices can build useful habits, but people should leave room to change their plans when needed."],
  [/do you think doctors should be paid more/i, "Doctors have demanding training and make decisions that affect people's health, so competitive pay is reasonable. Pay should also reflect experience and working conditions, not just job title."],
  [/do you think teachers are able to spot the unhappy children/i, "Often, especially when they know their students well and notice changes in behaviour. However, a quiet child may hide how they feel, so teachers need to create a safe way to talk."],
  [/why do people prefer watching movies to reading books/i, "Movies are easier to fit into a short break and provide images, music and acting at once. Books take more time but often give a story more detail and room for imagination."],
  [/do you think people today read less than before/i, "Many people read fewer printed books because they spend more time on phones, but they still read messages, articles and posts every day. The format has changed more than reading itself."],
  [/should parents give children advice/i, "Yes, but they should listen first and explain their reasons. Advice is more useful when children can think through a choice themselves instead of being told exactly what to do."],
  [/are rivers and lakes good for transport/i, "They can be, especially for moving heavy goods where waterways are well connected. Boats are slower than road or rail transport, but they can reduce pressure on busy roads."],
  [/why do people smile more when they are younger or older/i, "Age alone probably does not decide how much someone smiles. Younger people may show excitement openly, while older adults may feel more comfortable and smile in familiar company."],
  [/do women smile more than men/i, "It is hard to generalise. Social expectations may encourage women to smile more in some situations, but personality, culture and the context of a conversation matter more."],
  [/should students learn to do group work/i, "Yes. Group work teaches students to explain their ideas, divide tasks and handle disagreement. It works best when each person has a clear responsibility and individual effort is recognised."],
  [/do you think people like things of memorial significance/i, "Many people keep meaningful objects because they connect them with a person or an important event. A photograph or a handwritten note can be valuable even if it has little financial worth."],
  [/what qualities make true friends/i, "Trust, honesty and being dependable matter most. A true friend can disagree with you respectfully and still offer support when you are having a difficult time."],
  [/is it important to have the same hobbies and interests when making friends/i, "It helps to have something to talk about, but identical hobbies are not necessary. Friends can stay close when they respect each other's interests and share similar values."],
  [/do you still keep in touch with your friends from childhood/i, "Yes, I still message one or two of them from time to time. We live in different places now, so we cannot meet often, but shared memories make it easy to reconnect."],
  [/should students learn ancient history before learning modern history/i, "Not necessarily. A broad introduction to both helps students see how earlier events influenced modern society. Teachers can then explore whichever period connects best with the topic being studied."],
  [/what can we learn from history/i, "History helps people understand how societies change and why some problems continue. It can also show how ordinary people responded to difficult events, not just what leaders decided."],
  [/what do people need to remember in their daily lives/i, "Most people need to remember appointments, tasks and important information from work or study. A calendar or short list is useful because it leaves more attention for the task itself."],
  [/which can help people remember things better, words or photos/i, "Photos are often better for remembering a particular place or moment because they provide a clear visual cue. Words can be more useful for ideas or instructions, so it depends on what someone wants to recall."],
  [/why do some people have a better memory than others/i, "People differ in attention, sleep and the ways they practise remembering information. Someone who connects a new fact to an existing idea may recall it more easily than someone who only repeats it."],
  [/is it important to protect historic buildings/i, "Yes, because they preserve local history and give residents a sense of identity. Protection should allow practical uses too, so buildings remain part of everyday life rather than empty monuments."],
  [/why is it hard to protect historic buildings/i, "Repairs can be expensive, and older buildings may not meet modern safety or access needs. It can be difficult to balance those costs with the value of keeping the original design."],
  [/what kind of advice should parents give to their children/i, "Parents should give advice about safety, responsibility and how to treat other people, while allowing children to make age-appropriate choices. The best advice explains the reason rather than simply giving an order."],
  [/do you think people today read less than before/i, "Many people read fewer printed books because phones compete for their attention, but they still read messages and online articles. Reading has shifted towards shorter digital formats."],
  [/why do women smile more than men/i, "In some situations, women may feel more pressure to appear friendly, but it would be unfair to treat that as a rule. Personality and social expectations both affect how people express themselves."],
  [/do you think a tourist city is also a good place to live/i, "It can be, because tourist cities often have good transport, restaurants and cultural events. However, high prices and crowds may make daily life less comfortable for local residents."],
  [/what should the government do to improve citizens. safety/i, "The government should maintain safe roads and public spaces, respond quickly to emergencies and make reliable safety information easy to access. Good lighting and careful urban planning can prevent some problems too."],
  [/what should we not talk about when we meet a person for the first time/i, "It is usually better to avoid very personal topics such as income, health problems or politics until people know each other. Starting with shared interests makes the conversation more comfortable."],
  [/what can we do to leave a good impression on people we meet for the first time/i, "We can listen carefully, be polite and ask a genuine question instead of talking only about ourselves. Being relaxed and respectful usually leaves a better impression than trying to show off."],
  [/how technology affects the law/i, "Technology helps governments store records, detect some forms of fraud and make public services easier to access. Laws also need to protect privacy and explain how digital evidence can be used."],
  [/are rivers and lakes good for transport/i, "They can move heavy goods efficiently where waterways connect towns and ports. Boats are slower than road or rail transport, but they can reduce congestion and fuel use on some routes."],
  [/is it a good idea to make a small decision every day/i, "Yes, if it helps someone build a useful habit without making life feel over-planned. Small decisions can be changed easily, so people can learn from what works."],
  [/do people buy things they don.t need/i, "Yes, sometimes, especially when adverts or discounts encourage impulse buying. Waiting a day and asking whether the item will be used can help people avoid unnecessary spending."],
  [/is saving money important/i, "Yes. Savings give people more security if an unexpected cost comes up and help them plan for larger goals. It is easier to save when the target is realistic."],
  [/do you think children should begin learning history from an early age/i, "Yes, if it is taught through stories, objects and visits rather than a long list of dates. An early introduction can help children become curious about how people lived."],
  [/is it important to learn how people in the past lived their lives/i, "Yes, because daily life helps explain why people made particular choices and how society changed. It also makes history feel connected to real people rather than just dates and leaders."],
  [/is it better to live in an apartment than in a house/i, "It depends on someone's needs. An apartment is often more convenient and easier to maintain, while a house offers more space and privacy. Location matters as much as the type of home."],
  [/should children not be allowed to make noise under any circumstances|is it good for children to make noise/i, "Children should be allowed to make some noise when they play, because it is a natural way to express themselves. They still need to be considerate in places such as libraries or late at night."],
  [/should people be very kind when they help others/i, "People should be kind and respectful, but practical help matters too. It is also important to ask what someone needs instead of assuming that every person wants the same kind of help."],
  [/is it good to arrive early in any situation/i, "Arriving early is useful for appointments, exams and travel because it leaves time for delays. For an informal visit, arriving exactly on time may be more considerate than being very early."],
  [/will you continue doing something when you are aware that it.s a waste of time/i, "Usually not. If an activity no longer helps me, I try to work out why I am continuing and choose a more useful task, while still allowing time to relax."],
  [/what kind of place do people in your country like to live in/i, "Many people prefer a convenient neighbourhood with reliable transport, nearby shops and some green space. Families may want more room, while younger adults often value being close to work or study."],
  [/how can people consider others. feelings when chatting in public/i, "They can keep their voices at a reasonable level, avoid sharing someone else's private information and notice whether others are trying to concentrate. Small adjustments make public spaces more comfortable."],
  [/can kids provide any help to parents/i, "Yes. Children can help with simple chores such as setting the table or putting away their things. It teaches responsibility, as long as the task is suitable for their age."],
  [/should parents help their kids with their homework/i, "Parents can help by providing a quiet place and explaining a difficult idea, but they should let children do the work themselves. That builds confidence and independent study habits."],
  [/should parents teach their children to spend money freely or to save money/i, "They should teach children to balance spending and saving. Letting a child manage a small amount of pocket money is a practical way to learn about choices and priorities."],
  [/can consumption drive economic growth/i, "It can, because spending supports shops, services and jobs. However, growth based only on buying more may create waste and debt, so investment and sustainable production matter too."],
  [/should people spend time on charity, or just money/i, "Both can help, and the better choice depends on someone's skills and circumstances. Donating time can provide direct support, while money lets organisations plan services and buy what they need."],
  [/what would you do if you did not receive a reply after sending out a message/i, "I would wait a reasonable amount of time, then send a brief follow-up or call if the matter were urgent. A delayed reply does not always mean the person is ignoring me."],
  [/in what situations do people spend a long time responding to others. messages/i, "People may take longer when a message needs a thoughtful answer, when they are busy or when they want to avoid misunderstanding the tone. For an urgent matter, it is better to say when they can reply."],
  [/in what situations do people not respond to messages at all/i, "They may be at work, miss the notification or feel unsure how to respond. Sometimes people avoid an uncomfortable conversation, so a clear and polite follow-up can help."],
  [/when do you think people are happiest/i, "People often feel happiest when they have supportive relationships, a sense of progress and enough time to rest. The balance differs from person to person and can change over a lifetime."],
  [/what would make a student happy at school/i, "Students are more likely to enjoy school when they feel safe, have supportive teachers and can take part in interesting activities. A friendly class also makes it easier to ask questions."],
  [/is it easy to set up a new business in your country/i, "Starting one can be straightforward on paper, but finding customers and managing costs are much harder. New owners also need to understand local rules and be prepared for slow early growth."],
  [/should students learn ancient history before learning modern history|should people learn ancient history before learning modern history/i, "I would introduce ancient and modern history together rather than treating them as completely separate subjects. Learning the background first can make current events easier to understand, but students also need to connect history to the present."],
  [/is it important for everyone to have a specialized skill/i, "A specialist skill can make someone valuable in a particular field, but people also need communication and problem-solving skills. The best mix depends on the job, and many roles require both depth and flexibility."],
  [/can a child learn skills from another child/i, "Yes. Children often learn practical skills by watching a classmate and then trying the same activity themselves. They may feel more comfortable asking a peer a simple question than interrupting a teacher."],
  [/is it easier for children to learn new skills than for adults/i, "Children may have more time to practise and feel less embarrassed about making mistakes. Adults can learn quickly too, especially when they understand why a skill is useful and practise regularly."],
  [/is it good to have a daily routine/i, "A routine can make daily life easier because people do not have to decide every small thing from scratch. It should still be flexible enough to allow rest and unexpected plans."],
  [/do you think stress is important in people.s lives/i, "A small amount of stress can motivate people to prepare for a challenge, but constant stress can harm sleep and concentration. People need ways to recover, not pressure all the time."],
  [/are there any solutions/i, "Teachers can make lessons more engaging by using practical examples, short discussions and activities where students apply an idea. They should also check whether the pace is too fast or too slow."],
  [/is it effective to offer rewards to find lost things/i, "A modest reward may encourage someone to return a valuable item, but clear reporting systems matter more. People are more likely to hand things in when they know where to take them."],
  [/do people like things of memorial significance/i, "Many people keep meaningful objects because they connect them with a person or an important event. A photograph or a handwritten note can be valuable even if it has little financial worth."],
  [/what can people do when they feel bored/i, "They can change activities, take a short walk or contact a friend. A simple activity that gives them a small goal is often more helpful than scrolling on a phone for a long time."],
  [/how can the arts spread positive emotions in society/i, "Music, theatre and public art can give people a shared experience and help them see familiar issues in a new way. Community events also bring neighbours together, which can improve the mood of a place."],
  [/what kinds of occasions need people to arrive early/i, "People should arrive early for flights, medical appointments and exams because missing them can cause real problems. For a casual meeting, being a few minutes early is usually enough."],
  [/what kind of people like getting up early/i, "People with early shifts, morning classes or regular exercise habits may prefer getting up early. Some also find the quiet hours useful for concentrating before the day becomes busy."],
  [/why do people get up early/i, "Some people get up early because work or school starts in the morning, while others like having quiet time to exercise or plan the day. A regular sleep schedule also helps."],
  [/what apps are popular in your country/i, "Messaging, short-video, shopping and payment apps are widely used in China. People value them because they combine everyday services in one place, although some try to limit screen time."],
  [/what apps are popular in your country.*why/i, "Messaging and payment apps are popular because they make daily tasks quick, from contacting friends to paying for a meal. Short-video apps are also common because the content is easy to watch in small breaks."],
  [/what makes a video go viral online/i, "A video often spreads when it is short, easy to understand and creates a strong reaction, such as surprise or laughter. Timing matters too, and people are more likely to share content they can relate to."],
  [/do chinese people like to visit others. homes/i, "Yes, many people visit relatives or close friends, especially during festivals and family celebrations. People often bring fruit or a small gift, which is a polite way to show appreciation."],
  [/what do chinese people do when they visit others/i, "They usually greet the host, bring a small gift and share tea or a meal. The visit is often a chance to catch up, rather than a formal occasion."],
  [/do you know anyone who likes to get up early/i, "Yes, one of my classmates gets up early to exercise before lectures. He says the quiet morning helps him feel organised and leaves the rest of the day less rushed."],
  [/what do people often feel after losing things/i, "People often feel anxious or frustrated, especially if the item is important or contains personal information. Once they have checked the likely places, reporting it quickly can help them feel more in control."],
  [/what should people wear to a job interview/i, "They should wear clean, neat clothes that suit the workplace. It does not have to be expensive; looking prepared and feeling comfortable are more important than following every fashion trend."],
  [/do young people prefer spending time with family or with friends/i, "Many young people spend more free time with friends because they share school, work or hobbies. Family is still important for support, and the balance often changes as people get older."],
  [/how important is childhood friendship to children/i, "Childhood friends help children practise sharing, cooperation and resolving small disagreements. Those friendships can also make school feel safer, although children may form new close friendships as they grow."],
  [/do you think people should learn ancient history before learning modern history/i, "I would introduce ancient and modern history together rather than treating them as completely separate subjects. Learning the background first can make current events easier to understand, but students also need to connect history to the present."],
  [/do you think it is easier for children to learn new skills than for adults/i, "Children may have more time to practise and feel less embarrassed about making mistakes. Adults can learn quickly too, especially when they understand why a skill is useful and practise regularly."],
  [/should children be taught to be kind to others/i, "Yes. Children can learn kindness by seeing adults treat people fairly and by practising small acts such as sharing or helping a classmate. It is more effective when adults explain why it matters."],
  [/should teachers know what children are doing all the time/i, "Teachers need to know whether students are safe and taking part, but they cannot monitor every moment. Children also need some independence to make choices and learn from small mistakes."],
  [/how do children learn history before they attend school/i, "Before school, children can learn history from family stories, picture books, museums and visits to old places. These concrete examples help them understand that the past involved real people."],
  [/when do most children begin to have their own opinions/i, "Children start expressing preferences quite early, but their opinions become more considered as they gain experience and learn to explain their reasons. Parents and teachers can encourage that development by listening."],
  [/whose opinions are more important to children, their parents. or teachers/i, "Parents often have more influence at home, while teachers shape how children think about learning and school. As children grow older, they also become more confident forming their own views."],
  [/what skills should children learn before they go to school/i, "It is useful for children to learn basic communication, self-care and how to share with others before school. They do not need formal academic skills as much as curiosity and confidence."],
  [/do children these days still like doing arts and crafts/i, "Many children still enjoy drawing, building models and making things by hand, especially when they can choose the project themselves. Digital activities are popular too, so a mix works well."],
  [/what is the most important thing for learning a language well/i, "Regular practice matters most. Learners need to hear and use the language often, make mistakes without feeling embarrassed and review useful phrases instead of only memorising word lists."],
  [/do you think children should be taught to be kind to others/i, "Yes. Schools can teach kindness through group tasks, fair classroom rules and discussions about how actions affect others. Students learn most when adults model the behaviour they expect."],
  [/what do people like to visit others. homes/i, "People often visit relatives and close friends for meals, festivals or a simple catch-up. Bringing a small gift and offering to help the host are common ways to show good manners."],
  [/are there many people who can speak foreign languages in your country/i, "Yes, especially in larger cities and among younger people, because English is taught at school and used in some jobs. Many people know basic phrases, though fewer speak fluently."],
  [/who do young people like to share opinions with/i, "They often share opinions with close friends because they have similar experiences and can speak freely. Some also talk with family members or teachers when they need advice."],
  [/do children communicate more with teachers or with parents/i, "Most children probably communicate more with their parents in daily life, while teachers mainly talk with them about school. Both relationships matter, but they serve different purposes."],
  [/what skills can people learn from watching videos/i, "Videos can teach practical skills such as cooking, repairing something or using software. They are useful for demonstrations, but viewers still need practice and should check that the advice is reliable."],
  [/besides big historical events, what else is important when learning history/i, "Everyday life, local customs and personal stories are important too. They show how historical changes affected ordinary people, not only governments or famous leaders."],
  [/do you think learning biology is interesting for children/i, "It can be interesting when children observe plants, animals or how their bodies work. Simple experiments and outdoor activities make biology easier to connect with everyday life."],
  [/do you think art classes are important for children/i, "Yes. Art gives children a way to express ideas and practise patience, even if they do not become artists. It also balances academic subjects with hands-on work."],
];

function partThreeAnswer(topic, question, index) {
  const subject = `${topic.prompt || ""} ${topic.title}`;
  let q = question.toLowerCase().trim();
  if (/^(why|why or why not|how|are there any solutions)[?？]?$/i.test(q) && index > 0) q = `${topic.questions[index - 1]} ${q}`.toLowerCase();
  const specificAnswer = specificPartThreeAnswers.find(([pattern]) => pattern.test(q))?.[1];
  if (specificAnswer) return specificAnswer;
  const relationshipProfile = discussionProfiles.find(([pattern]) => /friend|family|relationship/.test(pattern.source))?.[1];
  const socialQuestion = /friendship|\bfriends?\b|\bfamily\b|\brelationships?\b/i.test(q);
  const profile = (socialQuestion ? relationshipProfile : null)
    || discussionProfiles.find(([pattern]) => pattern.test(q))?.[1]
    || discussionProfiles.find(([pattern]) => pattern.test(subject))?.[1]
    || discussionProfiles[discussionProfiles.length - 1][1];

  if (/advantages|benefits|what is useful|what good/.test(q)) return profile.benefit;
  if (/disadvantages|drawbacks|problems|difficult|negative effects/.test(q)) return profile.contrast;
  if (/difference|which is better|which .*prefer|more .* than|less .* than|rather than/.test(q)) return profile.contrast;
  if (/^why|what makes .* popular|why do|why are|why is/.test(q)) return profile.cause;
  if (/^how|what can|what should|what do .* need|how can|what kinds|what kind|^who|^when|^where|at what|which group|what qualities/.test(q)) return profile.action;
  if (/^should|^do you think|^is it|^is there|^are there|^will |^would |^can |^could |^does |^do people|^is .* important|^are .* likely/.test(q)) return profile.view;
  return profile.example;
}

function topicStatus(topic) {
  if (topic.status === "New") return '<span class="tag tag-new">新题</span>';
  if (topic.status === "Retained") return '<span class="tag">保留题</span>';
  return '<span class="tag">历史题</span>';
}

function sourceDescription(topic) {
  const unique = [...new Map(topic.sources.map((source) => [`${source.period}-${source.page}`, source])).values()];
  return unique.map((source) => `${source.period.replace("2026-", "")} 月题库 · p.${source.page}`).join("；");
}

function matchingTopics() {
  const search = elements.search.value.trim().toLowerCase();
  return state.topics.filter((topic) => {
    if (state.part !== "all" && String(topic.part) !== state.part) return false;
    if (state.period === "current" && !topic.latest) return false;
    if (state.period === "archive" && topic.latest) return false;
    if (state.region !== "all" && topic.region !== state.region) return false;
    if (state.savedOnly && !state.saved.has(topic.id)) return false;
    if (search) {
      const haystack = [topic.title, topic.prompt, ...topic.cues, ...topic.questions].join(" ").toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

function renderList() {
  const topics = matchingTopics();
  elements.resultCount.textContent = topics.length;
  elements.savedCount.textContent = state.saved.size;
  elements.savedFilter.setAttribute("aria-pressed", String(state.savedOnly));
  if (!topics.some((topic) => topic.id === state.selectedId)) state.selectedId = topics[0]?.id || null;
  elements.list.innerHTML = topics.map((topic, index) => `
    <button class="topic-button" type="button" data-topic="${escapeHtml(topic.id)}" aria-current="${topic.id === state.selectedId}">
      <span class="topic-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="topic-name">${escapeHtml(topic.title)}</span>
      <span class="topic-meta">${topic.status === "New" ? '<i class="mini-new"></i>' : ""}${topic.questionCount}</span>
    </button>`).join("") || '<div class="empty-state">没有匹配的题目</div>';
  elements.list.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => selectTopic(button.dataset.topic));
  });
  renderTopic();
}

function renderTopic() {
  const topic = state.topics.find((item) => item.id === state.selectedId);
  if (!topic) {
    elements.study.innerHTML = '<div class="empty-state">调整筛选条件以查看题目。</div>';
    return;
  }
  const isSaved = state.saved.has(topic.id);
  const source = sourceDescription(topic);
  const practiceTime = topic.part === 1 ? 60 : 120;
  const p1List = topic.part === 1 ? `
    <div class="section-heading"><h2>Part 1 questions</h2><span>${topic.questions.length} 道小问</span></div>
    <div class="question-list">${topic.questions.map((question, index) => `
      <article class="question-item">
        <div class="question-head"><span class="question-number">${String(index + 1).padStart(2, "0")}</span><p class="question-text">${escapeHtml(question)}</p></div>
        <details class="question-details" ${index === 0 ? "open" : ""}>
          <summary>参考答案</summary>
          <div class="question-answer"><p>${escapeHtml(partOneAnswer(topic, question, index))}</p></div>
        </details>
      </article>`).join("")}</div>` : "";
  const p2Block = topic.part === 2 ? `
    <div class="section-heading"><h2>Part 2 cue card</h2><span>建议准备 1–2 分钟</span></div>
    <div class="cue-card"><p class="cue-prompt">${escapeHtml(topic.prompt)}</p><ul>${topic.cues.map((cue) => `<li>${escapeHtml(cue)}</li>`).join("")}</ul></div>
    <article class="answer-block">
      <div class="answer-top"><span class="answer-label">参考答案 · 6.5–7 练习难度</span><div class="answer-tools"><span class="word-count">约 ${partTwoAnswer(topic).trim().split(/\s+/).length} 词</span><button class="text-action" type="button" data-copy="part2-answer">复制</button><button class="text-action" type="button" data-speak="part2-answer">朗读</button></div></div>
      <p class="answer-text" id="part2-answer">${escapeHtml(partTwoAnswer(topic))}</p>
      <p class="answer-advice">答案以大四数学系学生为示范人设；请按自己的真实经历替换人物、地点和细节。示范文本不对应固定分数，现场表现还取决于连贯度、词汇、语法与发音。</p>
    </article>
    <div class="section-heading"><h2>Part 3 discussion</h2><span>${topic.questions.length} 道延伸题</span></div>
    <div class="question-list">${topic.questions.map((question, index) => `
      <article class="question-item">
        <div class="question-head"><span class="question-number">${String(index + 1).padStart(2, "0")}</span><p class="question-text">${escapeHtml(question)}</p></div>
        <details class="question-details"><summary>参考答案</summary><div class="question-answer"><p>${escapeHtml(partThreeAnswer(topic, question, index))}</p></div></details>
      </article>`).join("")}</div>` : "";
  const part2Prompt = topic.part === 2 ? `<p class="topic-prompt">${escapeHtml(topic.prompt)}</p>` : "";
  const countLabel = topic.part === 1 ? `${topic.questions.length} 道小问` : `${topic.cues.length} 个提示 · ${topic.questions.length} 道追问`;
  elements.study.innerHTML = `
    <header class="topic-header">
      <div>
        <div class="topic-kickers"><span class="tag tag-part">Part ${topic.part === 1 ? "1" : "2 & 3"}</span>${topicStatus(topic)}<span class="tag">${topic.region === "Mainland" ? "大陆地区" : "非大陆地区"}</span></div>
        <h2 class="topic-title">${escapeHtml(topic.title)}</h2>${part2Prompt}
      </div>
      <div class="topic-actions">
        <button class="icon-button" id="save-topic" type="button" aria-label="${isSaved ? "取消收藏" : "收藏话题"}" title="${isSaved ? "取消收藏" : "收藏话题"}" aria-pressed="${isSaved}">${isSaved ? "★" : "☆"}</button>
        <button class="icon-button" id="speak-prompt" type="button" aria-label="朗读题目" title="朗读题目">◖</button>
      </div>
    </header>
    ${topic.part === 2 ? p2Block : p1List}
    <section class="practice-area">
      <div class="practice-head"><h2>限时练习</h2><div class="timer-tools"><span class="timer-display" id="timer-display">${formatTime(practiceTime)}</span><button class="small-button primary" id="timer-toggle" type="button">开始</button><button class="small-button" id="timer-reset" type="button">重置</button><span class="word-count">${practiceTime === 60 ? "Part 1 · 60 秒" : "Part 2 · 120 秒"}</span></div></div>
      <textarea class="practice-textarea" id="practice-notes" placeholder="记录自己的表达思路…" aria-label="练习笔记">${escapeHtml(localStorage.getItem(`ielts-note-${topic.id}`) || "")}</textarea>
    </section>
    <p class="source-line"><strong>题库来源</strong>　${escapeHtml(source)}<br>参考答案为练习范例；实际分数还取决于现场流利度、语法、词汇和发音表现。</p>`;
  bindTopicActions(topic, practiceTime);
}

function selectTopic(id) {
  state.selectedId = id;
  renderList();
}

function bindTopicActions(topic, practiceTime) {
  document.querySelector("#save-topic").addEventListener("click", () => {
    if (state.saved.has(topic.id)) state.saved.delete(topic.id);
    else state.saved.add(topic.id);
    localStorage.setItem("ielts-saved", JSON.stringify([...state.saved]));
    renderList();
  });
  document.querySelector("#speak-prompt").addEventListener("click", () => speak(topic.part === 1 ? topic.questions.join(". ") : topic.prompt));
  document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
    const text = document.querySelector(`#${button.dataset.copy}`)?.textContent || "";
    try { await navigator.clipboard.writeText(text); button.textContent = "已复制"; setTimeout(() => { button.textContent = "复制"; }, 1200); }
    catch { button.textContent = "复制失败"; setTimeout(() => { button.textContent = "复制"; }, 1200); }
  }));
  document.querySelectorAll("[data-speak]").forEach((button) => button.addEventListener("click", () => speak(document.querySelector(`#${button.dataset.speak}`)?.textContent || "")));
  const notes = document.querySelector("#practice-notes");
  notes.addEventListener("input", () => localStorage.setItem(`ielts-note-${topic.id}`, notes.value));
  state.timerSeconds = practiceTime;
  state.timerRunning = false;
  clearInterval(state.timerHandle);
  const display = document.querySelector("#timer-display");
  const toggle = document.querySelector("#timer-toggle");
  toggle.addEventListener("click", () => {
    if (state.timerRunning) {
      clearInterval(state.timerHandle);
      state.timerRunning = false;
      toggle.textContent = "继续";
      return;
    }
    if (state.timerSeconds <= 0) state.timerSeconds = practiceTime;
    state.timerRunning = true;
    toggle.textContent = "暂停";
    state.timerHandle = setInterval(() => {
      state.timerSeconds -= 1;
      display.textContent = formatTime(state.timerSeconds);
      if (state.timerSeconds <= 0) {
        clearInterval(state.timerHandle);
        state.timerRunning = false;
        toggle.textContent = "再练一次";
      }
    }, 1000);
  });
  document.querySelector("#timer-reset").addEventListener("click", () => {
    clearInterval(state.timerHandle);
    state.timerRunning = false;
    state.timerSeconds = practiceTime;
    display.textContent = formatTime(practiceTime);
    toggle.textContent = "开始";
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

function updateMetrics() {
  const mainland = state.topics.filter((topic) => topic.region === "Mainland");
  document.querySelector("#metric-topics").textContent = mainland.length;
  document.querySelector("#metric-p1").textContent = mainland.filter((topic) => topic.part === 1).reduce((sum, topic) => sum + topic.questions.length, 0);
  document.querySelector("#metric-p3").textContent = mainland.filter((topic) => topic.part === 2).reduce((sum, topic) => sum + topic.questions.length, 0);
}

elements.search.addEventListener("input", renderList);
elements.part.addEventListener("change", () => { state.part = elements.part.value; renderList(); });
elements.period.addEventListener("change", () => { state.period = elements.period.value; renderList(); });
elements.region.addEventListener("change", () => { state.region = elements.region.value; renderList(); });
elements.savedFilter.addEventListener("click", () => { state.savedOnly = !state.savedOnly; renderList(); });
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    elements.search.focus();
  }
});

fetch("data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Unable to load the question bank");
    return response.json();
  })
  .then((topics) => {
    state.topics = topics;
    state.selectedId = topics.find((topic) => topic.region === "Mainland" && topic.latest)?.id || topics[0]?.id || null;
    updateMetrics();
    renderList();
  })
  .catch(() => {
    elements.study.innerHTML = '<div class="empty-state">题库载入失败，请通过本地服务器打开此页面。</div>';
  });
