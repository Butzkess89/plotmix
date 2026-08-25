import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useId } from "react";
import lottie from "lottie-web";

// 
// MASTER DECK
// Fields: id, mashedPlot, movies[], aliases[][], hints[], difficulty,
//         difficultyReason, connection (intermission note)
// 
const MASTER_DECK = [
  {
    id: 1,
    mashedTitle: "12 Angry White Men Can't Jump",
    mashedPlot: "A jury composed entirely of white men are tasked with deciding the fate of a young black man accused of being a street basketball hustler. One juror, a former basketball hustler himself, gradually convinces the others to question their biases and reconsider the evidence.",
    movies: ["12 Angry Men", "White Men Can't Jump"],
    aliases: [["12 angry men", "twelve angry men"], ["white men can't jump", "white men cant jump"]],
    hints: ["One film is set entirely in a jury room; the other on outdoor basketball courts in LA.", "Both films are about white men confronting racial assumptions \u2014 one in the justice system, one in street sport.", "Think: Henry Fonda meets Woody Harrelson and Wesley Snipes."],
    difficulty: "Medium",
    difficultyReason: "The source films are well-known but the thematic link requires lateral thinking",
    connection: "12 Angry Men and White Men Can't Jump are both films about white men forced to confront the limits of their assumptions about race \u2014 one in the gravest possible setting, the other in the most casual.",
    hintData: {"films": [{"year": 1957, "genre": "Drama/Courtroom", "actors": ["Henry Fonda", "Lee J. Cobb"]}, {"year": 1992, "genre": "Sports Comedy", "actors": ["Woody Harrelson", "Wesley Snipes"]}]},
  },
  {
    id: 2,
    mashedTitle: "13 Going on 30 Days of Night",
    mashedPlot: "Unpopular schoolgirl Jenna makes an unusual wish on her birthday. Miraculously, her wish comes true and her Alaskan town is plunged into darkness for a month, the 13-year-old Jenna wakes up as a 30-year-old woman and fights a bloodthirsty gang of vampires.",
    movies: ["13 Going on 30", "30 Days of Night"],
    aliases: [["13 going on 30", "thirteen going on thirty"], ["30 days of night", "thirty days of night"]],
    hints: ["One film is a romantic comedy about a girl who skips adolescence; the other a horror film about vampires exploiting polar darkness.", "The number 30 is the hinge connecting these two very different films.", "Think: Jennifer Garner meets Josh Hartnett \u2014 and a lot of blood."],
    difficulty: "Easy",
    difficultyReason: "The title wordplay is immediately obvious once you see the two films",
    connection: "13 Going on 30 and 30 Days of Night share only a number \u2014 but that number is everything. One 30 is a dream; the other is a nightmare.",
    hintData: {"films": [{"year": 2004, "genre": "Romantic Comedy", "actors": ["Jennifer Garner", "Mark Ruffalo"]}, {"year": 2007, "genre": "Horror", "actors": ["Josh Hartnett", "Melissa George"]}]},
  },
  {
    id: 3,
    mashedTitle: "2001: A Space Jam Odyssey",
    mashedPlot: "When a mysterious artifact is uncovered on the Moon, a spacecraft manned by the Looney Tunes and one supercomputer is sent to Jupiter to seek the aid of a retired basketball champion.",
    movies: ["2001: A Space Odyssey", "Space Jam"],
    aliases: [["2001", "2001 a space odyssey", "space odyssey", "kubrick"], ["space jam", "spacejam"]],
    hints: ["One is Kubrick's meditation on human evolution; the other is Bugs Bunny playing basketball with Michael Jordan.", "Both feature a journey through space \u2014 one existential, one absolutely not.", "HAL 9000 meets Daffy Duck."],
    difficulty: "Easy",
    difficultyReason: "Both films are iconic and the wordplay is crystal clear",
    connection: "2001: A Space Odyssey and Space Jam are perhaps the most tonally opposite films ever mashed. One asks what it means to be human. The other asks what it means to dunk.",
    hintData: {"films": [{"year": 1968, "genre": "Sci-Fi", "actors": ["Keir Dullea", "Gary Lockwood"]}, {"year": 1996, "genre": "Sports Comedy", "actors": ["Michael Jordan", "Bill Murray"]}]},
  },
  {
    id: 4,
    mashedTitle: "A Bug's Life of Brian",
    mashedPlot: "A misfit ant, looking for \"warriors\" to save his colony from greedy grasshoppers, ends up spending the rest of his life being mistaken for the messiah.",
    movies: ["A Bug's Life", "Monty Python's Life of Brian"],
    aliases: [["a bugs life", "bugs life"], ["life of brian", "monty python life of brian", "monty python's life of brian"]],
    hints: ["One is a Pixar film about an ant colony; the other a Monty Python biblical satire.", "Both heroes are reluctant saviours who never asked to lead anyone.", "Think: Flik meets Brian of Nazareth."],
    difficulty: "Medium",
    difficultyReason: "Life of Brian is beloved but generationally specific",
    connection: "A Bug's Life and Life of Brian are both about ordinary individuals accidentally elevated to messianic status by communities desperate for a hero. Neither protagonist wants the job.",
    hintData: {"films": [{"year": 1998, "genre": "Animated Adventure", "actors": ["Dave Foley", "Kevin Spacey"]}, {"year": 1979, "genre": "Comedy", "actors": ["Graham Chapman", "John Cleese"]}]},
  },
  {
    id: 5,
    mashedTitle: "A Clockwork Orange County",
    mashedPlot: "A violent high school student named Alex and his hooligan gang barbarize Stanford University in a near-future society. After a guidance counselor mistakenly sends out the wrong transcripts, Alex is arrested for his crimes and undergoes an experimental psychological conditioning treatment meant to eliminate his violent impulses.",
    movies: ["A Clockwork Orange", "Orange County"],
    aliases: [["a clockwork orange", "clockwork orange"], ["orange county"]],
    hints: ["One is Kubrick's dystopian masterpiece; the other is a 2002 teen comedy about college applications.", "Both share a colour in the title and a protagonist who clashes with institutions.", "Think: Alex DeLarge meets Shaun Brumder."],
    difficulty: "Hard",
    difficultyReason: "Orange County is obscure enough that many players won't place it immediately",
    connection: "A Clockwork Orange and Orange County are separated by 30 years and every conceivable tonal register, but both are about young men defined by their environment who want desperately to escape it.",
    hintData: {"films": [{"year": 1971, "genre": "Psychological Drama", "actors": ["Malcolm McDowell", "Patrick Magee"]}, {"year": 2002, "genre": "Teen Comedy", "actors": ["Colin Hanks", "Jack Black"]}]},
  },
  {
    id: 6,
    mashedTitle: "A Few Good Will Hunting",
    mashedPlot: "A military lawyer intends to prove that a brilliant but troubled young janitor, charged with murdering a fellow Marine, was only following his base commander's orders. A compassionate therapist helps him realize that his past trauma is not his fault.",
    movies: ["A Few Good Men", "Good Will Hunting"],
    aliases: [["a few good men", "few good men"], ["good will hunting", "will hunting"]],
    hints: ["One is a courtroom drama; the other a story of emotional healing through therapy.", "'You can't handle the truth' meets 'It's not your fault.'", "Think: Tom Cruise and Jack Nicholson meet Matt Damon and Robin Williams."],
    difficulty: "Easy",
    difficultyReason: "Both are beloved 90s films and the wordplay is elegant",
    connection: "A Few Good Men and Good Will Hunting are both films about authority, truth, and the courage to challenge power \u2014 one in a courtroom, one in a therapist's office.",
    hintData: {"films": [{"year": 1992, "genre": "Drama/Courtroom", "actors": ["Tom Cruise", "Jack Nicholson"]}, {"year": 1997, "genre": "Drama", "actors": ["Matt Damon", "Robin Williams"]}]},
  },
  {
    id: 7,
    mashedTitle: "American Beauty and the Beast",
    mashedPlot: "A sexually frustrated suburban father is cursed to spend his days as a hideous monster. While experiencing a midlife crisis, he sets out to regain his humanity by earning the love of his teenage daughter's best friend.",
    movies: ["American Beauty", "Beauty and the Beast"],
    aliases: [["american beauty"], ["beauty and the beast", "beauty & the beast"]],
    hints: ["One is a dark Academy Award-winning drama about suburban despair; the other a beloved Disney fairy tale.", "Both feature a protagonist desperate to be loved despite being monstrous.", "The rose is a symbol in both \u2014 for very different reasons."],
    difficulty: "Easy",
    difficultyReason: "The title mash is one of the most elegant in the deck",
    connection: "American Beauty and Beauty and the Beast are both about men who are emotionally trapped and convince themselves that a young woman is the answer. One is a fairy tale. The other is a tragedy.",
    hintData: {"films": [{"year": 1999, "genre": "Drama", "actors": ["Kevin Spacey", "Annette Bening"]}, {"year": 1991, "genre": "Animated Romance", "actors": ["Paige O'Hara", "Robby Benson"]}]},
  },
  {
    id: 8,
    mashedTitle: "Apocalypse Now You See Me",
    mashedPlot: "During the Vietnam War, a U.S. Army officer is sent on a secret mission deep into Cambodia to assassinate a group of illusionists known as the Four Horsemen, who use elaborate stage magic to pull off seemingly impossible bank robberies during their performances and redistribute the stolen money to the local tribes.",
    movies: ["Apocalypse Now", "Now You See Me"],
    aliases: [["apocalypse now"], ["now you see me", "now you see me 1"]],
    hints: ["One is Francis Ford Coppola's Vietnam epic; the other a heist thriller built around stage magicians.", "Both films hinge on a journey into darkness to confront a charismatic, messianic figure.", "'The horror, the horror' meets a rabbit out of a hat."],
    difficulty: "Hard",
    difficultyReason: "Connecting a war epic to a magic heist thriller requires creative leaping",
    connection: "Apocalypse Now and Now You See Me share the word Now and a structural obsession: both follow a protagonist tasked with hunting down a theatrical, larger-than-life figure who has gone off-script.",
    hintData: {"films": [{"year": 1979, "genre": "War Epic", "actors": ["Martin Sheen", "Marlon Brando"]}, {"year": 2013, "genre": "Magic Heist", "actors": ["Jesse Eisenberg", "Isla Fisher"]}]},
  },
  {
    id: 9,
    mashedTitle: "Before Sunset Boulevard",
    mashedPlot: "A struggling screenwriter and a faded silent-film star reunite in Paris nine years after their brief, romantic encounter in Vienna. Over the course of an afternoon, they walk through the city, talking about her ill-fated comeback script.",
    movies: ["Before Sunset", "Sunset Boulevard"],
    aliases: [["before sunset"], ["sunset boulevard"]],
    hints: ["Both films are about people clinging to a past they can't recapture.", "One is a romantic walk through Paris; the other a gothic Hollywood tragedy.", "Think: Ethan Hawke and Julie Delpy meet Gloria Swanson and William Holden."],
    difficulty: "Hard",
    difficultyReason: "Sunset Boulevard is a classic but generationally less familiar",
    connection: "Before Sunset and Sunset Boulevard are both films saturated with longing for something that has already passed. One is tender and hopeful. The other is delusional and doomed.",
    hintData: {"films": [{"year": 1950, "genre": "Noir Drama", "actors": ["William Holden", "Gloria Swanson"]}, {"year": 2004, "genre": "Romantic Drama", "actors": ["Ethan Hawke", "Julie Delpy"]}]},
  },
  {
    id: 10,
    mashedTitle: "Being John Wick",
    mashedPlot: "A puppeteer discovers a portal that leads literally into the head of a former hitman who is pulled back into the criminal underworld he left behind after a group of gangsters steal his car and kill the puppy left to him by his late wife.",
    movies: ["Being John Malkovich", "John Wick"],
    aliases: [["being john malkovich", "john malkovich"], ["john wick", "wick"]],
    hints: ["One is Charlie Kaufman's surrealist comedy about identity; the other a hyper-violent action thriller.", "Both center on inhabiting or understanding a singular, iconic man named John.", "A portal in a filing cabinet meets a dead puppy."],
    difficulty: "Medium",
    difficultyReason: "Being John Malkovich is well-known but the connection takes a beat",
    connection: "Being John Malkovich and John Wick are both films about obsession with one extraordinary man named John \u2014 one explored through metaphysical comedy, one through a body count.",
    hintData: {"films": [{"year": 1999, "genre": "Surreal Comedy", "actors": ["John Cusack", "Cameron Diaz"]}, {"year": 2014, "genre": "Action Thriller", "actors": ["Keanu Reeves", "Michael Nyqvist"]}]},
  },
  {
    id: 11,
    mashedTitle: "Brokeback to the Future",
    mashedPlot: "Two shepherds form a secret romantic and sexual relationship while working together on a remote mountain in 1963. Their relationship becomes complicated when they accidentally travel back 30 years in time and must ensure their own parents fall in love in order to preserve their existence.",
    movies: ["Brokeback Mountain", "Back to the Future"],
    aliases: [["brokeback mountain", "brokeback"], ["back to the future", "bttf", "back to the future 1"]],
    hints: ["One is Ang Lee's celebrated romantic drama; the other Spielberg's time-travel comedy.", "Both are set partly in the American past and deal with love that is complicated by time.", "Think: Jake Gyllenhaal and Heath Ledger meet Michael J. Fox."],
    difficulty: "Easy",
    difficultyReason: "One of the most famous title mashes \u2014 widely circulated as a joke",
    connection: "Brokeback Mountain and Back to the Future are both American films about men trapped by time \u2014 one by the era they live in, the other by literal time travel. Both ask: what do you do when the world won't let you be who you are?",
    hintData: {"films": [{"year": 2005, "genre": "Romantic Drama", "actors": ["Heath Ledger", "Jake Gyllenhaal"]}, {"year": 1985, "genre": "Sci-Fi Comedy", "actors": ["Michael J. Fox", "Christopher Lloyd"]}]},
  },
  {
    id: 12,
    mashedTitle: "Captain Fantastic Mr Fox",
    mashedPlot: "A devoted father raising his children off the grid is forced to reenter society after stealing from nearby farmers. Now he must outsmart three determined farmers bent on destroying him and his community.",
    movies: ["Captain Fantastic", "Fantastic Mr. Fox"],
    aliases: [["captain fantastic"], ["fantastic mr fox", "fantastic mr. fox", "wes anderson fox"]],
    hints: ["Both films are about unconventional fathers who raise children outside mainstream society.", "One is a live-action drama starring Viggo Mortensen; the other a Wes Anderson stop-motion film.", "Both fathers ultimately put their families at risk through their own idealism."],
    difficulty: "Medium",
    difficultyReason: "Captain Fantastic is less widely seen than Fantastic Mr. Fox",
    connection: "Captain Fantastic and Fantastic Mr. Fox are twin portraits of charismatic, intellectually arrogant fathers who love their children deeply and endanger them through pride. One is animated. Both are painfully human.",
    hintData: {"films": [{"year": 2016, "genre": "Drama", "actors": ["Viggo Mortensen", "George MacKay"]}, {"year": 2009, "genre": "Animated Comedy", "actors": ["George Clooney", "Meryl Streep"]}]},
  },
  {
    id: 13,
    mashedTitle: "Charlie's Angels and the Chocolate Factory",
    mashedPlot: "A wealthy mystery man runs a detective agency via a speakerphone. His detectives are three beautiful women who end up winning a tour of an amazing candy factory run by an imaginative chocolatier.",
    movies: ["Charlie's Angels", "Charlie and the Chocolate Factory"],
    aliases: [["charlie's angels", "charlies angels"], ["charlie and the chocolate factory", "willy wonka", "willy wonka and the chocolate factory"]],
    hints: ["Both Charlies run mysterious operations that very few people are allowed inside.", "One Charlie is a disembodied voice; the other wears a purple top hat.", "Think: Drew Barrymore, Cameron Diaz, and Lucy Liu meet Johnny Depp."],
    difficulty: "Easy",
    difficultyReason: "The shared name Charlie makes the connection immediately satisfying",
    connection: "Charlie's Angels and Charlie and the Chocolate Factory share their benefactor's name \u2014 and both Charlies maintain elaborate, secretive worlds that outsiders desperately want access to.",
    hintData: {"films": [{"year": 2000, "genre": "Action Comedy", "actors": ["Drew Barrymore", "Lucy Liu"]}, {"year": 2005, "genre": "Family Fantasy", "actors": ["Johnny Depp", "Freddie Highmore"]}]},
  },
  {
    id: 14,
    mashedTitle: "City of Godfather",
    mashedPlot: "In the slums of Rio, two kids' paths diverge as one struggles to become a photographer and the other becomes an aging patriarch of an organized crime dynasty, transferring control of his empire to his reluctant son.",
    movies: ["City of God", "The Godfather"],
    aliases: [["city of god"], ["the godfather", "godfather", "godfather 1"]],
    hints: ["One is a Brazilian crime epic shot in the favelas of Rio; the other the definitive American mob saga.", "Both films trace the rise and cost of criminal power across generations.", "Think: Fernando Meirelles meets Francis Ford Coppola."],
    difficulty: "Medium",
    difficultyReason: "City of God is well-regarded but less universally seen than The Godfather",
    connection: "City of God and The Godfather are both generational crime sagas asking the same question: what does power cost the person who holds it, and the people around them?",
    hintData: {"films": [{"year": 2002, "genre": "Crime Drama", "actors": ["Alexandre Rodrigues", "Leandro Firmino"]}, {"year": 1972, "genre": "Crime Drama", "actors": ["Marlon Brando", "Al Pacino"]}]},
  },
  {
    id: 15,
    mashedTitle: "Crouching Tiger, Hidden Figures",
    mashedPlot: "A young Chinese warrior steals a sword from a famed swordsman and escapes into a world of romantic adventure with three female African-American mathematicians who work at NASA during the early years of the U.S. space program.",
    movies: ["Crouching Tiger, Hidden Dragon", "Hidden Figures"],
    aliases: [["crouching tiger hidden dragon", "crouching tiger"], ["hidden figures"]],
    hints: ["One is a wuxia epic set in ancient China; the other a true story set at NASA in the 1960s.", "Both films are about brilliant women breaking through worlds designed to exclude them.", "The word 'Hidden' is the hinge."],
    difficulty: "Medium",
    difficultyReason: "The shared word 'Hidden' is the elegant connector",
    connection: "Crouching Tiger, Hidden Dragon and Hidden Figures are both films about women who have to fight \u2014 literally or institutionally \u2014 to be allowed to excel in worlds dominated by men.",
    hintData: {"films": [{"year": 2000, "genre": "Martial Arts Fantasy", "actors": ["Chow Yun-fat", "Michelle Yeoh"]}, {"year": 2016, "genre": "Historical Drama", "actors": ["Taraji P. Henson", "Octavia Spencer"]}]},
  },
  {
    id: 16,
    mashedTitle: "Dirty Harry Met Sally",
    mashedPlot: "Inspector Harry, a tough San Francisco cop hunting a sadistic sniper known as Scorpio, repeatedly crosses paths with Sally, a New York journalist who begins to soften his cynical view of relationships.",
    movies: ["Dirty Harry", "When Harry Met Sally"],
    aliases: [["dirty harry"], ["when harry met sally", "harry met sally"]],
    hints: ["One Harry carries a .44 Magnum; the other debates whether men and women can be friends.", "Both films are classics of their genre \u2014 one action, one romantic comedy \u2014 that defined the careers of their stars.", "Think: Clint Eastwood meets Billy Crystal and Meg Ryan."],
    difficulty: "Easy",
    difficultyReason: "Both Harrys are iconic and the mash is immediately funny",
    connection: "Dirty Harry and When Harry Met Sally are both films about a man named Harry who has a deeply cynical worldview that gets punctured \u2014 one by a quirky journalist, one by a .44 Magnum.",
    hintData: {"films": [{"year": 1971, "genre": "Action Thriller", "actors": ["Clint Eastwood", "Harry Guardino"]}, {"year": 1989, "genre": "Romantic Comedy", "actors": ["Billy Crystal", "Meg Ryan"]}]},
  },
  {
    id: 17,
    mashedTitle: "Edge of Tomorrow Never Dies",
    mashedPlot: "A man fighting in a war against aliens must relive the same day every time he dies, until he can find a way to stop a media mogul's plot to provoke a war between China and the United Kingdom.",
    movies: ["Edge of Tomorrow", "Tomorrow Never Dies"],
    aliases: [["edge of tomorrow", "live die repeat"], ["tomorrow never dies", "james bond tomorrow never dies"]],
    hints: ["Both films feature a protagonist fighting a war that repeats itself \u2014 one literally, one through media manipulation.", "One is a Tom Cruise sci-fi film; the other a James Bond adventure.", "The word 'Tomorrow' is the shared hinge."],
    difficulty: "Medium",
    difficultyReason: "Tomorrow Never Dies is a Bond film that casual fans might not place by title",
    connection: "Edge of Tomorrow and Tomorrow Never Dies are both action films about wars that are manufactured or perpetuated by powerful forces \u2014 one by alien biology, one by a billionaire's ambition.",
    hintData: {"films": [{"year": 2014, "genre": "Sci-Fi Action", "actors": ["Tom Cruise", "Emily Blunt"]}, {"year": 1997, "genre": "Action/Spy", "actors": ["Pierce Brosnan", "Jonathan Pryce"]}]},
  },
  {
    id: 18,
    mashedTitle: "Enemy of the Garden State",
    mashedPlot: "A lawyer becomes targeted by a corrupt politician and his NSA goons when he accidentally receives key evidence to a politically motivated murder. He returns to his hometown for his mother's funeral after years of estrangement and meets a quirky young woman who inspires him to open up and embrace life.",
    movies: ["Enemy of the State", "Garden State"],
    aliases: [["enemy of the state"], ["garden state"]],
    hints: ["One is a Will Smith surveillance thriller; the other a Zach Braff indie about emotional paralysis.", "Both protagonists return home under duress and find unexpected connection.", "Think: Will Smith meets Natalie Portman."],
    difficulty: "Hard",
    difficultyReason: "The tonal gap between these two films is enormous",
    connection: "Enemy of the State and Garden State are both films about men whose carefully constructed lives are suddenly and violently disrupted, forcing them to reconnect with who they actually are.",
    hintData: {"films": [{"year": 1998, "genre": "Action Thriller", "actors": ["Will Smith", "Gene Hackman"]}, {"year": 2004, "genre": "Indie Drama", "actors": ["Zach Braff", "Natalie Portman"]}]},
  },
  {
    id: 19,
    mashedTitle: "Eternal Sunshine of a Beautiful Mind",
    mashedPlot: "After a painful breakup, a brilliant math prodigy develops paranoid schizophrenia and undergoes a procedure to erase memories of his girlfriend from his mind.",
    movies: ["Eternal Sunshine of the Spotless Mind", "A Beautiful Mind"],
    aliases: [["eternal sunshine", "eternal sunshine of the spotless mind", "spotless mind"], ["a beautiful mind", "beautiful mind"]],
    hints: ["Both films are about brilliant minds that fracture under emotional pressure.", "One erases memories voluntarily; the other creates false ones involuntarily.", "Think: Jim Carrey meets Russell Crowe."],
    difficulty: "Medium",
    difficultyReason: "The thematic link between memory and mental illness is elegant but requires thought",
    connection: "Eternal Sunshine of the Spotless Mind and A Beautiful Mind are mirror images: one man tries desperately to erase his mind; the other cannot control what his mind invents. Both are about how love and pain are stored in the same place.",
    hintData: {"films": [{"year": 2004, "genre": "Sci-Fi Romance", "actors": ["Jim Carrey", "Kate Winslet"]}, {"year": 2001, "genre": "Drama", "actors": ["Russell Crowe", "Jennifer Connelly"]}]},
  },
  {
    id: 20,
    mashedTitle: "Fantastic Beasts and Where to Find Nemo",
    mashedPlot: "A wizard arrives in 1926 New York with a suitcase full of magical creatures, only for several of them to escape and cause chaos across the city. After his son is captured and taken to Sydney, he sets out on a journey to bring him home.",
    movies: ["Fantastic Beasts and Where to Find Them", "Finding Nemo"],
    aliases: [["fantastic beasts", "fantastic beasts and where to find them"], ["finding nemo", "nemo"]],
    hints: ["Both films are about tracking down something precious that has gone missing in a large, overwhelming world.", "One takes place in wizarding New York; the other in the ocean.", "Think: Eddie Redmayne meets a clownfish."],
    difficulty: "Easy",
    difficultyReason: "Both films are family-friendly blockbusters and the title wordplay is clean",
    connection: "Fantastic Beasts and Finding Nemo are both about a parent figure venturing into an unfamiliar world to retrieve something they lost \u2014 one a suitcase of creatures, one a son.",
    hintData: {"films": [{"year": 2016, "genre": "Fantasy Adventure", "actors": ["Eddie Redmayne", "Katherine Waterston"]}, {"year": 2003, "genre": "Animated Adventure", "actors": ["Albert Brooks", "Ellen DeGeneres"]}]},
  },
  {
    id: 21,
    mashedTitle: "Gone Girl Interrupted",
    mashedPlot: "The husband of a missing woman becomes the main suspect in her disappearance. Unbeknownst to him, she is hiding in a mental institution where she befriends a group of troubled women who deeply influence her life.",
    movies: ["Gone Girl", "Girl, Interrupted"],
    aliases: [["gone girl"], ["girl interrupted", "girl, interrupted"]],
    hints: ["Both films center on a young woman who is perceived as unstable by the men around her.", "One is a David Fincher thriller; the other a Winona Ryder drama set in a psychiatric facility.", "Both films ultimately ask: who gets to define a woman as 'crazy'?"],
    difficulty: "Medium",
    difficultyReason: "The feminist subtext connecting these films rewards close reading",
    connection: "Gone Girl and Girl, Interrupted are both films about women who are labelled dangerous or unstable by a world that refuses to understand them \u2014 and both use that label as a weapon.",
    hintData: {"films": [{"year": 2014, "genre": "Psychological Thriller", "actors": ["Ben Affleck", "Rosamund Pike"]}, {"year": 1999, "genre": "Drama", "actors": ["Winona Ryder", "Angelina Jolie"]}]},
  },
  {
    id: 22,
    mashedTitle: "Grizzly Man on the Moon",
    mashedPlot: "A grizzly bear activist rises to fame through stand-up, television, and performance art while living among grizzly bears in Alaska. Obsessed with blurring the line between reality and illusion, often leaving the bears unsure whether his pranks are jokes or something more serious. Ultimately, they eat him.",
    movies: ["Grizzly Man", "Man on the Moon"],
    aliases: [["grizzly man"], ["man on the moon", "andy kaufman film"]],
    hints: ["Both films are about real people who made performance their entire identity \u2014 to dangerous extremes.", "One subject was eaten by bears; the other died of cancer, possibly in character.", "Both are directed by Werner Herzog... no, one is. The other stars Jim Carrey."],
    difficulty: "Hard",
    difficultyReason: "Man on the Moon (the Andy Kaufman biopic) is less widely recalled by title",
    connection: "Grizzly Man and Man on the Moon are both about men who refused to accept the boundary between performance and reality \u2014 and paid an enormous price for it.",
    hintData: {"films": [{"year": 2005, "genre": "Documentary", "actors": ["Timothy Treadwell", "Werner Herzog (dir.)"]}, {"year": 1999, "genre": "Biographical Comedy", "actors": ["Jim Carrey", "Danny DeVito"]}]},
  },
  {
    id: 23,
    mashedTitle: "How to Train to Busan",
    mashedPlot: "A young Viking who aspires to hunt dragons becomes the unlikely friend of a young dragon himself. As their bond grows, they board a high-speed train where a sudden zombie outbreak rapidly spreads among the passengers.",
    movies: ["How to Train Your Dragon", "Train to Busan"],
    aliases: [["how to train your dragon", "httyd", "train your dragon"], ["train to busan", "busan"]],
    hints: ["One is a DreamWorks animated adventure; the other a Korean zombie thriller.", "Both are set primarily in motion \u2014 one on dragonback, one on rails.", "The word 'Train' is the connector \u2014 but for very different reasons."],
    difficulty: "Medium",
    difficultyReason: "Train to Busan is a global hit but may be less familiar to some players",
    connection: "How to Train Your Dragon and Train to Busan are both about unlikely bonds formed under mortal threat \u2014 one between a boy and a dragon, one between strangers on a doomed train.",
    hintData: {"films": [{"year": 2010, "genre": "Animated Adventure", "actors": ["Jay Baruchel", "Gerard Butler"]}, {"year": 2016, "genre": "Horror Thriller", "actors": ["Gong Yoo", "Ma Dong-seok"]}]},
  },
  {
    id: 24,
    mashedTitle: "How to Lose a Guy in 10 Things I Hate About You",
    mashedPlot: "An advertising executive bets he can make a woman fall in love with him in 10 days. Meanwhile, a high-school boy cannot date Bianca until her anti-social older sister Kat has a boyfriend, so he pays the advertising executive to charm Kat.",
    movies: ["How to Lose a Guy in 10 Days", "10 Things I Hate About You"],
    aliases: [["how to lose a guy in 10 days", "how to lose a guy"], ["10 things i hate about you", "ten things i hate about you"]],
    hints: ["Both are early-2000s romantic comedies built around elaborate deceptions about love.", "Both feature a man paid or bet to win over a woman who wants nothing to do with him.", "Think: Kate Hudson meets Julia Stiles and Heath Ledger."],
    difficulty: "Easy",
    difficultyReason: "Two beloved rom-coms with very compatible plots",
    connection: "How to Lose a Guy in 10 Days and 10 Things I Hate About You are both films about romantic manipulation that backfires \u2014 and both argue that genuine feeling always breaks through artifice eventually.",
    hintData: {"films": [{"year": 2003, "genre": "Romantic Comedy", "actors": ["Kate Hudson", "Matthew McConaughey"]}, {"year": 1999, "genre": "Teen Romantic Comedy", "actors": ["Julia Stiles", "Heath Ledger"]}]},
  },
  {
    id: 25,
    mashedTitle: "I Know What You Did Last 500 Days of Summer",
    mashedPlot: "Four friends accidentally cause a man's death and cover it up. 500 days later, a mysterious message reveals their secret isn't safe. One of the friends, Tom, reflects on their relationship and idealizes their time together. As a hook-wielding killer hunts them down, Tom is forced to confront the gap between his expectations and reality.",
    movies: ["I Know What You Did Last Summer", "500 Days of Summer"],
    aliases: [["i know what you did last summer"], ["500 days of summer", "five hundred days of summer"]],
    hints: ["One is a teen slasher film; the other a non-linear indie romance about heartbreak.", "Both involve a protagonist who cannot let go of the past.", "Think: Jennifer Love Hewitt meets Joseph Gordon-Levitt."],
    difficulty: "Medium",
    difficultyReason: "The tonal combination is jarring in a very funny way",
    connection: "I Know What You Did Last Summer and 500 Days of Summer are both about people haunted by something they did \u2014 one a crime, one a relationship \u2014 and the difference between what happened and what they remember.",
    hintData: {"films": [{"year": 1997, "genre": "Teen Horror", "actors": ["Jennifer Love Hewitt", "Sarah Michelle Gellar"]}, {"year": 2009, "genre": "Romantic Drama", "actors": ["Joseph Gordon-Levitt", "Zooey Deschanel"]}]},
  },
  {
    id: 26,
    mashedTitle: "Independence Day of the Jackal",
    mashedPlot: "Aliens invade Earth and a scientist, a fighter pilot, and the U.S. president unite to fight back and save humanity. In the aftermath, a group of resentful veterans hire an assassin to kill the president, sparking a race against time to stop him.",
    movies: ["Independence Day", "The Day of the Jackal"],
    aliases: [["independence day", "id4", "independance day"], ["the day of the jackal", "day of the jackal"]],
    hints: ["One is a Roland Emmerich summer blockbuster; the other a tense 1970s political thriller.", "Both films feature elaborate plans to destroy American leadership.", "The word 'Day' is shared \u2014 one of celebration, one of assassination."],
    difficulty: "Hard",
    difficultyReason: "The Day of the Jackal is a classic that younger players may not know",
    connection: "Both are last-chance day stories: one man relives the same day until he changes himself, while the other survives one catastrophic day that changes the world.",
    hintData: {"films": [{"year": 1996, "genre": "Sci-Fi Action", "actors": ["Will Smith", "Bill Pullman"]}, {"year": 1973, "genre": "Political Thriller", "actors": ["Edward Fox", "Michel Lonsdale"]}]},
  },
  {
    id: 27,
    mashedTitle: "Isle of Reservoir Dogs",
    mashedPlot: "In a dystopian Japan where all dogs have been exiled to a remote island, one boy sets out to find his lost dog. There, he encounters a clever pack of dogs who aid him on his quest. But when a diamond heist goes horribly wrong, the boy and the surviving dogs gather in a warehouse, unsure who among them is an undercover cop.",
    movies: ["Isle of Dogs", "Reservoir Dogs"],
    aliases: [["isle of dogs"], ["reservoir dogs"]],
    hints: ["One is a Wes Anderson stop-motion film; the other Tarantino's debut.", "Both films feature ensemble casts of dogs \u2014 one literal, one metaphorical.", "Think: Wes Anderson meets Quentin Tarantino."],
    difficulty: "Medium",
    difficultyReason: "The shared word 'Dogs' is the elegant pivot",
    connection: "Isle of Dogs and Reservoir Dogs share only the word 'Dogs' \u2014 but both are about loyalty, betrayal, and whether trust can survive under extreme pressure.",
    hintData: {"films": [{"year": 2018, "genre": "Animated Drama", "actors": ["Bryan Cranston", "Edward Norton"]}, {"year": 1992, "genre": "Crime Thriller", "actors": ["Harvey Keitel", "Tim Roth"]}]},
  },
  {
    id: 28,
    mashedTitle: "Justice League of Their Own",
    mashedPlot: "Batman forms a team of superheroes to stop a supervillain from conquering Earth. He also recruits two sisters to join the first female professional baseball league.",
    movies: ["Justice League", "A League of Their Own"],
    aliases: [["justice league"], ["a league of their own", "league of their own"]],
    hints: ["One film is a DC superhero ensemble; the other is Penny Marshall's baseball drama.", "Both films are about assembling unlikely teams to compete in an arena that wasn't designed for them.", "'There's no crying in the Justice League' \u2014 probably."],
    difficulty: "Easy",
    difficultyReason: "Both films are widely known and the word 'League' is the obvious connector",
    connection: "Justice League and A League of Their Own are both films about the difficult, necessary work of building a team out of people who don't yet trust each other \u2014 and proving that the team was necessary all along.",
    hintData: {"films": [{"year": 2017, "genre": "Superhero Action", "actors": ["Ben Affleck", "Gal Gadot"]}, {"year": 1992, "genre": "Sports Drama", "actors": ["Tom Hanks", "Geena Davis"]}]},
  },
  {
    id: 29,
    mashedTitle: "Kill Bill & Ted's Excellent Adventure",
    mashedPlot: "After waking from a four-year coma, a former assassin embarks on a time-travel quest using a phone booth to help her final history project. She journeys through different historical eras wreaking vengeance on historical figures who betrayed her.",
    movies: ["Kill Bill", "Bill & Ted's Excellent Adventure"],
    aliases: [["kill bill", "kill bill vol 1", "kill bill volume 1"], ["bill and teds excellent adventure", "bill & ted's excellent adventure", "bill and ted"]],
    hints: ["Both films involve a woman named Bill... wait, no. Both involve the name Bill prominently.", "One Bill is a ruthless assassin; the other two Bills are time-traveling slackers.", "Think: Uma Thurman meets Keanu Reeves and Alex Winter."],
    difficulty: "Easy",
    difficultyReason: "One of the most satisfying title wordplays in the deck",
    connection: "Kill Bill and Bill & Ted's Excellent Adventure share a first name and an obsession with journeying through time and history \u2014 one for revenge, one for a history presentation.",
    hintData: {"films": [{"year": 2003, "genre": "Action Thriller", "actors": ["Uma Thurman", "David Carradine"]}, {"year": 1989, "genre": "Sci-Fi Comedy", "actors": ["Keanu Reeves", "Alex Winter"]}]},
  },
  {
    id: 30,
    mashedTitle: "La La Land Before Time",
    mashedPlot: "An aspiring actress and a jazz pianist chase their dreams while journeying across a dangerous prehistoric landscape, befriending a group of young dinosaurs in search of the safe, lush Great Valley.",
    movies: ["La La Land", "The Land Before Time"],
    aliases: [["la la land"], ["the land before time", "land before time"]],
    hints: ["One is Damien Chazelle's musical about Hollywood dreams; the other a 1988 animated dinosaur film.", "Both are about characters moving toward a promised land they may never reach.", "Think: Ryan Gosling and Emma Stone meet Little Foot."],
    difficulty: "Easy",
    difficultyReason: "The wordplay is immediately legible",
    connection: "La La Land and The Land Before Time are both films about journeying toward an impossible dream \u2014 one the Great Valley, one Hollywood stardom. Both end with something gained and something lost.",
    hintData: {"films": [{"year": 2016, "genre": "Musical Drama", "actors": ["Ryan Gosling", "Emma Stone"]}, {"year": 1988, "genre": "Animated Adventure", "actors": ["Judith Barsi", "Gabriel Damon"]}]},
  },
  {
    id: 31,
    mashedTitle: "License to Kill a Mockingbird",
    mashedPlot: "A secret agent working for MI6 goes rogue after his close friend is brutally attacked and his wife is murdered by a drug lord. Driven by personal vendetta, he arrives in a quiet Southern town where his path crosses with a lawyer defending a black man falsely accused of a terrible crime.",
    movies: ["Licence to Kill", "To Kill a Mockingbird"],
    aliases: [["licence to kill", "license to kill", "james bond licence to kill"], ["to kill a mockingbird"]],
    hints: ["One is a James Bond film; the other Harper Lee's defining American novel turned film.", "Both protagonists operate outside official systems in the pursuit of justice.", "Bond meets Atticus Finch \u2014 in Alabama."],
    difficulty: "Hard",
    difficultyReason: "Licence to Kill is among the less-recalled Bond films",
    connection: "Licence to Kill and To Kill a Mockingbird are both about men who defy institutions to pursue their own version of justice \u2014 one with a Walther PPK, one with a closing argument.",
    hintData: {"films": [{"year": 1989, "genre": "Action/Spy", "actors": ["Timothy Dalton", "Carey Lowell"]}, {"year": 1962, "genre": "Drama", "actors": ["Gregory Peck", "Mary Badham"]}]},
  },
  {
    id: 32,
    mashedTitle: "Meet Joe Black Hawk Down",
    mashedPlot: "Death, embodied in human form, arrives to claim a man's soul during the Somali Civil War. Instead, he finds himself drawn to the man's daughter. As violence escalates and a U.S. military helicopter is shot down, Death faces an impossible choice: claiming lives on the battlefield or embracing the meaning he's found in love and connection.",
    movies: ["Meet Joe Black", "Black Hawk Down"],
    aliases: [["meet joe black", "joe black"], ["black hawk down", "blackhawk down"]],
    hints: ["Both films share the word 'Black' \u2014 one a name, one a military call sign.", "One is a philosophical romantic drama; the other Ridley Scott's intense war film.", "Think: Brad Pitt meets Josh Hartnett."],
    difficulty: "Medium",
    difficultyReason: "The shared word 'Black' is the pivot and both films are well-known",
    connection: "Meet Joe Black and Black Hawk Down are both films about men confronting death in very different environments \u2014 one as a personified visitor at a birthday party, one as a soldier in Mogadishu.",
    hintData: {"films": [{"year": 1998, "genre": "Romantic Fantasy", "actors": ["Brad Pitt", "Anthony Hopkins"]}, {"year": 2001, "genre": "War Drama", "actors": ["Josh Hartnett", "Ewan McGregor"]}]},
  },
  {
    id: 33,
    mashedTitle: "Monsters Incredibles",
    mashedPlot: "In a world where monsters harvest energy from fear, a hidden family of superheroes is forced out of retirement when a human child crosses into their realm, leading them to stop a vengeful villain.",
    movies: ["Monsters, Inc.", "The Incredibles"],
    aliases: [["monsters inc", "monsters inc.", "monsters incorporated"], ["the incredibles", "incredibles"]],
    hints: ["Both are Pixar films about extraordinary beings living double lives in a world that doesn't fully understand them.", "One hides monsters from children; the other hides superheroes from society.", "Both feature a villain who was once a true believer turned bitter."],
    difficulty: "Easy",
    difficultyReason: "Both are beloved Pixar films and the thematic link is satisfying",
    connection: "Monsters, Inc. and The Incredibles are both Pixar films about suppressing your true nature for the sake of a fearful society \u2014 and discovering that hiding who you are has a cost.",
    hintData: {"films": [{"year": 2001, "genre": "Animated Comedy", "actors": ["John Goodman", "Billy Crystal"]}, {"year": 2004, "genre": "Animated Superhero", "actors": ["Craig T. Nelson", "Holly Hunter"]}]},
  },
  {
    id: 34,
    mashedTitle: "No Country for Oldboy",
    mashedPlot: "A drug deal goes wrong, leaving behind a suitcase full of cash. A man finds it, triggering a violent chain of events. Meanwhile, a man imprisoned for 15 years is suddenly released and forced to track down his captor within five days.",
    movies: ["No Country for Old Men", "Oldboy"],
    aliases: [["no country for old men", "no country"], ["oldboy", "old boy"]],
    hints: ["One is the Coen Brothers' West Texas thriller; the other Park Chan-wook's Korean revenge masterpiece.", "Both films feature an unstoppable, philosophically-minded villain.", "Anton Chigurh meets the corridor hallway fight."],
    difficulty: "Hard",
    difficultyReason: "Oldboy is a cult classic but requires familiarity with Korean cinema",
    connection: "No Country for Old Men and Oldboy are both films about men pursued by violence they cannot understand or escape \u2014 and both end in a place of profound, irresolvable darkness.",
    hintData: {"films": [{"year": 2007, "genre": "Crime Thriller", "actors": ["Tommy Lee Jones", "Javier Bardem"]}, {"year": 2003, "genre": "Korean Thriller", "actors": ["Choi Min-sik", "Yoo Ji-tae"]}]},
  },
  {
    id: 35,
    mashedTitle: "Office Space Cowboys",
    mashedPlot: "A frustrated office worker, fed up with his soulless job and annoying bosses, rebels against corporate life after a hypnotism session. He is joined by a group of aging former test pilots called back into action to repair an old Soviet satellite.",
    movies: ["Office Space", "Space Cowboys"],
    aliases: [["office space"], ["space cowboys"]],
    hints: ["One is Mike Judge's cult comedy about corporate misery; the other a Clint Eastwood film about aging astronauts.", "Both films are about people who refuse to be told their best days are behind them.", "Think: Ron Livingston meets Clint Eastwood and Tommy Lee Jones."],
    difficulty: "Medium",
    difficultyReason: "Space Cowboys is less recalled by younger audiences",
    connection: "Office Space and Space Cowboys are both films about rebellion against a system that treats human beings as disposable \u2014 one through printer destruction, one through rocket science.",
    hintData: {"films": [{"year": 1999, "genre": "Office Comedy", "actors": ["Ron Livingston", "Jennifer Aniston"]}, {"year": 2000, "genre": "Adventure", "actors": ["Clint Eastwood", "Tommy Lee Jones"]}]},
  },
  {
    id: 36,
    mashedTitle: "Portrait of a Lady and the Tramp on Fire",
    mashedPlot: "A French historical romance tells the story of a forbidden love between a female Cocker Spaniel and a street-smart mutt who is hired to secretly paint her portrait.",
    movies: ["Portrait of a Lady on Fire", "Lady and the Tramp"],
    aliases: [["portrait of a lady on fire", "portrait of a lady"], ["lady and the tramp", "lady & the tramp"]],
    hints: ["One is C\u00e9line Sciamma's acclaimed French art-film romance; the other a 1955 Disney animated classic.", "Both stories centre on a forbidden or socially impossible love between a refined lady and someone beneath her station.", "One famous dinner scene involves candlelight; the other involves shared spaghetti."],
    difficulty: "Hard",
    difficultyReason: "Portrait of a Lady on Fire is critically acclaimed but a niche watch",
    connection: "Portrait of a Lady on Fire and Lady and the Tramp are both love stories about impossible social divides \u2014 one painted in 18th-century France, one animated in a cartoon alley. Both end with longing.",
    hintData: {"films": [{"year": 2019, "genre": "Romantic Drama", "actors": ["No\u00e9mie Merlant", "Ad\u00e8le Haenel"]}, {"year": 1955, "genre": "Animated Romance", "actors": ["Peggy Lee", "Larry Roberts"]}]},
  },
  {
    id: 37,
    mashedTitle: "Quantum of Soul",
    mashedPlot: "An MI6 agent seeks revenge while uncovering a secret organization manipulating natural resources in Bolivia. He teams up with a middle school music teacher and a soul-in-training after a near-death experience to discover what truly gives life meaning.",
    movies: ["Quantum of Solace", "Soul"],
    aliases: [["quantum of solace", "james bond quantum"], ["soul", "pixar soul"]],
    hints: ["One is a James Bond film; the other a Pixar meditation on what makes life worth living.", "Both protagonists are on a mission they believe is about revenge or duty \u2014 and learn it's about something deeper.", "Bond meets Joe Gardner."],
    difficulty: "Medium",
    difficultyReason: "The philosophical contrast is the joke and the insight simultaneously",
    connection: "Quantum of Solace and Soul are both films about people so consumed by a mission that they've forgotten what they're living for \u2014 and both find the answer somewhere unexpected.",
    hintData: {"films": [{"year": 2008, "genre": "Action/Spy", "actors": ["Daniel Craig", "Olga Kurylenko"]}, {"year": 2020, "genre": "Animated Drama", "actors": ["Jamie Foxx", "Tina Fey"]}]},
  },
  {
    id: 38,
    mashedTitle: "Raging Bullet Train",
    mashedPlot: "A boxer rises to fame through his ferocious fighting style, but his explosive temper destroys his relationships. While boarding a high-speed train in Japan, he becomes entangled in a series of deadly encounters orchestrated by interconnected criminal schemes.",
    movies: ["Raging Bull", "Bullet Train"],
    aliases: [["raging bull"], ["bullet train"]],
    hints: ["One is Scorsese's black-and-white boxing masterpiece; the other a Brad Pitt action-comedy set on a Japanese train.", "Both films are about violence as a way of life and its consequences.", "Jake LaMotta meets Ladybug."],
    difficulty: "Medium",
    difficultyReason: "The tonal whiplash between these two films is half the fun",
    connection: "Raging Bull and Bullet Train are both films about men defined by their capacity for violence who find themselves in environments where that capacity has terrible costs.",
    hintData: {"films": [{"year": 1980, "genre": "Sports Drama", "actors": ["Robert De Niro", "Joe Pesci"]}, {"year": 2022, "genre": "Action Comedy", "actors": ["Brad Pitt", "Joey King"]}]},
  },
  {
    id: 39,
    mashedTitle: "Revolutionary Road to El Dorado",
    mashedPlot: "A 1950s suburban couple come to terms with their personal problems when they get their hands on a map to a legendary city of gold.",
    movies: ["Revolutionary Road", "The Road to El Dorado"],
    aliases: [["revolutionary road"], ["the road to el dorado", "road to el dorado", "el dorado"]],
    hints: ["One is Sam Mendes' bleak drama about suburban suffocation; the other a DreamWorks animated adventure.", "Both are about characters who believe a destination will solve their problems \u2014 and find it doesn't.", "Think: Leonardo DiCaprio meets Miguel and Tulio."],
    difficulty: "Hard",
    difficultyReason: "Revolutionary Road is a heavy drama that contrasts wildly with an animated adventure",
    connection: "Revolutionary Road and The Road to El Dorado are both films about people who chase a promised land \u2014 one the freedom of Paris, one a city of gold \u2014 and discover the dream was always the problem.",
    hintData: {"films": [{"year": 2008, "genre": "Drama", "actors": ["Leonardo DiCaprio", "Kate Winslet"]}, {"year": 2000, "genre": "Animated Adventure", "actors": ["Kevin Kline", "Kenneth Branagh"]}]},
  },
  {
    id: 40,
    mashedTitle: "Run Lola Chicken Run",
    mashedPlot: "A young woman has just twenty minutes to rescue her boyfriend after he loses a large sum of money belonging to a criminal. When a charismatic rooster appears, they hatch an elaborate plan to escape the coop.",
    movies: ["Run Lola Run", "Chicken Run"],
    aliases: [["run lola run", "lola rennt"], ["chicken run"]],
    hints: ["One is a German kinetic thriller about urgency and fate; the other an Aardman animated film about chickens escaping a farm.", "Both films hinge on a daring escape plan executed at speed.", "Think: Franka Potente meets Rocky the Rhode Island Red."],
    difficulty: "Medium",
    difficultyReason: "Run Lola Run is iconic in film circles but less mainstream",
    connection: "Run Lola Run and Chicken Run are both films about running \u2014 one through the streets of Berlin, one through a chicken farm. Both are fundamentally about refusing to accept the situation you've been given.",
    hintData: {"films": [{"year": 1998, "genre": "Action Thriller", "actors": ["Franka Potente", "Moritz Bleibtreu"]}, {"year": 2000, "genre": "Animated Comedy", "actors": ["Mel Gibson", "Julia Sawalha"]}]},
  },
  {
    id: 41,
    mashedTitle: "Scarface/Off",
    mashedPlot: "A Cuban immigrant rises through Miami's criminal underworld to become a ruthless drug lord. After the FBI captures him, they force an agent to undergo radical facial surgery and assume his identity to stop a hidden bomb from detonating in Los Angeles.",
    movies: ["Scarface", "Face/Off"],
    aliases: [["scarface"], ["face off", "face/off", "faceoff"]],
    hints: ["Both films are about identity, violence, and the cost of becoming someone else.", "One man builds an empire; another man literally wears another man's face.", "Think: Al Pacino meets John Travolta and Nicolas Cage."],
    difficulty: "Easy",
    difficultyReason: "Both are iconic action films and the wordplay is immediately satisfying",
    connection: "Scarface and Face/Off are both films about the terrifying fluidity of identity under extreme criminal pressure \u2014 one man becomes a monster, one man becomes another man.",
    hintData: {"films": [{"year": 1983, "genre": "Crime Drama", "actors": ["Al Pacino", "Michelle Pfeiffer"]}, {"year": 1997, "genre": "Action Thriller", "actors": ["John Travolta", "Nicolas Cage"]}]},
  },
  {
    id: 42,
    mashedTitle: "Shaun of the Dead Poets Society",
    mashedPlot: "An aimless London slacker must protect his loved ones when a sudden zombie apocalypse turns everyday life into a fight for survival. He also begins encouraging his students to seize the day and think for themselves while taking refuge in his favourite pub.",
    movies: ["Shaun of the Dead", "Dead Poets Society"],
    aliases: [["shaun of the dead"], ["dead poets society", "dead poets"]],
    hints: ["Both films centre on a charismatic leader who inspires a group of individuals to resist conformity.", "One does it at a school in Vermont; the other at a pub in London while zombies wait outside.", "Think: Simon Pegg meets Robin Williams."],
    difficulty: "Easy",
    difficultyReason: "Both films are beloved and the shared word 'Dead' is the hinge",
    connection: "Shaun of the Dead and Dead Poets Society are both about a man who galvanises a group around a philosophy of living fully \u2014 one through Latin poetry, one through not getting eaten.",
    hintData: {"films": [{"year": 2004, "genre": "Horror Comedy", "actors": ["Simon Pegg", "Nick Frost"]}, {"year": 1989, "genre": "Drama", "actors": ["Robin Williams", "Ethan Hawke"]}]},
  },
  {
    id: 43,
    mashedTitle: "Singin' in the Rain Man",
    mashedPlot: "As Hollywood shifts from silent films to talkies, a silent film star struggles to help his co-star overcome her terrible voice. At the same time, he learns that his late father's fortune has been left to an unknown older brother living in a care facility, prompting a cross-country journey to secure the inheritance.",
    movies: ["Singin' in the Rain", "Rain Man"],
    aliases: [["singin in the rain", "singing in the rain", "singin' in the rain"], ["rain man", "rainman"]],
    hints: ["Both films share the word 'Rain' \u2014 one joyful, one heavy with responsibility.", "One is a classic MGM musical; the other a Dustin Hoffman and Tom Cruise road movie.", "Gene Kelly meets Dustin Hoffman."],
    difficulty: "Easy",
    difficultyReason: "Both films are among the most famous ever made",
    connection: "Singin' in the Rain and Rain Man are connected only by precipitation \u2014 but both are about men who must adapt to a partner they didn't choose and discover something unexpected in the process.",
    hintData: {"films": [{"year": 1952, "genre": "Musical Comedy", "actors": ["Gene Kelly", "Debbie Reynolds"]}, {"year": 1988, "genre": "Drama", "actors": ["Dustin Hoffman", "Tom Cruise"]}]},
  },
  {
    id: 44,
    mashedTitle: "Some Like It Hot Fuzz",
    mashedPlot: "Two struggling musicians, after witnessing a mob hit, disguise themselves as women and join an all-female band to escape danger. When an overachieving London police officer is reassigned to a seemingly quiet village where they hide, his investigation into a series of suspicious accidents uncovers a dark conspiracy.",
    movies: ["Some Like It Hot", "Hot Fuzz"],
    aliases: [["some like it hot"], ["hot fuzz"]],
    hints: ["Both films are comedies that use disguise and performance to explore identity and danger.", "One is a Billy Wilder classic; the other an Edgar Wright action-comedy.", "'Nobody's perfect' meets 'THE GREATER GOOD.'"],
    difficulty: "Medium",
    difficultyReason: "The shared word 'Hot' is the connector between two wildly different comedies",
    connection: "Some Like It Hot and Hot Fuzz are both comedies in which ordinary people stumble into violent criminal conspiracies and must use wit and disguise to survive \u2014 separated by sixty years and an ocean.",
    hintData: {"films": [{"year": 1959, "genre": "Comedy", "actors": ["Marilyn Monroe", "Tony Curtis"]}, {"year": 2007, "genre": "Action Comedy", "actors": ["Simon Pegg", "Nick Frost"]}]},
  },
  {
    id: 45,
    mashedTitle: "Spirited Cast Away",
    mashedPlot: "A 10-year-old girl wanders into a bathhouse ruled by gods, witches and spirits. When she wants to return she discovers that her parents have been transformed into pigs and that she is now stranded on a remote island. Forced to survive alone, she adapts to the harsh environment, forming an emotional bond with a volleyball.",
    movies: ["Spirited Away", "Cast Away"],
    aliases: [["spirited away", "sen to chihiro"], ["cast away", "castaway"]],
    hints: ["One is Studio Ghibli's masterpiece; the other a Tom Hanks survival drama.", "Both protagonists are suddenly cut off from their world and must adapt to a new one entirely alone.", "Chihiro meets Wilson."],
    difficulty: "Easy",
    difficultyReason: "Both are beloved films and the isolation theme is immediately clear",
    connection: "Spirited Away and Cast Away are both films about people who fall into a world they don't understand and have to survive by finding their own strength \u2014 one in a spirit realm, one on a deserted island.",
    hintData: {"films": [{"year": 2001, "genre": "Animated Fantasy", "actors": ["Daveigh Chase", "Suzuki Matsuo"]}, {"year": 2000, "genre": "Drama", "actors": ["Tom Hanks", "Helen Hunt"]}]},
  },
  {
    id: 46,
    mashedTitle: "Stand by Meet the Parents",
    mashedPlot: "Four friends set out on a journey to find the body of a missing boy. Along the way they visit his girlfriend's family, hoping to ask for permission to propose, but instead repeatedly clash with her intimidating father.",
    movies: ["Stand by Me", "Meet the Parents"],
    aliases: [["stand by me"], ["meet the parents"]],
    hints: ["One is a Stephen King coming-of-age story; the other a Ben Stiller comedy about a nightmarish future in-law.", "Both films are road trips defined by an encounter with someone deeply intimidating.", "River Phoenix meets Robert De Niro."],
    difficulty: "Medium",
    difficultyReason: "The plot combination is absurd in a very specific way",
    connection: "Stand by Me and Meet the Parents are both films about a young man proving himself \u2014 one to his friends on a fateful journey, one to a terrifying father who will never be satisfied.",
    hintData: {"films": [{"year": 1986, "genre": "Coming-of-Age Drama", "actors": ["River Phoenix", "Wil Wheaton"]}, {"year": 2000, "genre": "Comedy", "actors": ["Ben Stiller", "Robert De Niro"]}]},
  },
  {
    id: 47,
    mashedTitle: "Superbad Boys",
    mashedPlot: "Two teens scramble to score alcohol for a party in hopes of losing their virginity before graduation, but their plan spirals when they are tasked to protect a witness to a murder while investigating a case of stolen heroin from a secure police vault.",
    movies: ["Superbad", "Bad Boys"],
    aliases: [["superbad"], ["bad boys", "bad boys 1", "bad boys will smith"]],
    hints: ["One is a coming-of-age teen comedy; the other a Will Smith and Martin Lawrence action film.", "Both are about male partnerships tested under pressure.", "Think: Jonah Hill and Michael Cera meet Will Smith and Martin Lawrence."],
    difficulty: "Easy",
    difficultyReason: "Both films are widely known and the shared word 'Bad' is obvious",
    connection: "Superbad and Bad Boys are both films about two men whose friendship is the real story, with the plot (a party, a drug case) serving only as the pressure that reveals how much they mean to each other.",
    hintData: {"films": [{"year": 2007, "genre": "Teen Comedy", "actors": ["Jonah Hill", "Michael Cera"]}, {"year": 1995, "genre": "Action Comedy", "actors": ["Will Smith", "Martin Lawrence"]}]},
  },
  {
    id: 48,
    mashedTitle: "Taxi Baby Driver",
    mashedPlot: "A lonely and mentally unstable Vietnam War veteran works as a night-time taxi driver in New York and relies on music to enhance his precision behind the wheel. When he becomes entangled with a criminal crew, he must survive dangerous heists to escape and find freedom.",
    movies: ["Taxi Driver", "Baby Driver"],
    aliases: [["taxi driver"], ["baby driver"]],
    hints: ["Both films feature a driver whose relationship to music defines his sense of self and moral code.", "One driver cleans up the streets; the other cleans out banks.", "Travis Bickle meets Miles."],
    difficulty: "Easy",
    difficultyReason: "Both are iconic films and the shared profession is the perfect connector",
    connection: "Taxi Driver and Baby Driver are both films about a young man in a car whose music is his armour \u2014 one against urban despair, one against the criminals who control him.",
    hintData: {"films": [{"year": 1976, "genre": "Psychological Thriller", "actors": ["Robert De Niro", "Jodie Foster"]}, {"year": 2017, "genre": "Action Musical", "actors": ["Ansel Elgort", "Kevin Spacey"]}]},
  },
  {
    id: 49,
    mashedTitle: "The Bad News Cocaine Bear",
    mashedPlot: "A washed-up coach reluctantly trains a ragtag, misfit Little League team and leads them to unexpected growth, after a black bear ingesting a stash of cocaine dropped by a smuggler goes on a violent, drug-fuelled rampage.",
    movies: ["The Bad News Bears", "Cocaine Bear"],
    aliases: [["the bad news bears", "bad news bears"], ["cocaine bear"]],
    hints: ["One is a 1976 Walter Matthau sports comedy; the other a 2023 horror-comedy based on a true story.", "Both films involve chaotic, out-of-control behaviour in public settings.", "Think: Walter Matthau meets a very motivated bear."],
    difficulty: "Medium",
    difficultyReason: "The Bad News Bears is a classic but generationally specific",
    connection: "The Bad News Bears and Cocaine Bear are both films about chaotic underdogs causing havoc \u2014 one a Little League team, one a 175-pound black bear with 40 kilos of cocaine in its system.",
    hintData: {"films": [{"year": 1976, "genre": "Sports Comedy", "actors": ["Walter Matthau", "Tatum O'Neal"]}, {"year": 2023, "genre": "Horror Comedy", "actors": ["Keri Russell", "O'Shea Jackson Jr."]}]},
  },
  {
    id: 50,
    mashedTitle: "The Darjeeling Limitless",
    mashedPlot: "Three estranged brothers travelling across India by train in a chaotic attempt at spiritual self-discovery take a mysterious drug that grants them extraordinary intelligence, which comes with dangerous side effects and powerful enemies.",
    movies: ["The Darjeeling Limited", "Limitless"],
    aliases: [["the darjeeling limited", "darjeeling limited"], ["limitless"]],
    hints: ["One is a Wes Anderson film about brotherhood and grief; the other a Bradley Cooper thriller about cognitive enhancement.", "Both films are about men who believe a substance or journey will make them better people.", "Think: Jason Schwartzman, Owen Wilson, and Adrien Brody meet Bradley Cooper."],
    difficulty: "Hard",
    difficultyReason: "The Darjeeling Limited is beloved but a niche Wes Anderson entry",
    connection: "The Darjeeling Limited and Limitless are both films about men chasing transcendence \u2014 one through a spiritual train journey, one through a pill \u2014 and both discover the self they were running from was already there.",
    hintData: {"films": [{"year": 2007, "genre": "Comedy Drama", "actors": ["Jason Schwartzman", "Owen Wilson"]}, {"year": 2011, "genre": "Sci-Fi Thriller", "actors": ["Bradley Cooper", "Robert De Niro"]}]},
  },
  {
    id: 51,
    mashedTitle: "The Fault in Our Star Wars",
    mashedPlot: "Two teenagers who meet at a cancer support group form a bittersweet romance while becoming entangled in an intergalactic rebellion against an evil empire, discovering the power of the Force along the way.",
    movies: ["The Fault in Our Stars", "Star Wars"],
    aliases: [["the fault in our stars", "fault in our stars"], ["star wars", "a new hope", "star wars a new hope", "star wars episode iv"]],
    hints: ["One is a YA cancer romance; the other the defining science fiction saga.", "Both feature young people who discover their lives are part of something much larger than themselves.", "Hazel and Augustus meet Luke and Leia."],
    difficulty: "Easy",
    difficultyReason: "Both are among the most recognisable films of their era",
    connection: "The Fault in Our Stars and Star Wars are both stories about young people who discover they have very little time and choose to spend it fighting for something that matters.",
    hintData: {"films": [{"year": 2014, "genre": "Romantic Drama", "actors": ["Shailene Woodley", "Ansel Elgort"]}, {"year": 1977, "genre": "Sci-Fi Adventure", "actors": ["Mark Hamill", "Harrison Ford"]}]},
  },
  {
    id: 52,
    mashedTitle: "The Grand Budapest Hotel Rwanda",
    mashedPlot: "A devoted hotel concierge and his young prot\u00e9g\u00e9 become entangled in an adventure involving a priceless painting while sheltering over a thousand Tutsi refugees, risking their lives to save others amid escalating violence in Kigali.",
    movies: ["The Grand Budapest Hotel", "Hotel Rwanda"],
    aliases: [["the grand budapest hotel", "grand budapest hotel", "grand budapest"], ["hotel rwanda"]],
    hints: ["Both films are set primarily in a hotel that becomes a refuge from extreme violence.", "One is a Wes Anderson comedy-thriller; the other a devastating historical drama.", "Think: Ralph Fiennes meets Don Cheadle."],
    difficulty: "Medium",
    difficultyReason: "The shared setting of a hotel under siege is the elegant connector",
    connection: "The Grand Budapest Hotel and Hotel Rwanda are both films about hotel managers who use their position to protect people from political violence \u2014 one absurdly, one heroically.",
    hintData: {"films": [{"year": 2014, "genre": "Comedy Thriller", "actors": ["Ralph Fiennes", "Tony Revolori"]}, {"year": 2004, "genre": "Historical Drama", "actors": ["Don Cheadle", "Sophie Okonedo"]}]},
  },
  {
    id: 53,
    mashedTitle: "The Truman Showgirls",
    mashedPlot: "An insurance salesman begins to suspect that his whole life is actually a reality TV show, so he hitches a ride to Las Vegas where he finds work as a stripper and sets about clawing his way to the top of Vegas show business.",
    movies: ["The Truman Show", "Showgirls"],
    aliases: [["the truman show", "truman show"], ["showgirls"]],
    hints: ["One is a profound philosophical film about reality and surveillance; the other is a notoriously campy Vegas drama.", "Both protagonists are unwilling performers in a spectacle they didn't choose.", "Think: Jim Carrey meets Elizabeth Berkley."],
    difficulty: "Medium",
    difficultyReason: "The tonal gap is enormous and that's precisely what makes it funny",
    connection: "The Truman Show and Showgirls are both films about people who discover they are performing a life rather than living one \u2014 and both films are obsessed with spectacle as a substitute for reality.",
    hintData: {"films": [{"year": 1998, "genre": "Satirical Drama", "actors": ["Jim Carrey", "Laura Linney"]}, {"year": 1995, "genre": "Drama", "actors": ["Elizabeth Berkley", "Kyle MacLachlan"]}]},
  },
  {
    id: 54,
    mashedTitle: "The Green 8 Mile",
    mashedPlot: "A death row guard in the 1930s learns that a gentle giant in his charge possesses a mysterious gift: he's an amazing rapper who must overcome personal and social challenges while pursuing his dream of making it in the hip-hop world.",
    movies: ["The Green Mile", "8 Mile"],
    aliases: [["the green mile", "green mile"], ["8 mile", "eight mile", "eminem 8 mile"]],
    hints: ["Both films are about someone with extraordinary gifts who is constrained by a hostile system.", "One gift is supernatural healing; the other is rap.", "Think: Tom Hanks meets Eminem."],
    difficulty: "Easy",
    difficultyReason: "Both films are iconic and the shared word 'Mile' is the pivot",
    connection: "The Green Mile and 8 Mile are both films about a man with an extraordinary gift who is trapped in an environment that cannot appreciate it \u2014 one a death row cell, one a Detroit trailer park.",
    hintData: {"films": [{"year": 1999, "genre": "Fantasy Drama", "actors": ["Tom Hanks", "Michael Clarke Duncan"]}, {"year": 2002, "genre": "Drama", "actors": ["Eminem", "Kim Basinger"]}]},
  },
  {
    id: 55,
    mashedTitle: "The Little Mermaid in Manhattan",
    mashedPlot: "A mermaid princess makes a risky deal to become human in order to follow her heart. She finds herself working as a hotel maid in New York, where she's mistaken for a wealthy guest and falls in love with a politician.",
    movies: ["The Little Mermaid", "Maid in Manhattan"],
    aliases: [["the little mermaid", "little mermaid"], ["maid in manhattan"]],
    hints: ["Both films are about a woman who gives up her world to enter a more glamorous one, and is mistaken for someone she isn't.", "One makes a deal with a sea witch; the other borrows a fur coat.", "Think: Ariel meets Jennifer Lopez."],
    difficulty: "Easy",
    difficultyReason: "Both films share an almost identical core plot in disguise",
    connection: "The Little Mermaid and Maid in Manhattan are structurally the same film \u2014 a woman from one world disguises herself to access another, falls in love, and has to decide whether the pretence is worth the cost.",
    hintData: {"films": [{"year": 1989, "genre": "Animated Fantasy", "actors": ["Jodi Benson", "Pat Carroll"]}, {"year": 2002, "genre": "Romantic Comedy", "actors": ["Jennifer Lopez", "Ralph Fiennes"]}]},
  },
  {
    id: 56,
    mashedTitle: "Uncut Gemini Man",
    mashedPlot: "With his debts piling up and angry collectors on his trail, a fast-talking New York City jeweller risks everything to stay alive. Meanwhile, an over-the-hill hitman is sent to take him out, only to come face-to-face with a younger clone of himself.",
    movies: ["Uncut Gems", "Gemini Man"],
    aliases: [["uncut gems"], ["gemini man"]],
    hints: ["Both films are about a man being hunted by a version of himself \u2014 one a clone, one his own past decisions.", "One is an Adam Sandler thriller; the other a Will Smith action film.", "Think: Adam Sandler meets Will Smith and young Will Smith."],
    difficulty: "Medium",
    difficultyReason: "The shared word 'Gem' requires a moment to see",
    connection: "Uncut Gems and Gemini Man are both films about a man confronted by a dangerous reflection of himself \u2014 one a literal younger clone, one a lifetime of bad choices coming due.",
    hintData: {"films": [{"year": 2019, "genre": "Crime Thriller", "actors": ["Adam Sandler", "Julia Fox"]}, {"year": 2019, "genre": "Action Sci-Fi", "actors": ["Will Smith", "Mary Elizabeth Winstead"]}]},
  },
  {
    id: 57,
    mashedTitle: "Vanilla Skyfall",
    mashedPlot: "A publishing heir's charmed life collapses when a jealous lover engineers a crash that leaves his face disfigured. When he awakens, he believes he is a secret agent back on duty after a mission that left him presumed dead. Tasked with stopping a cyberterrorist targeting MI6, he struggles with a fractured identity as dreams, memories, and hallucinations merge. At his childhood home, he must choose between a comforting illusion and a harsh reality.",
    movies: ["Vanilla Sky", "Skyfall"],
    aliases: [["vanilla sky"], ["skyfall", "james bond skyfall"]],
    hints: ["Both films are about a man who cannot tell the difference between the life he is living and the life he has constructed in his mind.", "One is a Tom Cruise mind-bending drama; the other the Bond film that took 007 back to his origins.", "Think: Tom Cruise meets Daniel Craig."],
    difficulty: "Hard",
    difficultyReason: "The thematic link between identity fracture and espionage is subtle",
    connection: "Vanilla Sky and Skyfall are both films about a man who retreats to a constructed past when the present becomes unbearable \u2014 one through a dream, one through Skyfall manor.",
    hintData: {"films": [{"year": 2001, "genre": "Psychological Thriller", "actors": ["Tom Cruise", "Pen\u00e9lope Cruz"]}, {"year": 2012, "genre": "Action/Spy", "actors": ["Daniel Craig", "Judi Dench"]}]},
  },
  {
    id: 58,
    mashedTitle: "Waterworld War Z",
    mashedPlot: "In a future where Earth is almost entirely covered in water, a UN investigator navigates the endless oceans in a race against time to stop a zombie pandemic.",
    movies: ["Waterworld", "World War Z"],
    aliases: [["waterworld"], ["world war z", "wwz"]],
    hints: ["One is a Kevin Costner aquatic epic; the other a Brad Pitt zombie thriller.", "Both films are about a lone survivor racing across a devastated world to find a solution.", "Think: Kevin Costner meets Brad Pitt \u2014 on a very wet set."],
    difficulty: "Easy",
    difficultyReason: "Both are well-known blockbusters and the wordplay is clean",
    connection: "Waterworld and World War Z are both global disaster films about a lone man crossing an inhospitable world to save what remains of humanity \u2014 one from flooding, one from the undead.",
    hintData: {"films": [{"year": 1995, "genre": "Sci-Fi Action", "actors": ["Kevin Costner", "Dennis Hopper"]}, {"year": 2013, "genre": "Action Horror", "actors": ["Brad Pitt", "Mireille Enos"]}]},
  },
  {
    id: 59,
    mashedTitle: "Wild at Braveheart",
    mashedPlot: "Scottish warrior William Wallace and a young American woman are on the run from King Edward I, who has hired a host of violent, eccentric characters to kill them. Instead of running, they decide to lead his countrymen in a rebellion to free his homeland.",
    movies: ["Wild at Heart", "Braveheart"],
    aliases: [["wild at heart"], ["braveheart", "brave heart"]],
    hints: ["One is a David Lynch road movie about outlaws in love; the other Mel Gibson's Scottish epic.", "Both films are about a man whose love drives him to defy overwhelming authority.", "Think: Nicolas Cage meets Mel Gibson in a kilt."],
    difficulty: "Hard",
    difficultyReason: "Wild at Heart is a cult Lynch film that requires film knowledge",
    connection: "Wild at Heart and Braveheart are both films about men whose passionate, reckless love leads them into violent confrontation with a powerful system \u2014 one across the American South, one across Scotland.",
    hintData: {"films": [{"year": 1990, "genre": "Crime Romance", "actors": ["Nicolas Cage", "Laura Dern"]}, {"year": 1995, "genre": "Historical Epic", "actors": ["Mel Gibson", "Sophie Marceau"]}]},
  },
  {
    id: 60,
    mashedTitle: "XXX-Men",
    mashedPlot: "An extreme sports rebel recruited by the US government to carry out a dangerous undercover mission is joined by a group of genetically gifted mutants, led by a Professor, as they struggle to protect a world that fears and hates them.",
    movies: ["XXX", "X-Men"],
    aliases: [["xxx", "triple x", "vin diesel xxx"], ["x-men", "xmen", "x men"]],
    hints: ["One is a Vin Diesel action film about extreme sports; the other the definitive Marvel mutant franchise.", "Both feature outsiders recruited into a secret government or paramilitary operation.", "Xander Cage meets Professor X."],
    difficulty: "Easy",
    difficultyReason: "Both are blockbusters and the X connection is immediately clear",
    connection: "XXX and X-Men are both films about people who exist outside society's rules being recruited to defend the very society that rejects them.",
    hintData: {"films": [{"year": 2002, "genre": "Action", "actors": ["Vin Diesel", "Asia Argento"]}, {"year": 2000, "genre": "Superhero Action", "actors": ["Hugh Jackman", "Patrick Stewart"]}]},
  },
  {
    id: 61,
    mashedTitle: "Y Tu Mamma Mia!",
    mashedPlot: "In Mexico, two teenage boys and an older woman set out on a road trip to a Greek island after being invited to a wedding, where the bride has invited three men to determine which of them is her true father.",
    movies: ["Y Tu Mam\u00e1 Tambi\u00e9n", "Mamma Mia!"],
    aliases: [["y tu mama tambien", "y tu mam\u00e1 tambi\u00e9n", "y tu mama"], ["mamma mia", "mamma mia!"]],
    hints: ["One is Alfonso Cuar\u00f3n's Mexican coming-of-age road movie; the other an ABBA-soundtracked musical comedy.", "Both films are about a woman on a journey between multiple men, none of whom fully understands her.", "Think: Gael Garc\u00eda Bernal meets Meryl Streep and Pierce Brosnan."],
    difficulty: "Medium",
    difficultyReason: "Y Tu Mam\u00e1 Tambi\u00e9n is acclaimed but requires familiarity with world cinema",
    connection: "Y Tu Mam\u00e1 Tambi\u00e9n and Mamma Mia! are both films about a woman navigating the complications of men in her life during a journey to somewhere beautiful \u2014 one bittersweet, one euphoric.",
    hintData: {"films": [{"year": 2001, "genre": "Coming-of-Age Drama", "actors": ["Gael Garc\u00eda Bernal", "Diego Luna"]}, {"year": 2008, "genre": "Musical Comedy", "actors": ["Meryl Streep", "Pierce Brosnan"]}]},
  },
  {
    id: 62,
    mashedTitle: "Zero Dark Knight Thirty",
    mashedPlot: "A CIA analyst teams up with Batman to track down a terrorist mastermind over a decade-long manhunt culminating in a high-stakes raid where justice and vengeance collide.",
    movies: ["Zero Dark Thirty", "The Dark Knight"],
    aliases: [["zero dark thirty"], ["the dark knight", "dark knight", "batman dark knight"]],
    hints: ["One is Kathryn Bigelow's procedural about the hunt for Bin Laden; the other Christopher Nolan's Batman masterpiece.", "Both films are about the psychological cost of a relentless hunt for a charismatic terrorist.", "Think: Jessica Chastain meets Christian Bale."],
    difficulty: "Medium",
    difficultyReason: "The thematic parallel between obsessive manhunts is the insight",
    connection: "Zero Dark Thirty and The Dark Knight are both films about the cost of hunting a brilliant, theatrical terrorist \u2014 and both ask whether the methods used to catch them make the hunters monstrous too.",
    hintData: {"films":[{"year":2012,"genre":"War Thriller","actors":["Jessica Chastain","Jason Clarke"]},{"year":2008,"genre":"Action Drama","actors":["Christian Bale","Heath Ledger"]}]},
  },
  {
    id: 63,
    mashedTitle: "Rashomoneyball",
    mashedPlot: "When a star Oakland Athletics pitcher is found dead under mysterious circumstances, three witnesses — his agent, his wife, and a scout — each give completely different accounts of what happened. The team's general manager, armed with a radical new statistical theory, must sift through their contradictory testimonies to rebuild a contender on a shoestring budget.",
    movies: ["Rashomon", "Moneyball"],
    aliases: [["Rashômon"], ["Money Ball"]],
    hints: ["One is a 1950 Japanese masterpiece about the nature of truth. The other is about baseball and Brad Pitt.", "One was directed by Akira Kurosawa. The other stars Jonah Hill as an analytics nerd.", "Rashomon meets a story about Oakland's 2002 season."],
    difficulty: "Hard",
    difficultyReason: "Rashomon is a classic but not mainstream — this rewards film-literate players",
    connection: "Both films are fundamentally about perspective and truth — Rashomon through contradictory witness accounts, Moneyball through challenging conventional wisdom about what the numbers actually say.",
    hintData: {"films":[{"year":1950,"genre":"Drama / Mystery","actors":["Toshiro Mifune","Machiko Kyo"]},{"year":2011,"genre":"Sports Drama","actors":["Brad Pitt","Jonah Hill"]}]}
  },
  {
    id: 64,
    mashedTitle: "The Breakfast at Tiffany's Club",
    mashedPlot: "Five mismatched teenagers — a princess, a jock, a brain, a basket case, and a criminal — are sentenced to Saturday detention at an upscale Manhattan jewelry store. As the day wears on, they bond over champagne, croissants, and the shared realization that they're all lonely behind their carefully constructed facades.",
    movies: ["The Breakfast Club", "Breakfast at Tiffany's"],
    aliases: [["Breakfast Club"], ["Breakfast at Tiffanys", "Tiffanys"]],
    hints: ["One is a 1985 John Hughes teen classic. The other stars Audrey Hepburn and a cat with no name.", "One takes place entirely in a high school library. The other opens with a woman eating a pastry outside a jewelry store at 5am.", "The Breakfast Club meets a New York socialite named Holly Golightly."],
    difficulty: "Easy",
    difficultyReason: "Both films are extremely well-known and the mashed title is immediately obvious once you have either one",
    connection: "Both films are ultimately about people who perform a version of themselves for the world while hiding who they really are — one in a single Saturday, one over a Manhattan autumn.",
    hintData: {"films":[{"year":1985,"genre":"Teen Drama / Comedy","actors":["Molly Ringwald","Judd Nelson","Emilio Estevez"]},{"year":1961,"genre":"Romantic Comedy / Drama","actors":["Audrey Hepburn","George Peppard"]}]}
  },
  {
    id: 65,
    mashedTitle: "Lost in Transformers",
    mashedPlot: "A washed-up American action star travels to Tokyo to film a commercial for giant alien robots. Jet-lagged and adrift in a neon-lit megacity he doesn't understand, he strikes up an unlikely friendship with a young married woman — until the robots attack and they must flee across the city together.",
    movies: ["Lost in Translation", "Transformers"],
    aliases: [["Lost in Translations"], ["Transformer"]],
    hints: ["One is a quiet, melancholy Sofia Coppola film set in Tokyo. The other involves Shia LaBeouf and very loud explosions.", "One stars Bill Murray and Scarlett Johansson barely sleeping. The other stars Megan Fox running in slow motion.", "A lonely hotel bar in Tokyo meets Autobots and Decepticons."],
    difficulty: "Easy",
    difficultyReason: "The tonal contrast between these two films makes the mash immediately funny and recognizable",
    connection: "Both films are set in a world that feels overwhelming and foreign to their protagonists — one emotionally, one quite literally under alien attack.",
    hintData: {"films":[{"year":2003,"genre":"Drama / Romance","actors":["Bill Murray","Scarlett Johansson"]},{"year":2007,"genre":"Sci-Fi Action","actors":["Shia LaBeouf","Megan Fox"]}]}
  },
  {
    id: 66,
    mashedTitle: "Little Miss Eternal Sunshine",
    mashedPlot: "After a painful breakup, a man agrees to join his dysfunctional family on a cross-country road trip in a broken-down VW bus so his daughter can compete in a children's beauty pageant. Along the way, he undergoes a secret medical procedure to erase every memory of his ex-girlfriend — only to realize, somewhere in New Mexico, that he wants them back.",
    movies: ["Little Miss Sunshine", "Eternal Sunshine of the Spotless Mind"],
    aliases: [["Little Miss Sunshine"], ["Eternal Sunshine", "Eternal Sunshine of a Spotless Mind", "Eternal Sunshine of the Spotless Mind"]],
    hints: ["One is a 2006 road trip film about a little girl's dream. The other stars Jim Carrey having his memories erased.", "One features Alan Arkin, Steve Carell, and a VW bus that won't start. The other features Kate Winslet with blue hair.", "A dysfunctional family road trip meets a memory-erasure procedure."],
    difficulty: "Medium",
    difficultyReason: "Both films are beloved but the connection between them isn't obvious — takes a moment of lateral thinking",
    connection: "Both films are about people desperately holding onto something — one a child's dream, the other a relationship — against circumstances that keep trying to take it away.",
    hintData: {"films":[{"year":2006,"genre":"Comedy / Drama","actors":["Abigail Breslin","Steve Carell","Alan Arkin"]},{"year":2004,"genre":"Sci-Fi Romance","actors":["Jim Carrey","Kate Winslet"]}]}
  },
  {
    id: 67,
    mashedTitle: "Black Swan Down",
    mashedPlot: "An obsessive ballerina prepares for the role of a lifetime as both the White and Black Swan in Swan Lake. During opening night, her grip on reality begins to fracture — and her performance is interrupted when the theater is suddenly surrounded by U.S. Army Rangers pinned down in an unexpected and brutal battle.",
    movies: ["Black Swan", "Black Hawk Down"],
    aliases: [["Blackswan", "Black Swan Film"], ["Black Hawk", "Blackhawk Down"]],
    hints: ["One is a 2010 Darren Aronofsky psychological thriller. The other is a 2001 Ridley Scott war film.", "One stars Natalie Portman slowly losing her mind in New York. The other is based on the 1993 Battle of Mogadishu.", "A ballet dancer's descent into madness meets one of cinema's most harrowing combat sequences."],
    difficulty: "Medium",
    difficultyReason: "Both films are well-known but the connection requires recognizing the 'Black' in both titles",
    connection: "Both films are about people pushed beyond human limits — one by artistic perfectionism, one by the chaos of combat — until they can't tell what's real anymore.",
    hintData: {"films":[{"year":2010,"genre":"Psychological Thriller","actors":["Natalie Portman","Mila Kunis"]},{"year":2001,"genre":"War / Action","actors":["Josh Hartnett","Ewan McGregor"]}]}
  },
  {
    id: 68,
    mashedTitle: "We Bought a Zoolander",
    mashedPlot: "A widowed journalist moves his family to a dilapidated wildlife park and slowly renovates it back to life. Meanwhile, he uncovers a sinister plot by a flamboyant fashion mogul to brainwash the world's most beautiful animals into becoming the perfect assassins.",
    movies: ["We Bought a Zoo", "Zoolander"],
    aliases: [["We Bought Zoo"], ["Zoolander 1"]],
    hints: ["One is a 2011 Cameron Crowe family drama starring Matt Damon. The other is a 2001 comedy starring Ben Stiller as a dimwitted supermodel.", "One is heartwarming and features actual animals. The other features a look called Blue Steel.", "A struggling zoo meets the world's most dangerous male model."],
    difficulty: "Easy",
    difficultyReason: "Both films are instantly recognizable and the premise mashup is absurd in the best possible way",
    connection: "Both films are about men who are completely out of their depth trying to make something work — one a grieving dad with a zoo, one a model who can't turn left.",
    hintData: {"films":[{"year":2011,"genre":"Family Drama","actors":["Matt Damon","Scarlett Johansson"]},{"year":2001,"genre":"Comedy","actors":["Ben Stiller","Owen Wilson"]}]}
  },
  {
    id: 69,
    mashedTitle: "The Fault in Our Star Wars",
    mashedPlot: "Two teenagers meet at a cancer support group in Indianapolis and fall deeply in love. When they travel to Amsterdam to meet a reclusive author, they discover he has secretly been recruited by the Rebel Alliance — and that the only way to save their relationship is to destroy the Death Star.",
    movies: ["The Fault in Our Stars", "Star Wars"],
    aliases: [["Fault in Our Stars", "The Fault In Our Stars"], ["Star Wars A New Hope", "Star Wars Episode 4", "Episode IV", "A New Hope"]],
    hints: ["One is a 2014 teen romance based on a John Green novel. The other is a 1977 space opera that changed cinema forever.", "One stars Shailene Woodley and Ansel Elgort. The other stars Mark Hamill, Harrison Ford and Carrie Fisher.", "A terminal cancer diagnosis meets the Force, lightsabers, and a galaxy far, far away."],
    difficulty: "Easy",
    difficultyReason: "Both films are massively well-known and the title mashup writes itself — players will laugh the moment they see the answer",
    connection: "Both films are fundamentally about young people confronting impossible odds — one against illness, one against an evil empire — and choosing love and hope anyway.",
    hintData: {"films":[{"year":2014,"genre":"Romantic Drama","actors":["Shailene Woodley","Ansel Elgort"]},{"year":1977,"genre":"Sci-Fi Adventure","actors":["Mark Hamill","Harrison Ford","Carrie Fisher"]}]}
  },
  {
    id: 70,
    mashedTitle: "Independence Groundhog Day",
    mashedPlot: "A cocky fighter pilot wakes up on July 4th to find Earth under attack by a massive alien invasion fleet. He joins the resistance, helps destroy an alien mothership — then wakes up on July 4th again. And again. Every time he dies fighting the aliens, the day resets, and he has to find a new way to save humanity from scratch.",
    movies: ["Independence Day", "Groundhog Day"],
    aliases: [["Independence Day Film", "ID4"], ["Groundhog Day Film", "Ground Hog Day"]],
    hints: ["One is a 1996 alien invasion blockbuster starring Will Smith. The other is a 1993 comedy about a man stuck repeating the same day.", "One has Bill Pullman delivering a presidential speech. The other has Bill Murray stuck in Punxsutawney, Pennsylvania.", "Will Smith punching an alien meets Bill Murray punching Ned Ryerson — over and over again."],
    difficulty: "Medium",
    difficultyReason: "Both films are iconic but the time-loop twist makes this description trickier to parse — players might not immediately clock the Groundhog Day connection",
    connection: "Both films are about men forced to repeat a single day until they get it right — one by alien invasion mechanics, one by unexplained cosmic forces — and both end with the hero finally breaking the cycle.",
    hintData: {"films":[{"year":1996,"genre":"Sci-Fi Action","actors":["Will Smith","Bill Pullman","Jeff Goldblum"]},{"year":1993,"genre":"Comedy / Fantasy","actors":["Bill Murray","Andie MacDowell"]}]}
  },
  {
    id: 71,
    mashedTitle: "The Princess Bride of Frankenstein",
    mashedPlot: "A farm boy storms a castle to rescue the love of his life, only to find she has been struck by lightning, stitched together from corpses, and brought back to life by a brilliant but unhinged scientist. She does not want to be rescued and the farm boy is deeply reconsidering the relationship.",
    movies: ["The Princess Bride", "Bride of Frankenstein"],
    aliases: [["Princess Bride"], ["Bride of Frankenstein 1935"]],
    hints: ["One is a 1987 fairy tale with a farm boy, a Sicilian, and a giant. The other is a 1935 Universal horror classic.", "One features Inigo Montoya and his six-fingered man. The other features Boris Karloff and Elsa Lanchester with streaked hair.", "Westley meets the Monster — both just want their bride."],
    difficulty: "Medium",
    difficultyReason: "The Princess Bride is universally known but Bride of Frankenstein is a classic that younger players may not place immediately",
    connection: "Both films are ultimately romantic — a hero doing anything to win back the woman he loves, and a monster so lonely he just wants someone to sit beside him.",
    hintData: {"films":[{"year":1987,"genre":"Fantasy / Adventure / Romance","actors":["Cary Elwes","Robin Wright","Mandy Patinkin"]},{"year":1935,"genre":"Horror / Classic","actors":["Boris Karloff","Elsa Lanchester","Colin Clive"]}]}
  },
  {
    id: 72,
    mashedTitle: "Mulholland Driving Miss Daisy",
    mashedPlot: "An aging Southern Jewish widow hires a chauffeur to drive her through Los Angeles, unaware that the mysterious woman who keeps climbing into the back seat is a failed actress living inside someone else's identity.",
    movies: ["Mulholland Drive", "Driving Miss Daisy"],
    aliases: [["Mulholland Dr", "Mulholland Dr."], ["Driving Miss Daisy Film"]],
    hints: ["One is a 1989 Oscar-winning drama about an elderly woman and her chauffeur in Atlanta. The other is a 2001 David Lynch fever dream set in Hollywood.", "One stars Jessica Tandy and Morgan Freeman. The other stars Naomi Watts and Laura Harring.", "A gentle road movie collides with Lynch's most disorienting masterpiece."],
    difficulty: "Hard",
    difficultyReason: "Mulholland Drive is a cinephile touchstone — casual viewers may not place it from the plot alone",
    connection: "Both films are about women navigating a world they don't fully control — one through aging and dependence, one through a fractured identity she can't piece together.",
    hintData: {"films":[{"year":2001,"genre":"Mystery / Thriller","actors":["Naomi Watts","Laura Harring"]},{"year":1989,"genre":"Drama","actors":["Jessica Tandy","Morgan Freeman"]}]}
  },
  {
    id: 73,
    mashedTitle: "Crazy Stupid Love Actually",
    mashedPlot: "A recently divorced middle-aged man is taught the art of seduction by a smooth-talking stranger, only to discover by Christmas that every woman he has approached is already part of the same tangled web of overlapping London romances involving a Prime Minister, a grieving widower, and his own best friend's wife.",
    movies: ["Crazy, Stupid, Love.", "Love Actually"],
    aliases: [["Crazy Stupid Love"], ["Love Actually Film"]],
    hints: ["One is a 2011 American rom-com starring Steve Carell and Ryan Gosling. The other is a 2003 British ensemble holiday classic.", "One features a pickup artist montage in a bar. The other features Hugh Grant, Colin Firth, and a lot of Heathrow Airport.", "A smooth American playboy meets a very British Christmas."],
    difficulty: "Easy",
    difficultyReason: "Both are massively popular rom-coms and Love Actually is one of the most recognised films ever made",
    connection: "Both films argue that love makes fools of everyone — and that the embarrassing, messy, desperate kind of love is the only kind worth having.",
    hintData: {"films":[{"year":2011,"genre":"Romantic Comedy","actors":["Steve Carell","Ryan Gosling","Emma Stone"]},{"year":2003,"genre":"Romantic Comedy","actors":["Hugh Grant","Colin Firth","Emma Thompson"]}]}
  },
  {
    id: 74,
    mashedTitle: "The Devil Wears Pride and Prejudice",
    mashedPlot: "A sharp young woman from a poor early-1800s family takes a grueling job at a prestigious fashion house in London to help secure her sisters' futures, and finds herself slowly falling for the cold, arrogant editor who runs it despite every instinct telling her not to.",
    movies: ["The Devil Wears Prada", "Pride and Prejudice"],
    aliases: [["Devil Wears Prada"], ["Pride and Prejudice 2005", "Pride & Prejudice"]],
    hints: ["One is a 2006 fashion comedy starring Meryl Streep and Anne Hathaway. The other is Jane Austen's most beloved novel adapted to film.", "One features a terrifying editor named Miranda Priestly. The other features Mr. Darcy and the Bennet sisters.", "Meryl Streep meets Mr. Darcy — both equally impossible to impress."],
    difficulty: "Easy",
    difficultyReason: "Both are hugely popular films with massive cultural footprints — the title pun is immediately satisfying",
    connection: "Both are comedies of manners about sharp young women navigating rigid social hierarchies dominated by powerful, judgmental figures — and refusing to be diminished by them.",
    hintData: {"films":[{"year":2006,"genre":"Comedy / Drama","actors":["Meryl Streep","Anne Hathaway","Emily Blunt"]},{"year":2005,"genre":"Period Romance","actors":["Keira Knightley","Matthew Macfadyen"]}]}
  },
  {
    id: 75,
    mashedTitle: "The Lion King's Speech",
    mashedPlot: "A young lion cub falsely blamed for his father's death is cast out of his kingdom and grows up in exile, only to return as an adult with a debilitating stutter that an unconventional therapist must cure before he can deliver the speech that will reclaim his throne.",
    movies: ["The Lion King", "The King's Speech"],
    aliases: [["Lion King", "The Lion King 1994"], ["Kings Speech"]],
    hints: ["One is a 1994 Disney animated classic. The other is a 2010 Oscar-winning historical drama.", "One features Jeremy Irons as the villain and Elton John on the soundtrack. The other features Colin Firth as King George VI and Geoffrey Rush as his therapist.", "Simba meets Bertie — two reluctant kings who need to find their voice."],
    difficulty: "Easy",
    difficultyReason: "Both films are extremely well-known and the title splice is perfectly clean — players will get it immediately",
    connection: "Both are stories about a king who doesn't believe he deserves the throne, forced by circumstance to step into a role he fears — and finding his voice just when his people need it most.",
    hintData: {"films":[{"year":1994,"genre":"Animated Drama","actors":["Matthew Broderick","Jeremy Irons","James Earl Jones"]},{"year":2010,"genre":"Historical Drama","actors":["Colin Firth","Geoffrey Rush","Helena Bonham Carter"]}]}
  },
  {
    id: 76,
    mashedTitle: "My Big Fat Greek Wedding Crashers",
    mashedPlot: "Two charming fraudsters crash a boisterous Greek-American family wedding expecting a fun evening, and are instead spritzed with Windex, introduced to sixty relatives, and informed by the patriarch that everything in the world can be traced back to a Greek root word, including their obvious feelings for his daughter.",
    movies: ["My Big Fat Greek Wedding", "Wedding Crashers"],
    aliases: [["My Big Fat Greek Wedding Film", "Big Fat Greek Wedding"], ["Wedding Crashers Film"]],
    hints: ["One is a 2002 low-budget rom-com that became a massive surprise hit. The other is a 2005 comedy starring Owen Wilson and Vince Vaughn.", "One features a Greek family who believes Windex cures everything. The other features two men who sneak into strangers' weddings.", "Toula's family versus Owen Wilson — only one of them is leaving with a gyro."],
    difficulty: "Easy",
    difficultyReason: "Both are beloved comedies about chaotic weddings and both titles are instantly recognisable",
    connection: "Both films are about outsiders being absorbed — lovingly, chaotically, inescapably — into a family culture that operates by its own logic entirely.",
    hintData: {"films":[{"year":2002,"genre":"Romantic Comedy","actors":["Nia Vardalos","John Corbett"]},{"year":2005,"genre":"Comedy","actors":["Owen Wilson","Vince Vaughn","Rachel McAdams"]}]}
  },
  {
    id: 77,
    mashedTitle: "The Nightmare Before Christmas Story",
    mashedPlot: "A bespectacled boy in 1940s Indiana wants nothing more than a BB gun for Christmas, which becomes significantly harder to obtain after the ruler of Halloween Town deposes Santa Claus and takes over the holiday.",
    movies: ["The Nightmare Before Christmas", "A Christmas Story"],
    aliases: [["Nightmare Before Christmas", "Tim Burton Nightmare"], ["Christmas Story Film", "A Christmas Story 1983"]],
    hints: ["One is a 1993 Tim Burton stop-motion animated musical. The other is a beloved 1983 holiday comedy about a boy and his dream gift.", "One features Jack Skellington and Sally. The other features Ralphie Parker and a leg lamp.", "Halloween meets 1940s nostalgia — both are cult Christmas classics."],
    difficulty: "Easy",
    difficultyReason: "Both are iconic Christmas films with enormous fan bases — the title combination is immediately obvious and satisfying",
    connection: "Both films are about someone who wants something so badly at Christmas that they lose sight of what the season actually means — one a boy, one a king made of bones.",
    hintData: {"films":[{"year":1993,"genre":"Animated Musical / Fantasy","actors":["Danny Elfman","Chris Sarandon","Catherine O'Hara"]},{"year":1983,"genre":"Comedy / Family","actors":["Peter Billingsley","Melinda Dillon","Darren McGavin"]}]}
  },
  {
    id: 78,
    mashedTitle: "It's a Wonderful Life of Pi",
    mashedPlot: "A despairing small-town man on the verge of suicide is visited by a bumbling guardian angel who has just survived months adrift on a lifeboat with a Bengal tiger and is, if anything, even more grateful to be alive.",
    movies: ["It's a Wonderful Life", "Life of Pi"],
    aliases: [["Its a Wonderful Life", "Wonderful Life"], ["Life of Pi Film"]],
    hints: ["One is Frank Capra's 1946 Christmas masterpiece starring Jimmy Stewart. The other is Ang Lee's 2012 survival epic.", "One features an angel named Clarence earning his wings. The other features a Bengal tiger named Richard Parker.", "Bedford Falls meets the Pacific Ocean — both are about finding the will to live."],
    difficulty: "Medium",
    difficultyReason: "Both films are well-known but the connection isn't obvious at first — the shared word 'Life' does a lot of work",
    connection: "Both films are fundamentally about a man who has given up on life being shown, through extraordinary circumstances, that his existence has more meaning than he realised.",
    hintData: {"films":[{"year":1946,"genre":"Drama / Fantasy","actors":["James Stewart","Donna Reed","Henry Travers"]},{"year":2012,"genre":"Adventure / Drama","actors":["Suraj Sharma","Irrfan Khan"]},]}
  },
  {
    id: 79,
    mashedTitle: "Million Dollar Baby Driver",
    mashedPlot: "A grizzled boxing trainer reluctantly takes on a fierce young woman who moonlights as a getaway driver, treating each bout like a heist and each heist like a championship fight.",
    movies: ["Million Dollar Baby", "Baby Driver"],
    aliases: [["Million Dollar Baby Film"], ["Baby Driver Film"]],
    hints: ["One is a 2004 Clint Eastwood boxing drama that won Best Picture. The other is a 2017 Edgar Wright action thriller with an incredible soundtrack.", "One stars Hilary Swank as a determined boxer. The other stars Ansel Elgort as a getaway driver who listens to music to drown out his tinnitus.", "A boxing gym meets a getaway car — both protagonists are called Baby."],
    difficulty: "Easy",
    difficultyReason: "Both films are well-known and the shared word Baby makes the title splice immediately satisfying",
    connection: "Both films are about young people with a rare physical gift being guided — and ultimately let down — by an older mentor figure who sees something of themselves in their protege.",
    hintData: {"films":[{"year":2004,"genre":"Sports Drama","actors":["Clint Eastwood","Hilary Swank","Morgan Freeman"]},{"year":2017,"genre":"Action / Crime","actors":["Ansel Elgort","Kevin Spacey","Jamie Foxx"]}]}
  },
  {
    id: 80,
    mashedTitle: "Twelve Angry Monkeys",
    mashedPlot: "Twelve jurors are locked in a room to decide the fate of a disheveled young man who insists he is a time traveler sent from a plague-ravaged future to prevent the release of a virus that will kill five billion people.",
    movies: ["12 Angry Men", "12 Monkeys"],
    aliases: [["Twelve Angry Men", "12 Angry Men Film"], ["12 Monkeys Film", "Twelve Monkeys"]],
    hints: ["One is Sidney Lumet's 1957 courtroom masterpiece. The other is Terry Gilliam's 1995 time-travel thriller.", "One stars Henry Fonda as a lone dissenting juror. The other stars Bruce Willis as a time traveller and Brad Pitt as a mental patient.", "Both have exactly twelve in the title — one jury, one army."],
    difficulty: "Medium",
    difficultyReason: "12 Angry Men is a classic but younger players may need the actor hint to place it",
    connection: "Both films put a sane person in a room full of people who won't listen to reason, and ask whether one determined voice can change the outcome before it's too late.",
    hintData: {"films":[{"year":1957,"genre":"Drama / Courtroom","actors":["Henry Fonda","Lee J. Cobb","Ed Begley"]},{"year":1995,"genre":"Sci-Fi / Thriller","actors":["Bruce Willis","Brad Pitt","Madeleine Stowe"]}]}
  },
  {
    id: 81,
    mashedTitle: "There Will Be Blood Diamond",
    mashedPlot: "A ruthless oilman cuts a bloody path across West Africa looking for the next big strike, and finds it in the form of a rare pink diamond that a desperate father will do anything to recover before the oilman drinks his milkshake too.",
    movies: ["There Will Be Blood", "Blood Diamond"],
    aliases: [["There Will Be Blood Film"], ["Blood Diamond Film"]],
    hints: ["One is a 2007 Paul Thomas Anderson epic starring Daniel Day-Lewis. The other is a 2006 Edward Zwick thriller starring Leonardo DiCaprio.", "One features Daniel Plainview and a milkshake monologue. The other is set during Sierra Leone's civil war.", "Two films about men destroying everything around them in pursuit of a precious resource."],
    difficulty: "Medium",
    difficultyReason: "Both films are well-regarded but Blood Diamond is slightly less canonical — the shared word Blood makes the title obvious once you have both",
    connection: "Both films are about the catastrophic human cost of extraction — oil and diamonds — and the morally hollow men who profit from it.",
    hintData: {"films":[{"year":2007,"genre":"Drama / Epic","actors":["Daniel Day-Lewis","Paul Dano"]},{"year":2006,"genre":"Action / Drama","actors":["Leonardo DiCaprio","Djimon Hounsou","Jennifer Connelly"]}]}
  },
  {
    id: 82,
    mashedTitle: "Up in the Air Force One",
    mashedPlot: "A slick corporate downsizer who fires people for a living is en route to his next assignment when Russian terrorists seize the plane, and he spends the rest of the flight systematically terminating their employment one by one.",
    movies: ["Up in the Air", "Air Force One"],
    aliases: [["Up in the Air Film"], ["Air Force One Film"]],
    hints: ["One is a 2009 Jason Reitman drama starring George Clooney as a professional downsizer. The other is a 1997 action thriller starring Harrison Ford as the President.", "One features a man who lives in airports and hates commitment. The other features a President who won't leave his hijacked plane.", "George Clooney meets Harrison Ford at 35,000 feet."],
    difficulty: "Medium",
    difficultyReason: "Both are well-known films but the connection via Air requires a moment of lateral thinking",
    connection: "Both films are about a man who is supremely good at something that most people find terrifying — firing people, fighting terrorists — and who operates best when completely alone.",
    hintData: {"films":[{"year":2009,"genre":"Drama / Comedy","actors":["George Clooney","Vera Farmiga","Anna Kendrick"]},{"year":1997,"genre":"Action / Thriller","actors":["Harrison Ford","Gary Oldman","Glenn Close"]}]}
  },
  {
    id: 83,
    mashedTitle: "Star Wars of the Worlds",
    mashedPlot: "A dock worker in suburban New Jersey flees with his children as Martian war machines tear through the galaxy, destroying everything in their path until they encounter something no lightsaber could have stopped.",
    movies: ["Star Wars", "War of the Worlds"],
    aliases: [["Star Wars A New Hope", "Star Wars Episode IV", "A New Hope"], ["War of the Worlds 2005", "War of the Worlds Film"]],
    hints: ["One is George Lucas's 1977 space opera that changed cinema forever. The other is Steven Spielberg's 2005 alien invasion film starring Tom Cruise.", "One features Luke Skywalker, Princess Leia, and the Death Star. The other features Tom Cruise running from tripods with his estranged daughter.", "The most iconic sci-fi franchise collides with H.G. Wells's alien invasion classic."],
    difficulty: "Easy",
    difficultyReason: "Both are massively famous sci-fi films and the shared word War makes the title splice immediately obvious",
    connection: "Both films are about ordinary people — and one very extraordinary hero — caught in an invasion they have no power to stop, saved ultimately by factors entirely beyond their control.",
    hintData: {"films":[{"year":1977,"genre":"Sci-Fi / Adventure","actors":["Mark Hamill","Harrison Ford","Carrie Fisher"]},{"year":2005,"genre":"Sci-Fi / Thriller","actors":["Tom Cruise","Dakota Fanning","Tim Robbins"]}]}
  },
  {
    id: 84,
    mashedTitle: "The Sixth Sense and Sensibility",
    mashedPlot: "A child psychologist is called to treat a quiet, troubled boy at a crumbling English country estate, where the boy claims he can see the dead and the recently deceased master of the house is still very much weighing in on his daughters' marriage prospects.",
    movies: ["The Sixth Sense", "Sense and Sensibility"],
    aliases: [["Sixth Sense", "The Sixth Sense Film"], ["Sense and Sensibility Film", "Sense & Sensibility"]],
    hints: ["One is M. Night Shyamalan's 1999 supernatural thriller with one of cinema's most famous twists. The other is Ang Lee's 1995 Jane Austen adaptation.", "One stars Bruce Willis and Haley Joel Osment. The other stars Emma Thompson and Kate Winslet.", "A ghost story meets Regency England — both hinge on a revelation you didn't see coming."],
    difficulty: "Medium",
    difficultyReason: "Both films are well-known but the connection via Sense requires spotting the shared word across two very different genres",
    connection: "Both films are built around a devastating revelation withheld until the final act — one supernatural, one romantic — that reframes everything the audience thought they understood.",
    hintData: {"films":[{"year":1999,"genre":"Supernatural Thriller","actors":["Bruce Willis","Haley Joel Osment","Toni Collette"]},{"year":1995,"genre":"Period Romance","actors":["Emma Thompson","Kate Winslet","Hugh Grant"]}]}
  },
  {
    id: 85,
    mashedTitle: "Get Out of Africa",
    mashedPlot: "A young Black man travels to a remote Kenyan coffee plantation to meet his white girlfriend's colonial family, where the locals smile too widely, the guests sit very still at dinner, and the lush landscape feels increasingly like a trap.",
    movies: ["Get Out", "Out of Africa"],
    aliases: [["Get Out Film"], ["Out of Africa Film"]],
    hints: ["One is Jordan Peele's 2017 horror masterpiece. The other is Sydney Pollack's 1985 romantic epic starring Meryl Streep and Robert Redford.", "One is set in suburban America at a white family's estate. The other is set in colonial Kenya on a coffee farm.", "A modern horror film collides with a sweeping Old Hollywood romance — both set on someone else's land."],
    difficulty: "Medium",
    difficultyReason: "Get Out is extremely well-known but Out of Africa skews older — younger players may need the actor hint",
    connection: "Both films are about a person who travels to a beautiful, unfamiliar place and slowly realises the idyllic surroundings conceal something deeply sinister about who actually belongs there.",
    hintData: {"films":[{"year":2017,"genre":"Horror / Thriller","actors":["Daniel Kaluuya","Allison Williams","Bradley Whitford"]},{"year":1985,"genre":"Romantic Drama / Epic","actors":["Meryl Streep","Robert Redford"]}]}
  },
  {
    id: 86,
    mashedTitle: "A Quiet Place Beyond the Pines",
    mashedPlot: "A motorcycle stuntman quietly robs banks across upstate New York to provide for a child he barely knows, in a valley now patrolled by creatures that hunt entirely by sound.",
    movies: ["A Quiet Place", "The Place Beyond the Pines"],
    aliases: [["A Quiet Place Film", "Quiet Place"], ["Place Beyond the Pines", "Place Beyond Pines"]],
    hints: ["One is John Krasinski's 2018 horror film about a family surviving in silence. The other is Derek Cianfrance's 2012 crime drama starring Ryan Gosling.", "One features creatures that hunt by sound. The other features a motorcycle bank robber with face tattoos.", "A family hiding in silence meets a man who can't stop making noise."],
    difficulty: "Hard",
    difficultyReason: "The Place Beyond the Pines is a cinephile favourite but not as widely seen — the shared word Place is the key",
    connection: "Both films are about fathers doing desperate, dangerous things to provide for children they barely know — and the generational consequences that echo down the years.",
    hintData: {"films":[{"year":2018,"genre":"Horror / Sci-Fi","actors":["Emily Blunt","John Krasinski","Millicent Simmonds"]},{"year":2012,"genre":"Crime Drama","actors":["Ryan Gosling","Eva Mendes","Bradley Cooper"]}]}
  },
  {
    id: 87,
    mashedTitle: "Slumdog Million Dollar Baby",
    mashedPlot: "A street kid from the Mumbai slums claws his way into a boxing gym the same way he survived childhood: by refusing every question life throws at him until the answer lands.",
    movies: ["Slumdog Millionaire", "Million Dollar Baby"],
    aliases: [["Slumdog Millionaire Film"], ["Million Dollar Baby Film"]],
    hints: ["One is Danny Boyle's 2008 Best Picture winner set in Mumbai. The other is Clint Eastwood's 2004 Best Picture winner about boxing.", "One stars Dev Patel on a quiz show. The other stars Hilary Swank in a boxing ring.", "Two Best Picture winners about underdogs from impossible circumstances — one quiz, one bout."],
    difficulty: "Medium",
    difficultyReason: "Both are hugely famous films and the shared word Million makes the splice clean — but players need to hold both titles in mind at once",
    connection: "Both are relentless underdog stories about people from nothing who achieve something extraordinary — and both end in a way that refuses to let the audience off the hook emotionally.",
    hintData: {"films":[{"year":2008,"genre":"Drama / Romance","actors":["Dev Patel","Freida Pinto","Anil Kapoor"]},{"year":2004,"genre":"Sports Drama","actors":["Hilary Swank","Clint Eastwood","Morgan Freeman"]}]}
  },
  {
    id: 88,
    mashedTitle: "Boogie Nights of the Living Dead",
    mashedPlot: "A charismatic young man with a gift that makes him a star in the San Fernando Valley adult film industry in 1977 finds his career complicated by a zombie outbreak that the studio is doing its best to shoot around.",
    movies: ["Boogie Nights", "Night of the Living Dead"],
    aliases: [["Boogie Nights Film"], ["Night of the Living Dead Film", "Night of Living Dead"]],
    hints: ["One is Paul Thomas Anderson's 1997 epic about the adult film industry's golden age. The other is George Romero's 1968 horror classic that invented the modern zombie.", "One stars Mark Wahlberg and Burt Reynolds. The other is a black and white horror film shot in Pennsylvania.", "Disco era hedonism meets the zombie apocalypse — Night bridges both titles."],
    difficulty: "Medium",
    difficultyReason: "Both films are well-known but Night of the Living Dead skews toward film buffs — the shared word Night is the key",
    connection: "Both films are about an unlikely group of people sheltering together against an overwhelming external force — one moral decay, one the undead — with someone always going to pieces.",
    hintData: {"films":[{"year":1997,"genre":"Drama","actors":["Mark Wahlberg","Burt Reynolds","Julianne Moore"]},{"year":1968,"genre":"Horror","actors":["Duane Jones","Judith O'Dea"]}]}
  },
  {
    id: 89,
    mashedTitle: "Snow White and the Seven Year Itch",
    mashedPlot: "A married Manhattan man whose wife is away for the summer becomes obsessed with the enchanting neighbor upstairs, who sleeps for days at a time, accepts food only from strangers, and is tended to by seven very small men.",
    movies: ["Snow White and the Seven Dwarfs", "The Seven Year Itch"],
    aliases: [["Snow White", "Snow White Seven Dwarfs", "Snow White and the Seven Dwarfs"], ["Seven Year Itch"]],
    hints: ["One is Disney's 1937 first animated feature. The other is Billy Wilder's 1955 comedy starring Marilyn Monroe.", "One features a poison apple and seven small miners. The other features the most famous skirt-blowing scene in cinema history.", "A fairy tale princess meets a married man's mid-summer fantasy — Seven bridges both."],
    difficulty: "Hard",
    difficultyReason: "The Seven Year Itch is a classic but younger players may not know it — Snow White is universal, making this an asymmetric difficulty card",
    connection: "Both films are about the seductive danger of a beautiful woman who appears in a man's life when he least expects it — one literally poisoned, one metaphorically.",
    hintData: {"films":[{"year":1937,"genre":"Animated Fantasy","actors":["Adriana Caselotti","Lucille La Verne"]},{"year":1955,"genre":"Comedy / Romance","actors":["Marilyn Monroe","Tom Ewell"]}]}
  },
  {
    id: 90,
    mashedTitle: "Goodfellowship of the Ring",
    mashedPlot: "A young New Yorker is seduced into the glamorous, violent world of organized crime, inside a mafia crew that promises power, wealth, and belonging. But when a cursed ring must be smuggled across a war-torn realm, absolute loyalty and sacrifice are the only options.",
    movies: ["Goodfellas", "The Lord of the Rings: The Fellowship of the Ring"],
    aliases: [["Goodfellas Film"], ["Fellowship of the Ring", "Lord of the Rings Fellowship", "LOTR Fellowship"]],
    hints: ["One is Martin Scorsese's 1990 mob epic. The other is Peter Jackson's 2001 fantasy epic.", "One stars Ray Liotta, Joe Pesci, and Robert De Niro. The other stars Elijah Wood, Ian McKellen, and Viggo Mortensen.", "The New York mob meets Middle Earth — Fellas and Fellowship share a root."],
    difficulty: "Medium",
    difficultyReason: "Both films are landmark works that most players will know — the phonetic bridge between Fellas and Fellowship is the key insight",
    connection: "Both films are about the seductive pull of belonging to a brotherhood with its own rules — and the catastrophic price of that loyalty when the brotherhood turns on you.",
    hintData: {"films":[{"year":1990,"genre":"Crime Drama","actors":["Ray Liotta","Joe Pesci","Robert De Niro"]},{"year":2001,"genre":"Fantasy / Adventure","actors":["Elijah Wood","Ian McKellen","Viggo Mortensen"]}]}
  },
  {
    id: 91,
    mashedTitle: "The French Connection Dispatch",
    mashedPlot: "A foul-tempered New York detective obsessed with cracking a transatlantic heroin ring is reassigned by his editor to cover the story as a civilized long-form feature for a small Parisian magazine, complete with illustrations.",
    movies: ["The French Connection", "The French Dispatch"],
    aliases: [["French Connection Film"], ["French Dispatch Film", "The French Dispatch Wes Anderson"]],
    hints: ["One is William Friedkin's 1971 Oscar-winning police thriller. The other is Wes Anderson's 2021 love letter to the New Yorker magazine.", "One stars Gene Hackman as Detective Popeye Doyle. The other stars Benicio del Toro, Timothée Chalamet, and a large ensemble.", "French bridges both — a gritty cop thriller meets a perfectly symmetrical magazine anthology."],
    difficulty: "Hard",
    difficultyReason: "The French Connection is a classic but skews older — The French Dispatch is recent but art-house — both French bridges them",
    connection: "Both films are deeply in love with a particular version of France — one as a conduit for crime, one as a fantasy of intellectual and artistic refinement — and both are masterworks of their respective directors.",
    hintData: {"films":[{"year":1971,"genre":"Crime / Thriller","actors":["Gene Hackman","Fernando Rey","Roy Scheider"]},{"year":2021,"genre":"Comedy / Drama / Anthology","actors":["Benicio del Toro","Timothée Chalamet","Tilda Swinton"]}]}
  },
  {
    id: 92,
    mashedTitle: "Bridget Jones's Diary of a Wimpy Kid",
    mashedPlot: "A socially disastrous young woman records her humiliations in meticulous illustrated diary entries, including her terrible taste in men, her inability to dress appropriately, and the fact that she has somehow contracted the cheese touch.",
    movies: ["Bridget Jones's Diary", "Diary of a Wimpy Kid"],
    aliases: [["Bridget Jones Diary", "Bridget Jones"], ["Diary of a Wimpy Kid Film", "Wimpy Kid"]],
    hints: ["One is a 2001 British rom-com starring Renée Zellweger. The other is a 2010 family comedy based on Jeff Kinney's illustrated novels.", "One features Colin Firth as Mr. Darcy and Hugh Grant as Daniel Cleaver. The other features a cheese-obsessed American middle schooler.", "Two diary-keepers, two completely different problems — Diary bridges both."],
    difficulty: "Easy",
    difficultyReason: "Both are hugely popular and the shared word Diary makes the title click immediately",
    connection: "Both films are first-person comic chronicles of spectacular, self-inflicted social humiliation — one in a London office, one in an American middle school — told with exactly the same lack of self-awareness.",
    hintData: {"films":[{"year":2001,"genre":"Romantic Comedy","actors":["Renée Zellweger","Colin Firth","Hugh Grant"]},{"year":2010,"genre":"Family Comedy","actors":["Zachary Gordon","Robert Capron"]}]}
  },
  {
    id: 93,
    mashedTitle: "Rocky Road to Perdition",
    mashedPlot: "A Depression-era hitman flees cross-country with his young son after his employer orders them both killed, stopping in every town long enough to train in a local gym because the man he is running from is also the heavyweight champion of the world.",
    movies: ["Rocky", "Road to Perdition"],
    aliases: [["Rocky Film", "Rocky 1976"], ["Road to Perdition Film"]],
    hints: ["One is John G. Avildsen's 1976 Best Picture winner about a club boxer from Philadelphia. The other is Sam Mendes's 2002 Depression-era mob thriller.", "One stars Sylvester Stallone as Rocky Balboa. The other stars Tom Hanks as a hitman on the run with his son.", "A boxing underdog story meets a father-son mob road movie — Road bridges both titles."],
    difficulty: "Hard",
    difficultyReason: "Road to Perdition is a critically praised but not universally seen film — Rocky is iconic, making this asymmetric",
    connection: "Both films are about men from the wrong side of the tracks doing violence professionally who discover, too late, that the only thing worth protecting is the person standing next to them.",
    hintData: {"films":[{"year":1976,"genre":"Sports Drama","actors":["Sylvester Stallone","Talia Shire","Burgess Meredith"]},{"year":2002,"genre":"Crime Drama","actors":["Tom Hanks","Paul Newman","Jude Law"]}]}
  },
  {
    id: 94,
    mashedTitle: "The Theory of Everything Everywhere All at Once",
    mashedPlot: "A brilliant physicist slowly losing control of his body discovers that the unified theory of the universe he has spent his life searching for is located inside a laundromat in California, where his wife has been quietly maintaining every possible version of reality while doing the taxes.",
    movies: ["The Theory of Everything", "Everything Everywhere All at Once"],
    aliases: [["Theory of Everything Film"], ["Everything Everywhere All at Once Film", "EEAAO", "Everything Everywhere"]],
    hints: ["One is a 2014 biographical drama about Stephen Hawking starring Eddie Redmayne. The other is the 2022 multiverse film starring Michelle Yeoh.", "One features a romance between a physicist and his caretaker wife. The other features a Chinese-American laundromat owner discovering she can access parallel universes.", "A Cambridge love story meets the multiverse — Everything bridges both titles."],
    difficulty: "Easy",
    difficultyReason: "Both films are recent, critically acclaimed, and culturally prominent — and the title combination creates the longest, most absurd mash in the game",
    connection: "Both films are about someone whose mind contains more than the world seems ready to hold — one a physicist thinking beyond space and time, one a woman who can be everyone at once.",
    hintData: {"films":[{"year":2014,"genre":"Biographical Drama / Romance","actors":["Eddie Redmayne","Felicity Jones"]},{"year":2022,"genre":"Sci-Fi / Comedy / Drama","actors":["Michelle Yeoh","Ke Huy Quan","Jamie Lee Curtis"]}]}
  },
  {
    id: 95,
    mashedTitle: "Dances with Wolf of Wall Street",
    mashedPlot: "A disillusioned soldier posted to an empty frontier outpost gradually goes native among a tribe of cocaine-fuelled stockbrokers on Long Island, adopting their customs, their language, and eventually a wolf, until the federal government decides to shut the whole operation down.",
    movies: ["Dances with Wolves", "The Wolf of Wall Street"],
    aliases: [["Dances with Wolves Film"], ["Wolf of Wall Street", "The Wolf of Wall Street Film"]],
    hints: ["One is Kevin Costner's 1990 Best Picture winner about a Civil War soldier who joins a Lakota Sioux tribe. The other is Martin Scorsese's 2013 excess-fuelled stockbroker epic.", "One stars Kevin Costner and Mary McDonnell. The other stars Leonardo DiCaprio as Jordan Belfort.", "A man goes native on the frontier — Wolf bridges both Wolves and Wall Street."],
    difficulty: "Medium",
    difficultyReason: "Both films are well-known and the shared word Wolf/Wolves is immediately satisfying once spotted",
    connection: "Both films are about a man who leaves his old life behind and assimilates into a new tribe with its own codes, rituals, and language — and who eventually has to reckon with what that tribe actually costs him.",
    hintData: {"films":[{"year":1990,"genre":"Western / Drama","actors":["Kevin Costner","Mary McDonnell","Graham Greene"]},{"year":2013,"genre":"Crime / Comedy / Drama","actors":["Leonardo DiCaprio","Jonah Hill","Margot Robbie"]}]}
  }
];


// 
// GAME MODE CONFIG
// 
const GAME_MODES = [
  { id:"daily", label:"Daily Challenge", icon:"📅", roundCount:1, description:"A single daily card that resets at your local midnight.", tag:"TODAY", accentColor:"#a78bfa", difficultyPacing:"flat", maxGuesses:6, isDaily:true },
  { id:"standard", label:"Standard Mode", icon:"🎬", roundCount:10, description:"The full PlotMix experience with pseudo-random cards every run.", tag:"RECOMMENDED", accentColor:"#f59e0b", difficultyPacing:"flat", maxGuesses:6, isDaily:false },
  { id:"speedrun", label:"Speed Run", icon:"⏱️", timeLimit:60, roundCount:8, description:"A fast, casual session. Great for a coffee break.", tag:null, accentColor:"#60a5fa", difficultyPacing:"flat", maxGuesses:6, isDaily:false },
];

const TRANSITION_FAMILIES = {
  punchy: {
    cardIn: "cardInPunchy 0.38s cubic-bezier(.21,1.03,.35,1)",
    cardOut: "cardOutPunchy 0.2s ease-in forwards",
    popupSheetIn: "popupSheetPunchy 0.42s cubic-bezier(.17,.9,.32,1.15)",
    popupBackdropIn: "popupBackdropIn 0.26s ease-out",
    hintIn: "vaultDoorIn 0.36s cubic-bezier(.18,.87,.33,1)",
    missShake: "cameraShakePunchy 0.34s ease",
  },
  dreamy: {
    cardIn: "cardInDreamy 0.5s cubic-bezier(.2,.7,.25,1)",
    cardOut: "cardOutDreamy 0.24s ease-in forwards",
    popupSheetIn: "popupSheetDreamy 0.5s cubic-bezier(.2,.82,.26,1)",
    popupBackdropIn: "popupBackdropIn 0.3s ease-out",
    hintIn: "vaultDoorIn 0.42s cubic-bezier(.18,.87,.33,1)",
    missShake: "cameraShakeDreamy 0.4s ease",
  },
  retro: {
    cardIn: "cardInRetro 0.46s steps(5, end)",
    cardOut: "cardOutRetro 0.22s steps(3, end) forwards",
    popupSheetIn: "popupSheetRetro 0.46s steps(4, end)",
    popupBackdropIn: "popupBackdropIn 0.26s ease-out",
    hintIn: "vaultDoorIn 0.36s cubic-bezier(.18,.87,.33,1)",
    missShake: "cameraShakeRetro 0.26s steps(4, end)",
  },
  thriller: {
    cardIn: "cardInThriller 0.42s cubic-bezier(.18,.9,.35,1)",
    cardOut: "cardOutThriller 0.2s ease-in forwards",
    popupSheetIn: "popupSheetThriller 0.4s cubic-bezier(.18,.93,.3,1)",
    popupBackdropIn: "popupBackdropIn 0.24s ease-out",
    hintIn: "vaultDoorIn 0.34s cubic-bezier(.18,.87,.33,1)",
    missShake: "cameraShakeThriller 0.3s ease",
  },
};

const TRANSITION_FAMILY_ORDER = ["punchy", "dreamy", "retro", "thriller"];

function pickTransitionFamily(card, cardIdx) {
  const difficulty = (card?.difficulty || "Medium").toLowerCase();
  const baseByDifficulty = {
    easy: "dreamy",
    medium: "punchy",
    hard: "thriller",
  };
  const baseFamily = baseByDifficulty[difficulty] || "punchy";
  const offset = TRANSITION_FAMILY_ORDER.indexOf(baseFamily);
  const familyName = TRANSITION_FAMILY_ORDER[(Math.max(0, offset) + (cardIdx % TRANSITION_FAMILY_ORDER.length)) % TRANSITION_FAMILY_ORDER.length];
  const preset = TRANSITION_FAMILIES[familyName] || TRANSITION_FAMILIES.punchy;
  return { name: familyName, ...preset };
}

const GENRE_TRANSITION_META = {
  punchy: { tag: "Blockbuster Cut", emoji: "🎬", anim: "genreWipePunchy" },
  dreamy: { tag: "Dream Dissolve", emoji: "✨", anim: "genreWipeDreamy" },
  retro: { tag: "Retro Splice", emoji: "📼", anim: "genreWipeRetro" },
  thriller: { tag: "Thriller Smash", emoji: "⚡", anim: "genreWipeThriller" },
};

const LOTTIE_ASSETS = {
  smashImpact: "/lottie/celebration-particles.json",
  roundWin: "/lottie/confetti-cannons.json",
  roundMiss: "/lottie/trophy-burst.json",
  genreByFamily: {
    punchy: "/lottie/confetti-cannons.json",
    dreamy: "/lottie/celebration-particles.json",
    retro: "/lottie/trophy-burst.json",
    thriller: "/lottie/celebration-particles.json",
  },
};

function LottieOverlay({src, loop=false, autoplay=true, speed=1, style={}, onComplete=null}) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!src || !hostRef.current) return;

    const anim = lottie.loadAnimation({
      container: hostRef.current,
      renderer: "svg",
      loop,
      autoplay,
      path: src,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        clearCanvas: true,
      },
    });

    anim.setSpeed(speed);

    let handleComplete = null;
    if (onComplete) {
      handleComplete = () => onComplete();
      anim.addEventListener("complete", handleComplete);
    }

    return () => {
      if (handleComplete) anim.removeEventListener("complete", handleComplete);
      anim.destroy();
    };
  }, [src, loop, autoplay, speed, onComplete]);

  return <div ref={hostRef} aria-hidden="true" style={style}/>;
}

// 
// SCORING
// Max 1000 pts per card:
//   500 base for getting both films
//   250 bonus if 0 hints used
//   up to 250 for guess efficiency (fewer guesses = more pts)
//   Partial (1 film): 200 base
// 
// 
// SCORING & HINT SYSTEM
//
// Base reward per card: 10 points
// Hint Tier 1 (metadata): lowers reward by 1
// Hint Tier 2 (actors):   lowers reward by 3
// Wrong guess:            lowers reward by 1
// Guessing films individually: no reward penalty (still considered correct progress)
// Formula: currentReward = max(0, baseReward - hintPenalty - wrongGuessPenalty)
// 

const BASE_REWARD = 10;   // max points per card (visible, feels precious)

const HINT_TIERS = [
  {
    id: "metadata",
    tier: 1,
    label: "Year & Genre Hint",
    description: "Reveals the release year and genre of each film",
    tokenCost: 1,
    rewardPenalty: 1,
  },
  {
    id: "actors",
    tier: 2,
    label: "Actor Hint",
    description: "Reveals the lead actor(s) of each film — a strong clue",
    tokenCost: 1,
    rewardPenalty: 3,
  },
  // Future tiers slot in here: quotes, taglines, director, poster fragments, etc.
];

// Individual film guesses are valid progress and should not reduce reward.
const INDIVIDUAL_FILM_PENALTY = 0;
const WRONG_GUESS_REWARD_PENALTY = 1;

// Confidence levels
const CONFIDENCE_WRONG_MULT  = { sure:0.7, maybe:1.0, hailmary:0.5 };

// Live reward calculation — called every render so player sees it drop in real time
// hintsRevealed = array of tier IDs revealed so far
// filmsGuessedIndividually = count of films found via individual guess (not mash title)
// wrongGuessCount = guesses that were not fully correct for this card
function calcReward(hintsRevealed, filmsGuessedIndividually, wrongGuessCount) {
  const tokensPenalty = hintsRevealed.reduce((acc, tierId) => {
    const tier = HINT_TIERS.find(t => t.id === tierId);
    return acc + (tier ? tier.rewardPenalty : 0);
  }, 0);
  return Math.max(
    0,
    BASE_REWARD
      - tokensPenalty
      - (filmsGuessedIndividually * INDIVIDUAL_FILM_PENALTY)
      - (wrongGuessCount * WRONG_GUESS_REWARD_PENALTY)
  );
}

// Score = straight reward, no multiplier
function calcScore(won, currentReward) {
if (!won) return 0;
return currentReward;
}

// 
// DECK GENERATION
// 
function mulberry32(seed) {
  return () => { let t=(seed+=0x6d2b79f5); t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return((t^(t>>>14))>>>0)/4294967296; };
}
function dateToSeed(d) { return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); }
function getDailySeed() { return dateToSeed(new Date()); }
function getYesterdaySeed() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateToSeed(d);
}
function shuffleRng(arr,rng) { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function moviePairKey(card) {
  const pair = (card.movies || [])
    .map((m) => normWord(m || "").trim())
    .filter(Boolean)
    .sort();
  return pair.join("__");
}

function uniqueCardsByMoviePair(deck) {
  const seen = new Set();
  return deck.filter((card) => {
    const key = moviePairKey(card);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildDeck(mode) {
  const { id, roundCount, isDaily } = mode;
  const sourceDeck = uniqueCardsByMoviePair(MASTER_DECK);
  const cap = Math.min(roundCount, sourceDeck.length);
  if (isDaily) {
    const todayShuffled = shuffleRng(sourceDeck, mulberry32(getDailySeed()));
    if (todayShuffled.length <= 1) return todayShuffled.slice(0, cap);

    // Guardrail: avoid showing the same top daily card on consecutive days.
    const yesterdayTopId = shuffleRng(sourceDeck, mulberry32(getYesterdaySeed()))[0]?.id;
    if (todayShuffled[0]?.id === yesterdayTopId) {
      const [first, ...rest] = todayShuffled;
      return [...rest, first].slice(0, cap);
    }
    return todayShuffled.slice(0, cap);
  }
  // Non-daily runs are intentionally pseudo-random across the full deck.
  const seed = ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
  const shuffled = shuffleRng(sourceDeck, mulberry32(seed));

  if (id !== "standard") {
    return shuffled.slice(0, cap);
  }

  const recentStartIds = loadRecentStandardStarts();
  const freshOpeners = shuffled.filter((card) => !recentStartIds.includes(card.id));
  const firstCard = (freshOpeners.length ? freshOpeners : shuffled)[0];
  const deck = [firstCard, ...shuffled.filter((card) => card.id !== firstCard.id)].slice(0, cap);
  saveRecentStandardStarts([firstCard.id]);
  return deck;
}

// 
// FUZZY MATCHING with aliases
// 
// ── MATCHING ENGINE — normalize + exact + Levenshtein ──────────────────────
// Inspired by how Wordle/NYT games handle input:
// 1. Normalize both strings (lowercase, strip punctuation, strip articles, & → and)
// 2. Exact match after normalization
// 3. Check all aliases the same way
// 4. Levenshtein distance ≤ 2 for strings longer than 5 chars (typo tolerance)
// No word-overlap heuristics — those caused all the false positives.

function norm(s) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")           // & → and
    .replace(/[^a-z0-9\s]/g, " ")  // strip punctuation
    .replace(/\s+/g, " ")           // collapse whitespace
    .trim()
    .replace(/^(the|a|an) /, "");   // strip leading article
}

// Word-level normalization keeps articles so typed words like "the" can reveal tiles.
function normWord(s) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const dp = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = dp[j];
      dp[j] = a[i-1] === b[j-1] ? prev : 1 + Math.min(prev, dp[j], dp[j-1]);
      prev = temp;
    }
  }
  return dp[b.length];
}

const STOPWORDS = new Set(["the","a","an","and","of","in","on","at","to","for","with","is","it","or","from","by","there","will","day","being"]);
const GENERIC_TITLE_WORDS = new Set(["life","man","men","woman","women","world","story","time","night","home","love","boy","girl"]);

function fuzzy(guess, answer, aliases = []) {
  const g = norm(guess);
  if (!g || g.length < 2) return false;

  const targets = [norm(answer), ...aliases.map(a => norm(a))].filter(Boolean);

  for (const t of targets) {

    // 1. Exact match after normalization
    if (g === t) return true;

    // 4. Single-word match now lives in checkGuesses(), where both films in the
    // pair are visible — see below. It's pair-aware instead of a length cutoff.

    // 5. Levenshtein on full string — similar length strings, guess at least 4 chars
    // "godfater" → "godfather", "shawsank" → "shawshank"
    const lenDiff = Math.abs(g.length - t.length);
    if (g.length >= 4 && lenDiff <= 2 && t.length >= 5) {
      const dist = levenshtein(g, t);
      const minLen = Math.min(g.length, t.length);
      // Keep strong typo tolerance on long strings, but for short words require
      // much tighter distance so "pride" doesn't match "prada".
      const maxDist = minLen >= 9 ? 2 : 1;
      if (dist <= maxDist) return true;
    }

  }

  return false;
}

function normalizeToken(w) {
  if (!w) return "";
  if (w.endsWith("ies") && w.length > 4) return `${w.slice(0, -3)}y`;
  if (w.endsWith("es") && w.length > 4) return w.slice(0, -2);
  if (w.endsWith("s") && w.length > 3) return w.slice(0, -1);
  return w;
}

// Near guess: shares meaningful title words with either movie, but isn't fully correct.
function isNearMovieGuess(guess, card) {
  const gWords = normWord(guess).split(" ").filter(Boolean).map(normalizeToken);
  if (gWords.length === 0) return false;

  const meaningfulGuessWords = gWords.filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  if (meaningfulGuessWords.length === 0) return false;

  return card.movies.some((m, i) => {
    const aliases = (card.aliases || [[], []])[i] || [];
    const titleWords = [normWord(m), ...aliases.map(a => normWord(a))]
      .join(" ")
      .split(" ")
      .filter(Boolean)
      .map(normalizeToken);
    const titleSet = new Set(titleWords);

    const overlap = meaningfulGuessWords.filter((w) => titleSet.has(w));
    return overlap.length >= 1;
  });
}

function isExactMashedTitleWordGuess(guess, card) {
  const tokens = normWord(guess).split(" ").filter(Boolean).map(normalizeToken);
  if (tokens.length !== 1) return false;
  const token = tokens[0];
  const hasDigit = /\d/.test(token);
  if ((!hasDigit && token.length < 3) || (hasDigit && token.length < 2) || STOPWORDS.has(token)) return false;

  const mashedWords = new Set(
    normWord(card.mashedTitle || "")
      .split(" ")
      .filter(Boolean)
      .map(normalizeToken)
  );
  return mashedWords.has(token);
}

function isGuessPresentInMashedTitle(guess, card) {
  const guessTokens = normWord(guess).split(" ").filter(Boolean).map(normalizeToken);
  if (guessTokens.length === 0) return false;

  const mashedTokenSet = new Set(
    normWord(card.mashedTitle || "")
      .split(" ")
      .filter(Boolean)
      .map(normalizeToken)
  );

  return guessTokens.every((token) => mashedTokenSet.has(token));
}

// If players reveal every meaningful word in the mashed title, treat the round
// as solved even when guesses were entered as separate words.
function areAllMashedTitleWordsGuessed(guesses, mashedTitle = "") {
  const titleTokens = normWord(mashedTitle)
    .split(" ")
    .filter(Boolean)
    .map(normalizeToken)
    .filter((token) => token && !STOPWORDS.has(token));

  if (titleTokens.length === 0) return false;

  const required = new Set(titleTokens);
  const guessed = new Set();

  guesses.forEach((g) => {
    // Only single-word guesses contribute to this fallback completion path.
    // Multi-word guesses are validated by isMashedTitleGuess instead, so
    // connector words like "of" vs "and" cannot be bypassed here.
    const tokens = normWord(g)
      .split(" ")
      .filter(Boolean)
      .map(normalizeToken)
      .filter(Boolean);

    if (tokens.length !== 1) return;

    const token = tokens[0];
    if (required.has(token)) guessed.add(token);
  });

  return Array.from(required).every((token) => guessed.has(token));
}

function checkGuesses(guesses, movies, aliases, mashedTitle="") {
  const found=[false,false];
  guesses.forEach(g=>{
    // Mashed title: accept robust near-full matches but still reject short partials.
    if(isMashedTitleGuess(g, mashedTitle)) {
      found[0]=true; found[1]=true; return;
    }
    // Individual film matching — strict full-title intent only.
    movies.forEach((m,i)=>{
      if(found[i]) return;
      if(isCorrectMovieGuess(g, m, aliases[i], movies[1 - i])) { found[i]=true; return; }
    });
  });
  return found;
}

function isRoundSolved(result) {
  if (!result || result.skipped) return false;
  if (typeof result.solved === "boolean") return result.solved;
  return !!(result.found && result.found[0] && result.found[1]);
}

function isMashedTitleGuess(guess, mashedTitle) {
  if (!mashedTitle) return false;
  const normGuess = norm(guess);
  const normMashed = norm(mashedTitle);
  if (!normGuess || !normMashed) return false;

  // Keep a length floor so short fragments cannot solve a full title.
  if (normGuess.length >= normMashed.length * 0.7 && fuzzy(guess, mashedTitle, [])) {
    return true;
  }

  // Additional tolerance: players often merge words ("spacejam") and make one
  // typo ("oddysey"). Compare compacted strings for long guesses only.
  const compact = (s) => s.replace(/\s+/g, "");
  const gCompact = compact(normGuess);
  const tCompact = compact(normMashed);
  const lenDiff = Math.abs(gCompact.length - tCompact.length);
  if (
    tCompact.length >= 10 &&
    gCompact.length >= tCompact.length * 0.75 &&
    lenDiff <= 2 &&
    levenshtein(gCompact, tCompact) <= 2
  ) {
    return true;
  }

  return false;
}

// Accept a film title guessed inside a longer sentence.
// Example: "its a beautiful life of pie" should still award "Life of Pi".
function containsEmbeddedMovieGuess(guess, title, aliases = []) {
  const guessWords = normWord(guess).split(" ").filter(Boolean);
  const titleWords = normWord(title).split(" ").filter(Boolean);
  if (guessWords.length < 2 || titleWords.length < 2) return false;

  const minWindow = Math.max(2, titleWords.length - 1);
  const maxWindow = Math.min(guessWords.length, titleWords.length + 1);

  for (let windowSize = minWindow; windowSize <= maxWindow; windowSize++) {
    for (let start = 0; start + windowSize <= guessWords.length; start++) {
      const chunk = guessWords.slice(start, start + windowSize).join(" ");
      if (fuzzy(chunk, title, aliases)) return true;
    }
  }

  return false;
}

function isCorrectMovieGuess(guess, movieTitle, aliases = [], otherTitle = "") {
  return (
    fuzzy(guess, movieTitle, aliases) ||
    containsEmbeddedMovieGuess(guess, movieTitle, aliases)
  );
}

function isFullyCorrectGuess(guess, card) {
  const aliases = card.aliases || [[], []];
  if (isMashedTitleGuess(guess, card.mashedTitle || "")) return true;

  return card.movies.some((m, i) => {
    return isCorrectMovieGuess(guess, m, aliases[i], card.movies[1 - i]);
  });
}

function guessClassification(guess, card) {
  const normalizedGuess = norm(guess);
  if (!normalizedGuess) return "miss";
  // Any guess whose words are truly present in the mashed title should not be
  // penalized as a miss, even when it is not a full movie-title solve.
  if (isFullyCorrectGuess(guess, card) || isGuessPresentInMashedTitle(guess, card)) return "match";
  return "miss";
}


// 
// LOCAL STORAGE HELPERS
// 
const LS_ONBOARDED = "plotmix_onboarded";
const LS_SAVE = "plotmix_save_v2";
const LS_SAVE_LEGACY = "plotmix_save";
const LS_DAILY_PREFIX = "plotmix_daily_";
const LS_STREAK = "plotmix_streak";
const LS_STANDARD_RECENT_STARTS = "plotmix_standard_recent_starts";
const LS_APP_VERSION = "plotmix_app_version";
const SAVE_SCHEMA_VERSION = 2;
const APP_STORAGE_VERSION = "2026-07-26-1";
const APP_BOOT_NONCE = `${APP_STORAGE_VERSION}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function resetLegacyPersistentState() {
  try {
    localStorage.removeItem(LS_SAVE_LEGACY);
    localStorage.removeItem(LS_SAVE);
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(LS_DAILY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    localStorage.setItem(LS_APP_VERSION, APP_STORAGE_VERSION);
  } catch {}
}

function ensureAppStorageVersion() {
  try {
    if (localStorage.getItem(LS_APP_VERSION) !== APP_STORAGE_VERSION) {
      resetLegacyPersistentState();
    }
  } catch {}
}

ensureAppStorageVersion();

function loadStreak() { try{const v=localStorage.getItem(LS_STREAK); return v?JSON.parse(v):{current:0,best:0};}catch{return{current:0,best:0};} }
function saveStreak(s) { try{localStorage.setItem(LS_STREAK,JSON.stringify(s));}catch{} }
function loadRecentStandardStarts() {
  try {
    const value = localStorage.getItem(LS_STANDARD_RECENT_STARTS);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
}
function saveRecentStandardStarts(ids) {
  try {
    const recent = [...ids, ...loadRecentStandardStarts()]
      .filter((id, index, arr) => Number.isInteger(id) && arr.indexOf(id) === index)
      .slice(0, 8);
    localStorage.setItem(LS_STANDARD_RECENT_STARTS, JSON.stringify(recent));
  } catch {}
}
function updateStreak(bothFound) {
  const s=loadStreak();
  if(bothFound){ s.current++; s.best=Math.max(s.best,s.current); }
  else { s.current=0; }
  saveStreak(s); return s;
}

function getDailyKey() { const d=new Date(); return `${LS_DAILY_PREFIX}${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`; }
function hasDoneDaily() { try{return !!localStorage.getItem(getDailyKey());}catch{return false;} }
function markDailyDone(score) { try{localStorage.setItem(getDailyKey(),JSON.stringify({score,date:new Date().toISOString()}));}catch{} }
function getDailyResult() { try{const v=localStorage.getItem(getDailyKey()); return v?JSON.parse(v):null;}catch{return null;} }

function isStaleDailySession(session) {
  if (!session || session.modeId !== "daily") return false;
  return session.dailyKey !== getDailyKey();
}

function isValidSavedSession(session) {
  if (!session || typeof session !== "object") return false;
  if (session.schemaVersion !== SAVE_SCHEMA_VERSION) return false;
  const mode = GAME_MODES.find(gm => gm.id === session.modeId);
  if (!mode) return false;
  if (isStaleDailySession(session)) return false;
  if (!Array.isArray(session.deck) || session.deck.length !== mode.roundCount) return false;
  if (session.deckLen !== mode.roundCount) return false;
  if (!Number.isInteger(session.cardIdx) || session.cardIdx < 0 || session.cardIdx >= session.deckLen) return false;
  if (!Array.isArray(session.results) || session.results.length > session.deckLen) return false;
  if (!Array.isArray(session.guesses)) return false;
  if (!Array.isArray(session.hintsRevealed)) return false;
  if (typeof session.totalScore !== "number") return false;
  if (typeof session.lives !== "number") return false;
  if (typeof session.timeLeft !== "number") return false;
  return true;
}

// Per-mode session storage — one saved slot per mode ID
function saveSession(data) {
  try {
    const all = loadAllSessions();
    all[data.modeId] = {
      ...data,
      dailyKey: data.modeId === "daily" ? getDailyKey() : null,
      schemaVersion: SAVE_SCHEMA_VERSION,
      savedAt: Date.now(),
    };
    localStorage.setItem(LS_SAVE, JSON.stringify(all));
  } catch {}
}
function loadAllSessions() {
  try {
    localStorage.removeItem(LS_SAVE_LEGACY);
    const v = localStorage.getItem(LS_SAVE);
    const parsed = v ? JSON.parse(v) : {};
    const cleaned = Object.fromEntries(Object.entries(parsed).filter(([, session]) => isValidSavedSession(session)));
    if (JSON.stringify(parsed) !== JSON.stringify(cleaned)) {
      localStorage.setItem(LS_SAVE, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch { return {}; }
}
function loadSession(modeId) {
  try { const all = loadAllSessions(); return modeId ? all[modeId] : null; } catch { return null; }
}
function clearSession(modeId) {
  try {
    const all = loadAllSessions();
    if (modeId) delete all[modeId];
    localStorage.setItem(LS_SAVE, JSON.stringify(all));
  } catch {}
}
function clearAllSessions() {
  try { localStorage.removeItem(LS_SAVE); } catch {}
}
function loadAllSessionsList() {
  // Returns array of saved sessions, sorted by most recently played
  const all = loadAllSessions();
  return Object.values(all)
    .filter(s => s && s.modeId && s.cardIdx < s.deckLen)
    .sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
}
function hasOnboarded() { try{return !!localStorage.getItem(LS_ONBOARDED);}catch{return false;} }
function markOnboarded() { try{localStorage.setItem(LS_ONBOARDED,"1");}catch{} }

function upsertRoundResult(results, index, roundResult) {
  const nextResults = [...results];
  nextResults[index] = roundResult;
  return nextResults;
}

// navigator.clipboard is unavailable on insecure origins and can reject silently,
// which is why the Copy button appeared to do nothing.
function fallbackCopy(text,onDone){
  try{
    const ta=document.createElement("textarea");
    ta.value=text; ta.style.position="fixed"; ta.style.opacity="0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    onDone&&onDone();
  }catch{}
}
function getTodayLabel() { return new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}); }

// 
// SOUND ENGINE — Web Audio API, no external files
// 
const AudioCtx = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
let _actx = null;
function getACtx() { if(!_actx && AudioCtx) _actx=new AudioCtx(); return _actx; }

function playTone(frequency, type, duration, gain, delayStart=0, rampDown=true) {
  try {
    const ctx = getACtx(); if(!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = type; o.frequency.setValueAtTime(frequency, ctx.currentTime + delayStart);
    g.gain.setValueAtTime(gain, ctx.currentTime + delayStart);
    if(rampDown) g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delayStart + duration);
    o.start(ctx.currentTime + delayStart);
    o.stop(ctx.currentTime + delayStart + duration + 0.01);
  } catch(e) {}
}

const SFX = {
  correct: () => {
    // Rising chime — two bright tones
    playTone(523.25, "sine", 0.18, 0.22);        // C5
    playTone(783.99, "sine", 0.28, 0.20, 0.12);  // G5
  },
  wrong: () => {
    // Low dull thud
    playTone(140, "square", 0.12, 0.08);
    playTone(110, "sine",   0.18, 0.06, 0.05);
  },
  complete: () => {
    // Ascending fanfare: C-E-G-C
    [[523.25,0],[659.25,0.10],[783.99,0.20],[1046.5,0.32]].forEach(([f,d])=>
      playTone(f,"sine",0.35,0.18,d));
  },
  hint: () => {
    // Soft click
    playTone(880,"sine",0.08,0.06);
  },
};
function marathonTension(i,n) { return Math.min(1,i/Math.max(1,n*0.75)); }

function getRunBestStreak(results) {
  let current = 0;
  let best = 0;
  for (const r of results) {
    if (isRoundSolved(r)) {
      current += 1;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  }
  return best;
}

// 
// SHAREABLE RESULT CARD
// 
function buildShareText(mode, results, totalScore) {
  const correct=results.filter(r=>isRoundSolved(r)).length;
  const skipped=results.filter(r=>r.skipped).length;
  const failed=results.filter(r=>!r.skipped&&!isRoundSolved(r)&&!(r.found&&r.found[0]!==r.found[1])).length;
  const dateLine = mode.isDaily ? `📅 ${getTodayLabel()}\n` : "";
  const streakValue = getRunBestStreak(results);
  const summaryLine = `${correct}✅ ${failed}❌ ${skipped}⏭️ ${streakValue}🔥 ${totalScore.toLocaleString()}⭐`;
  const lines = [
    `🎬 PLOTMIX ${mode.label}`,
    `${dateLine}${summaryLine}`,
  ];
  return lines.join("\n");
}

// 
// SHARED UI ATOMS
// 
const GOLD="linear-gradient(90deg,#F6A507,#FFC94D,#F6A507)";

// DESIGN SYSTEM — PlotMix Candy / Sticker (from Figma yCSX9051ErfAjLH41PI6MD)
// Bold purple stage, white sticker cards, thick black outlines, hard offset shadows.
// Values pulled directly from Figma node inspection — not approximated.
const T = {
  bg:           "#7462FC",   // bold purple — the page/stage
  bgDeep:       "#4A45EF",   // deeper blue-purple — sheets/modals
  surface:      "#FFFFFF",   // white sticker card
  surfaceAlt:   "#EFF3F8",   // off-white tile (hangman / input)
  surfaceRaised:"#D3CBFE",   // lavender chip (untouched tracker pip)
  border:       "#1C1D21",   // near-black outline — the sticker line
  borderBright: "#000000",   // pure black — strongest outline

  textPrimary:  "#1C1D21",   // near-black — text on white cards
  textSecondary:"#3B3F42",   // dark gray
  textMuted:    "#6B6F76",   // mid gray
  textOnDark:   "#FFFFFF",   // white — text on purple/blue surfaces

  gold:         "#F6A507",   // amber — headline accent on dark sheets
  goldBg:       "#FFF3D6",
  goldDark:     "#8A5A00",
  goldBright:   "#F6A507",

  green:    "#00AC5C", greenBg:  "#D9F7E8",
  red:      "#E4463C", redBg:    "#FFE1DE",
  orange:   "#FFA100", orangeBg: "#FFF1D6",
  blue:     "#0FC2E5", blueBg:   "#DFF7FC",   // cyan — hint accent
  purple:   "#7462FC", purpleBg: "#EDEBFF",
  pink:     "#F462AC", pinkBg:   "#FDE3F1",   // hot pink — guess/primary
  teal:     "#1D9D96", tealBg:   "#DCF6F4",   // success pip
  rose:     "#87475F", roseBg:   "#F6E3EA",   // fail pip

  xs:11, sm:13, md:15, lg:18, xl:22, xxl:28, hero:40,
  r:9, rLg:16, rXl:25,
  shadow:    "0 4px 0 #1C1D21",
  shadowSm:  "0 2px 0 #1C1D21",
  shadowLg:  "0 8px 40px rgba(0,0,0,0.28)",
  glow:      "0 0 0 3px rgba(246,165,7,0.12)",
  textShadowSticker: "0 2px 0 rgba(0,0,0,0.35)",
};

const FONT_FIGMA_STICKER = "'Rubik Mono One',sans-serif";
const FONT_POPUP_STICKER = FONT_FIGMA_STICKER;
const FONT_DISPLAY = FONT_FIGMA_STICKER;
const FONT_BUTTON = FONT_FIGMA_STICKER;

const YELLOW_STICKER_TEXT = {
  color: T.gold,
  fontFamily: FONT_DISPLAY,
  fontWeight: 400,
  WebkitTextStroke: "1px #000000",
  paintOrder: "stroke fill",
  textShadow: "0 2px 0 #000000",
};

const WHITE_STICKER_TEXT = {
  color: "#FFFFFF",
  fontFamily: FONT_DISPLAY,
  fontWeight: 400,
  WebkitTextStroke: "0.9px #000000",
  paintOrder: "stroke fill",
  textShadow: "0 2px 0 #000000",
};

// Popup labels in the Figma export read slightly lighter/tighter than the
// global sticker tokens, so keep a dedicated variant for round-result UI.
const POPUP_WHITE_TEXT = {
  ...WHITE_STICKER_TEXT,
  fontFamily: FONT_POPUP_STICKER,
  WebkitTextStroke: "0px transparent",
  paintOrder: "stroke fill",
  textShadow: "-1.1px 0 0.18px #000000, 1.1px 0 0.18px #000000, 0 -1.1px 0.18px #000000, 0 1.1px 0.18px #000000, 0 2.2px 0.2px #000000",
  letterSpacing: "0",
  WebkitFontSmoothing: "subpixel-antialiased",
  textRendering: "auto",
};

const POPUP_YELLOW_TEXT = {
  ...YELLOW_STICKER_TEXT,
  fontFamily: FONT_POPUP_STICKER,
  WebkitTextStroke: "0.9px #000000",
  paintOrder: "stroke fill",
  textShadow: "0 2.2px 0.18px #000000",
  letterSpacing: "0",
  WebkitFontSmoothing: "subpixel-antialiased",
  textRendering: "auto",
};

const POPUP_CHIP_TEXT = {
  ...POPUP_WHITE_TEXT,
  fontFamily: FONT_POPUP_STICKER,
  WebkitTextStroke: "0px transparent",
  paintOrder: "stroke fill",
  textShadow: "-1.1px 0 0.18px #000000, 1.1px 0 0.18px #000000, 0 -1.1px 0.18px #000000, 0 1.1px 0.18px #000000, 0 2.2px 0.2px #000000",
  letterSpacing: "0",
  WebkitFontSmoothing: "subpixel-antialiased",
  textRendering: "auto",
};

const POPUP_PLAIN_WHITE_TEXT = {
  ...POPUP_WHITE_TEXT,
  WebkitTextStroke: "0px transparent",
  textShadow: "none",
};

const POPUP_BUTTON_TEXT = {
  ...POPUP_CHIP_TEXT,
  fontSize: 15,
  textTransform: "uppercase",
  lineHeight: 1.08,
  transform: "none",
  letterSpacing: "0",
  fontWeight: 400,
};

const POPUP_TITLE_TEXT = {
  ...POPUP_WHITE_TEXT,
  fontSize: 24,
  lineHeight: 1.02,
  textTransform: "uppercase",
  letterSpacing: "0",
};

const POPUP_SCORE_TEXT = {
  ...POPUP_BUTTON_TEXT,
  color: "#FFFFFF",
  WebkitTextStroke: "0px transparent",
  textShadow: "-1.1px 0 0.18px #000000, 1.1px 0 0.18px #000000, 0 -1.1px 0.18px #000000, 0 1.1px 0.18px #000000, 0 2.2px 0.2px #000000",
  fontSize: 13,
  lineHeight: 1,
  letterSpacing: "0",
  whiteSpace: "nowrap",
};

const CHECKER_BG = {
  backgroundColor: "#7462FC",
  backgroundImage:
    "linear-gradient(45deg, #5145A7 25%, transparent 25%, transparent 75%, #5145A7 75%, #5145A7), linear-gradient(45deg, #5145A7 25%, transparent 25%, transparent 75%, #5145A7 75%, #5145A7)",
  backgroundSize: "10px 10px",
  backgroundPosition: "0 0, 5px 5px",
};

const HUD_STAT_PILL = {
  display:"flex",
  alignItems:"center",
  gap:6,
  background:"#241D66",
  border:"1.5px solid #1C1D21",
  borderRadius:8,
  boxShadow:"0 2px 0 #1C1D21",
  minHeight:32,
  boxSizing:"border-box",
  padding:"0 10px 0 8px",
};

const HUD_COUNTER_TEXT = {
  fontFamily:FONT_FIGMA_STICKER,
  fontSize:11,
  color:"#FFFFFF",
  WebkitTextStroke:"0.7px #000000",
  paintOrder:"stroke fill",
  textShadow:"0 2px 0 rgba(0,0,0,0.7)",
  lineHeight:1,
  display:"inline-block",
  transform:"translateY(0.5px)",
};

// Radiating rays are generated in CSS so they remain consistent regardless of
// container height/positioning changes and don't regress when SVG layers shift.
const RESULT_RAYS_BG = {
  backgroundColor: "#4A45EF",
  backgroundImage: [
    "radial-gradient(circle at 50% 104%, rgba(206, 190, 255, 0.58) 0%, rgba(206, 190, 255, 0.24) 14%, rgba(206, 190, 255, 0) 58%)",
    "repeating-conic-gradient(from -90deg at 50% 104%, rgba(157, 142, 255, 0.44) 0deg 10deg, rgba(83, 68, 214, 0.1) 10deg 20deg)",
    "linear-gradient(180deg, #6757F5 0%, #5146E7 52%, #473DD9 100%)",
  ].join(","),
  backgroundPosition: "center center, center center, center center",
  backgroundRepeat: "no-repeat, no-repeat, no-repeat",
  backgroundSize: "100% 100%, 100% 100%, 100% 100%",
};

const SUNBURST_BG = RESULT_RAYS_BG;

const WIN_RESULT_BG = RESULT_RAYS_BG;

const RESULT_FOOTER_BG = {
  backgroundColor: "#9381FE",
  backgroundImage: "none",
};

const BTN = {
  // Hot-pink "Guess" style — the primary call to action
  primary:   {background:T.pink, color:"#fff", border:`2px solid ${T.border}`, borderRadius:T.r, padding:"13px 28px", fontFamily:FONT_BUTTON, fontSize:T.sm, fontWeight:400, letterSpacing:"0.03em", textTransform:"uppercase", cursor:"pointer", transition:"transform 0.1s, box-shadow 0.1s", boxShadow:T.shadow, textShadow:T.textShadowSticker},
  // White sticker button — for neutral/secondary actions
  secondary: {background:T.surface, color:T.textPrimary, border:`2px solid ${T.border}`, borderRadius:T.r, padding:"11px 22px", fontFamily:FONT_BUTTON, fontSize:T.sm, fontWeight:400, letterSpacing:"0.03em", textTransform:"uppercase", cursor:"pointer", transition:"transform 0.1s, box-shadow 0.1s", boxShadow:T.shadowSm},
  // Cyan chip — used for hints / secondary info actions
  cyan:      {background:T.blue, color:"#fff", border:`2px solid ${T.border}`, borderRadius:T.r, padding:"11px 22px", fontFamily:FONT_BUTTON, fontSize:T.sm, fontWeight:400, letterSpacing:"0.03em", textTransform:"uppercase", cursor:"pointer", transition:"transform 0.1s, box-shadow 0.1s", boxShadow:T.shadow, textShadow:T.textShadowSticker},
  ghost:     {background:"transparent", color:T.textOnDark, border:`1.5px solid rgba(255,255,255,0.5)`, borderRadius:T.r, padding:"10px 18px", fontFamily:FONT_BUTTON, fontSize:T.sm, textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s"},
  // Orange chip — skip / dismissive actions
  danger:    {background:T.orange, color:"#fff", border:`2px solid ${T.border}`, borderRadius:T.r, padding:"10px 18px", fontFamily:FONT_BUTTON, fontSize:T.xs, fontWeight:400, letterSpacing:"0.03em", textTransform:"uppercase", cursor:"pointer", boxShadow:T.shadowSm, textShadow:T.textShadowSticker},
};

const STICKER_ASSETS = {
  // Timings are tuned to the provided MP4 clips:
  // clapboard ~1s, popcorn ~2s, hint ~2s.
  winAnimations: [
    { src: "/stickers/popcorn.mp4", durationMs: 2100 },
    { src: "/stickers/clapboard.mp4", durationMs: 1200 },
  ],
  hintAnimation: { src: "/stickers/hint.mp4", width: 320, aboveGap: 8, liftY: -120 },
  trex: {
    sad: "/stickers/Sad.png",
    happy: "/stickers/Happy.png",
    veryHappy: "/stickers/Very-happy.png",
  },
};

// Renders a video through canvas and keys out near-black pixels so exported
// stickers can sit cleanly over gameplay without a black rectangle.
function ChromaKeyVideo({
  src,
  width,
  height,
  onEnded,
  autoPlay = true,
  loop = false,
  threshold = 42,
  feather = 36,
  style,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !src) return;

    let disposed = false;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const draw = () => {
      if (disposed) return;
      if (video.readyState >= 2 && !video.paused && !video.ended) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(video, 0, 0, w, h);
        const frame = ctx.getImageData(0, 0, w, h);
        const data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const greenExcess = g - Math.max(r, b);
          if (greenExcess > threshold) {
            const confidence = Math.max(0, Math.min(1, (greenExcess - threshold) / Math.max(1, feather)));

            // Fade alpha out as pixels are closer to pure key green.
            data[i + 3] = Math.round(data[i + 3] * (1 - confidence));

            // Basic spill suppression to reduce green halos on edges.
            const rbAvg = (r + b) * 0.5;
            const desaturatedGreen = Math.round((g * (1 - confidence)) + (rbAvg * confidence));
            data[i + 1] = Math.max(0, Math.min(255, desaturatedGreen));
          }
        }

        ctx.putImageData(frame, 0, 0);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const start = () => {
      canvas.width = Math.max(1, Math.floor(width));
      canvas.height = Math.max(1, Math.floor(height));
      if (autoPlay) {
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
      if (!rafRef.current) rafRef.current = requestAnimationFrame(draw);
    };

    video.addEventListener("loadedmetadata", start);
    if (video.readyState >= 1) start();

    return () => {
      disposed = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      video.removeEventListener("loadedmetadata", start);
    };
  }, [src, width, height, autoPlay, threshold, feather]);

  return (
    <span style={{ display: "inline-block", width, height, ...style }}>
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop={loop}
        autoPlay={autoPlay}
        onEnded={onEnded}
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        width={Math.max(1, Math.floor(width))}
        height={Math.max(1, Math.floor(height))}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </span>
  );
}




function FilmStrip({side}) {
  const perfs = Array.from({length:30});
  return (
    <div style={{position:"fixed",top:0,[side]:0,width:20,height:"100%",background:"#1C1D21",borderRight:side==="left"?"1px solid #000":"none",borderLeft:side==="right"?"1px solid #000":"none",zIndex:50,pointerEvents:"none",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:12,gap:9,overflow:"hidden"}}>
      {perfs.map((_,i)=>(
        <div key={i} style={{width:8,height:10,borderRadius:2,background:"#0A0905",border:"1px solid #141210",flexShrink:0}}/>
      ))}
    </div>
  );
}

// 
// ICONS — hand-redrawn in the Figma sticker style (solid fill, black stroke).
// Figma exports these as image assets we can't pull binary files for, so these
// are faithful vector recreations rather than emoji stand-ins.
// 
// 
// ICONS — extracted verbatim from the user's Figma SVG export (Mashed_plot.svg).
// Paths/masks copied exactly from source, not redrawn. useId() keeps mask refs
// collision-free across repeated renders of the same icon.
// 
function IconStar({size=21}) {
  return (
    <svg width={size} height={size*(21/21)} viewBox="156 77 22 22" xmlns="http://www.w3.org/2000/svg">
      <path d="M165.883 77.9552C164.916 77.9552 163.507 80.7787 162.766 82.5555C162.643 82.851 162.393 83.0746 162.086 83.1649C160.803 83.5418 157.419 84.6458 157.062 85.8939C156.681 87.2303 158.117 88.9523 159.082 90.0584C159.331 90.3442 159.393 90.7445 159.26 91.0998C158.489 93.1583 157.665 96.6197 159.268 97.5813C160.815 98.5094 163.379 97.1318 164.879 96.035C165.224 95.7829 165.686 95.7468 166.058 95.9576C168.263 97.2082 171.918 98.8639 172.719 97.5813C173.521 96.2986 173.048 92.9757 172.623 91.0563C172.55 90.7238 172.64 90.3752 172.872 90.1266C174.136 88.7776 176.21 86.5315 176.689 85.8939C177.35 85.0118 176.909 83.6887 175.806 82.8066C175.019 82.1768 172.183 82.0857 170.432 82.1257C170.073 82.1339 169.736 81.9575 169.536 81.6589C168.551 80.1877 166.829 77.9552 165.883 77.9552Z" fill="#FFBF00"/>
      <path d="M158.783 97.1215C160.462 95.5154 163.515 93.5259 166.261 94.7462C168.063 95.5471 169.713 96.812 170.979 97.9847C169.38 97.717 167.134 96.5943 165.712 95.7575C165.549 95.662 165.346 95.678 165.198 95.7941C163.769 96.9122 160.93 98.5793 159.267 97.5815C159.071 97.4636 158.911 97.3075 158.783 97.1215Z" fill="#FF9B00"/>
      <path d="M168.466 86.8076C168.687 85.2956 173.891 82.8824 176.184 83.9409C176.553 84.1109 176.812 84.3708 176.983 84.6955C177.038 85.1276 176.95 85.5453 176.688 85.8941C176.182 86.5687 173.892 89.0415 172.663 90.3501C172.56 90.4595 172.521 90.6114 172.555 90.7575C172.943 92.3984 173.434 95.4247 172.955 97.0345C172.783 94.9895 172.432 92.7559 171.774 91.659C170.716 89.8949 168.246 88.3196 168.466 86.8076Z" fill="#FF9B00"/>
      <path d="M157.22 86.1461C159.205 85.999 163.262 86.0578 163.615 87.4692C163.935 88.7512 160.761 93.8906 158.689 96.9704C157.869 95.4933 158.703 92.4803 159.385 90.7761C159.447 90.6207 159.419 90.4447 159.309 90.3187C158.545 89.4434 157.273 88.0304 157.038 86.7564L157.22 86.1461Z" fill="#FF9B00"/>
      <path fill="none" d="M165.883 77.9552C164.916 77.9552 163.507 80.7787 162.766 82.5555C162.643 82.851 162.393 83.0746 162.086 83.1649C160.803 83.5418 157.419 84.6458 157.062 85.8939C156.681 87.2303 158.117 88.9523 159.082 90.0584C159.331 90.3442 159.393 90.7445 159.26 91.0998C158.489 93.1583 157.665 96.6197 159.268 97.5813C160.815 98.5094 163.379 97.1318 164.879 96.035C165.224 95.7829 165.686 95.7468 166.058 95.9576C168.263 97.2082 171.918 98.8639 172.719 97.5813C173.521 96.2986 173.048 92.9757 172.623 91.0563C172.55 90.7238 172.64 90.3752 172.872 90.1266C174.136 88.7776 176.21 86.5315 176.689 85.8939C177.35 85.0118 176.909 83.6887 175.806 82.8066C175.019 82.1768 172.183 82.0857 170.432 82.1257C170.073 82.1339 169.736 81.9575 169.536 81.6589C168.551 80.1877 166.829 77.9552 165.883 77.9552Z" stroke="black" strokeLinejoin="round"/>
    </svg>
  );
}

function IconHeart({size=23}) {
  return (
    <svg width={size} height={size*(24/28)} viewBox="305 73 29 25" xmlns="http://www.w3.org/2000/svg">
      <path d="M320.205 97.0425C318.613 97.0425 314.559 94.542 311.414 89.5104C306.107 81.0192 317.224 74.1987 320.205 81.6522C324.106 73.8506 333.719 82.0806 328.465 90.0411C325.877 93.9632 321.361 97.0425 320.205 97.0425Z" fill="#FD4F7E" stroke="black" strokeLinejoin="round"/>
      <path d="M310.553 81.6419C310.736 82.5507 311.429 85.0226 312.744 87.64C314.387 90.9116 317.673 94.7288 320.411 94.7288C322.601 94.7286 325.704 92.5479 326.982 91.4573C326.982 91.7225 326.902 92.2701 326.671 93.0638C325.827 93.952 324.943 94.7453 324.107 95.4046C323.293 96.047 322.517 96.5703 321.863 96.9359C321.536 97.1183 321.232 97.2656 320.964 97.3685C320.707 97.4673 320.441 97.5423 320.204 97.5423C319.696 97.5422 319.064 97.3492 318.385 97.0237C317.694 96.6924 316.909 96.2017 316.084 95.5569C314.432 94.2667 312.593 92.3394 310.99 89.7747C310.575 89.1105 310.256 88.4535 310.021 87.8109C309.919 85.333 310.22 83.0521 310.553 81.6419Z" fill="#CE4168"/>
      <path fill="none" d="M320.205 97.0425C318.613 97.0425 314.559 94.542 311.414 89.5104C306.107 81.0192 317.224 74.1987 320.205 81.6522C324.106 73.8506 333.719 82.0806 328.465 90.0411C325.877 93.9632 321.361 97.0425 320.205 97.0425Z" stroke="black" strokeLinejoin="round"/>
      <path d="M326.982 82.4517C326.982 79.7046 322.47 80.2223 321.855 82.4517C320.525 87.2781 326.982 86.7807 326.982 82.4517Z" fill="#F2BAC4"/>
    </svg>
  );
}

const TARGET_ICON_SVG = `<svg viewBox="35 75 27 24" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block">
<ellipse cx="45.768" cy="88.065" rx="8.00945" ry="9.08635" fill="#B12A2E" stroke="#000" stroke-width="0.45"/>
<ellipse cx="47.058" cy="87.783" rx="7.2985" ry="9.08635" fill="#ED4444" stroke="#000" stroke-width="0.42"/>
<ellipse cx="47.130" cy="87.702" rx="6.02486" ry="7.46314" fill="white" stroke="#000" stroke-width="0.38"/>
<ellipse cx="47.535" cy="87.614" rx="4.54503" ry="5.5768" fill="#ED4444" stroke="#000" stroke-width="0.34"/>
<ellipse cx="47.679" cy="87.582" rx="3.13588" ry="3.976" fill="white" stroke="#000" stroke-width="0.3"/>
<ellipse cx="47.830" cy="87.549" rx="1.71205" ry="2.06867" fill="#ED4444" stroke="#000" stroke-width="0.26"/>
<path d="M53.6268 83.8734L58.8403 82.7449L56.5232 86.1304L59.9989 87.8232L54.2061 88.9517L51.9303 86.8828L53.6268 83.8734Z" fill="#4076FE" stroke="#000" stroke-width="0.45" stroke-linejoin="round"/>
<rect width="11.1719" height="0.959245" rx="0.479622" transform="matrix(0.980855 -0.194741 0.194732 0.980856 47.1719 87.4032)" fill="#4B4B4B" stroke="#000" stroke-width="0.2"/>
</svg>`;

function IconTarget({size=25}) {
  return (
    <span style={{display:"inline-block",width:size,height:size*(22/25),flexShrink:0,transform:"translateY(0.5px)"}}
      dangerouslySetInnerHTML={{__html: TARGET_ICON_SVG}}/>
  );
}

function IconX({size=14}) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="27 31 18 18" xmlns="http://www.w3.org/2000/svg">
      <mask id={`x-mask-${id}`} maskUnits="userSpaceOnUse" x="28.5485" y="32.1402" width="16" height="17" fill="black">
        <rect fill="white" x="28.5485" y="32.1402" width="16" height="17"/>
        <path d="M43.1254 35.038C43.5335 35.4102 43.5626 36.0428 43.1903 36.4508L40.112 39.8252C39.7637 40.2069 39.7637 40.7912 40.1119 41.173L43.1906 44.5484C43.5627 44.9564 43.5337 45.5888 43.1257 45.961L41.3308 47.5985C40.9228 47.9707 40.2902 47.9417 39.918 47.5336L37.239 44.5963C36.8424 44.1614 36.1579 44.1614 35.7613 44.5963L33.0823 47.5336C32.7101 47.9417 32.0775 47.9707 31.6695 47.5985L29.8745 45.961C29.4666 45.5888 29.4375 44.9564 29.8096 44.5484L32.8876 41.1729C33.2358 40.7911 33.2357 40.207 32.8875 39.8252L29.8098 36.4508C29.4376 36.0428 29.4667 35.4102 29.8748 35.0381L31.6696 33.4013C32.0776 33.0292 32.71 33.0583 33.0822 33.4662L35.7614 36.4031C36.158 36.8378 36.8423 36.8378 37.2389 36.4031L39.9181 33.4662C40.2903 33.0583 40.9227 33.0292 41.3307 33.4013L43.1254 35.038Z"/>
      </mask>
      <path d="M43.1254 35.038C43.5335 35.4102 43.5626 36.0428 43.1903 36.4508L40.112 39.8252C39.7637 40.2069 39.7637 40.7912 40.1119 41.173L43.1906 44.5484C43.5627 44.9564 43.5337 45.5888 43.1257 45.961L41.3308 47.5985C40.9228 47.9707 40.2902 47.9417 39.918 47.5336L37.239 44.5963C36.8424 44.1614 36.1579 44.1614 35.7613 44.5963L33.0823 47.5336C32.7101 47.9417 32.0775 47.9707 31.6695 47.5985L29.8745 45.961C29.4666 45.5888 29.4375 44.9564 29.8096 44.5484L32.8876 41.1729C33.2358 40.7911 33.2357 40.207 32.8875 39.8252L29.8098 36.4508C29.4376 36.0428 29.4667 35.4102 29.8748 35.0381L31.6696 33.4013C32.0776 33.0292 32.71 33.0583 33.0822 33.4662L35.7614 36.4031C36.158 36.8378 36.8423 36.8378 37.2389 36.4031L39.9181 33.4662C40.2903 33.0583 40.9227 33.0292 41.3307 33.4013L43.1254 35.038Z" fill="white"/>
      <path d="M43.1254 35.038C43.5335 35.4102 43.5626 36.0428 43.1903 36.4508L40.112 39.8252C39.7637 40.2069 39.7637 40.7912 40.1119 41.173L43.1906 44.5484C43.5627 44.9564 43.5337 45.5888 43.1257 45.961L41.3308 47.5985C40.9228 47.9707 40.2902 47.9417 39.918 47.5336L37.239 44.5963C36.8424 44.1614 36.1579 44.1614 35.7613 44.5963L33.0823 47.5336C32.7101 47.9417 32.0775 47.9707 31.6695 47.5985L29.8745 45.961C29.4666 45.5888 29.4375 44.9564 29.8096 44.5484L32.8876 41.1729C33.2358 40.7911 33.2357 40.207 32.8875 39.8252L29.8098 36.4508C29.4376 36.0428 29.4667 35.4102 29.8748 35.0381L31.6696 33.4013C32.0776 33.0292 32.71 33.0583 33.0822 33.4662L35.7614 36.4031C36.158 36.8378 36.8423 36.8378 37.2389 36.4031L39.9181 33.4662C40.2903 33.0583 40.9227 33.0292 41.3307 33.4013L43.1254 35.038Z" fill="black" mask={`url(#x-mask-${id})`}/>
    </svg>
  );
}

function IconSkip({size=24,flip=false}) {
  return (
    <svg width={size} height={size*(19/24)} viewBox="335 803 25 21" style={flip?{transform:"scaleX(-1)"}:undefined} xmlns="http://www.w3.org/2000/svg">
      <path d="M360 804.5V823.5H356.059V815.629C356.059 815.441 355.953 815.269 355.786 815.184C355.619 815.098 355.418 815.113 355.266 815.223L345.261 822.449C344.93 822.688 344.469 822.452 344.469 822.044V817.885C344.469 817.697 344.363 817.525 344.196 817.439C344.029 817.354 343.828 817.369 343.676 817.479L336.793 822.449C336.462 822.688 336 822.452 336 822.044L336.002 805.955C336.002 805.547 336.464 805.311 336.795 805.55L343.676 810.517C343.828 810.626 344.029 810.641 344.196 810.556C344.363 810.47 344.469 810.299 344.469 810.111V805.955C344.469 805.548 344.93 805.312 345.261 805.55L355.267 812.774C355.419 812.884 355.619 812.9 355.786 812.814C355.953 812.729 356.059 812.557 356.059 812.369V804.5H360Z" fill="#40FDFD" stroke="black" strokeLinejoin="round"/>
    </svg>
  );
}

function IconSearch({size=23}) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="38 800 26 27" xmlns="http://www.w3.org/2000/svg">
      <mask id={`search-mask-${id}`} maskUnits="userSpaceOnUse" x="38.314" y="801.13" width="26" height="26" fill="black">
        <rect fill="white" x="38.314" y="801.13" width="26" height="26"/>
        <path d="M54.6314 802.13C59.0798 802.131 62.6859 805.738 62.6861 810.186C62.6859 814.634 59.0798 818.24 54.6314 818.241C52.8774 818.241 51.256 817.678 49.9332 816.726C50.0373 817.07 49.9802 817.455 49.7516 817.76L49.2877 818.378L49.235 818.326C47.2535 821.132 43.343 826.133 41.9693 825.859C40.1884 825.503 38.4069 824.79 39.8316 822.296C40.9528 820.334 45.1533 817.524 47.2115 816.302L47.151 816.242L47.5562 815.971C47.9659 815.698 48.4908 815.665 48.9312 815.885L48.9351 815.881C47.4775 814.424 46.5759 812.41 46.5758 810.186C46.576 805.737 50.1828 802.13 54.6314 802.13ZM54.942 804.139L54.943 804.138C54.8398 804.133 54.7359 804.13 54.6314 804.13H54.6305C54.7349 804.13 54.8389 804.134 54.942 804.139Z"/>
      </mask>
      <path d="M49.4492 818.022L47.3121 816.241C45.2936 817.429 40.9718 820.302 39.832 822.297C38.4072 824.79 40.1882 825.502 41.9691 825.859C43.3939 826.144 47.5495 820.753 49.4492 818.022Z" fill="#A45F1E"/>
      <path d="M46.3927 822.054C45.9489 822.592 45.4996 823.114 45.0616 823.59L41.1505 820.722C41.693 820.201 42.3332 819.667 43.004 819.15L46.3927 822.054Z" fill="#FDAF0A"/>
      <path d="M40.591 822.297C40.8759 821.727 44.9841 818.972 47.0025 817.666L47.7149 818.022C45.6965 819.922 41.4459 823.721 40.591 823.721C39.5224 823.721 40.2348 823.009 40.591 822.297Z" fill="#D9D9D9" fillOpacity="0.3"/>
      <path d="M49.7518 817.76L49.2877 818.378L47.1505 816.241L47.5564 815.971C47.9662 815.698 48.491 815.665 48.9315 815.885L50.0001 814.817L50.7125 815.173L49.6439 816.241C50.0526 816.65 50.0986 817.297 49.7518 817.76Z" fill="#FDAF0A"/>
      <circle cx="53.2058" cy="810.898" r="6.05532" fill="#C4F2F0"/>
      <circle cx="54.6306" cy="810.186" r="7.05532" fill="#C4F2F0" stroke="#18B9FF" strokeWidth="2"/>
      <path d="M54.6314 802.13C59.0798 802.131 62.6859 805.738 62.6861 810.186C62.6859 814.634 59.0798 818.24 54.6314 818.241C52.8774 818.241 51.256 817.678 49.9332 816.726C50.0373 817.07 49.9802 817.455 49.7516 817.76L49.2877 818.378L49.235 818.326C47.2535 821.132 43.343 826.133 41.9693 825.859C40.1884 825.503 38.4069 824.79 39.8316 822.296C40.9528 820.334 45.1533 817.524 47.2115 816.302L47.151 816.242L47.5562 815.971C47.9659 815.698 48.4908 815.665 48.9312 815.885L48.9351 815.881C47.4775 814.424 46.5759 812.41 46.5758 810.186C46.576 805.737 50.1828 802.13 54.6314 802.13ZM54.942 804.139L54.943 804.138C54.8398 804.133 54.7359 804.13 54.6314 804.13H54.6305C54.7349 804.13 54.8389 804.134 54.942 804.139Z" fill="black" mask={`url(#search-mask-${id})`}/>
    </svg>
  );
}

// Magnifying glass over a magenta filmstrip, styled to match the provided
// reference icon (gold ring, purple handle, pink strip, dark outline).
function IconHintGlass({size=26}) {
  return (
    <svg width={size} height={size*(58/80)} viewBox="0 0 80 58" xmlns="http://www.w3.org/2000/svg">
      {/* film strip behind lens */}
      <rect x="4" y="15" width="63" height="19" rx="3" fill="#5D38B6" stroke="#1D1238" strokeWidth="1.8"/>
      <rect x="11" y="18" width="16" height="13" rx="1.5" fill="#E248A8"/>
      <rect x="29" y="18" width="16" height="13" rx="1.5" fill="#E248A8"/>
      <rect x="47" y="18" width="16" height="13" rx="1.5" fill="#E248A8"/>

      {/* sprocket holes */}
      <g fill="#2A1851">
        <rect x="6" y="16.5" width="2.2" height="3" rx="1"/>
        <rect x="10" y="16.5" width="2.2" height="3" rx="1"/>
        <rect x="14" y="16.5" width="2.2" height="3" rx="1"/>
        <rect x="18" y="16.5" width="2.2" height="3" rx="1"/>
        <rect x="22" y="16.5" width="2.2" height="3" rx="1"/>
        <rect x="58" y="16.5" width="2.2" height="3" rx="1"/>
        <rect x="62" y="16.5" width="2.2" height="3" rx="1"/>
        <rect x="66" y="16.5" width="2.2" height="3" rx="1"/>
        <rect x="6" y="29.5" width="2.2" height="3" rx="1"/>
        <rect x="10" y="29.5" width="2.2" height="3" rx="1"/>
        <rect x="14" y="29.5" width="2.2" height="3" rx="1"/>
        <rect x="18" y="29.5" width="2.2" height="3" rx="1"/>
        <rect x="22" y="29.5" width="2.2" height="3" rx="1"/>
        <rect x="58" y="29.5" width="2.2" height="3" rx="1"/>
        <rect x="62" y="29.5" width="2.2" height="3" rx="1"/>
        <rect x="66" y="29.5" width="2.2" height="3" rx="1"/>
      </g>

      {/* tiny symbols in the two center frames */}
      <g stroke="#2A1851" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="34" cy="22" r="1.7" fill="#2A1851"/>
        <path d="M34 24.2L31.6 26.8L34.2 26.8L36.8 25"/>
        <path d="M34.2 26.8L32.6 29.1"/>
        <path d="M34.2 26.8L36.3 29"/>
      </g>
      <path d="M45 27.8C45 25.9 46.6 24.5 48.5 24.5C49.6 24.5 50.6 25 51.2 25.8C52 25.1 53.1 24.7 54.2 24.7C56.4 24.7 58.1 26.1 58.1 28C58.1 29.6 56.8 30.9 55.2 30.9H47.8C46.2 30.9 45 29.5 45 27.8Z" fill="#A45F1E" stroke="#2A1851" strokeWidth="1.5"/>

      {/* ferrule and handle */}
      <rect x="52.5" y="35" width="5" height="3.8" rx="1" fill="#FDAF0A" stroke="#1D1238" strokeWidth="1.2" transform="rotate(45 55 36.9)"/>
      <rect x="55.5" y="36.8" width="21" height="8.5" rx="4.2" fill="#6941C6" stroke="#1D1238" strokeWidth="1.8" transform="rotate(45 66 41)"/>
      <path d="M60 42.5L70.4 52.9" stroke="#8E6BE7" strokeWidth="2" strokeLinecap="round"/>

      {/* lens ring */}
      <circle cx="47" cy="25" r="18.6" fill="none" stroke="#1D1238" strokeWidth="2.2"/>
      <circle cx="47" cy="25" r="16.2" fill="none" stroke="#FDAF0A" strokeWidth="5.2"/>
      <path d="M44.5 12.8C47.5 13 50.1 14.2 52.2 16.5" stroke="#FFF8D9" strokeWidth="2.1" strokeLinecap="round"/>
      <circle cx="53.8" cy="18.2" r="1" fill="#FFF8D9"/>
    </svg>
  );
}

function IconCheck({size=10,color="#fff"}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path fill="none" d="M4 13l5 5L20 6" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Simple colorable X-mark for generic "wrong/missed" indicators (progress pips, end-screen
// chips) — distinct from IconX above, which is the exact Figma exit-button icon with fixed colors.
function IconXMark({size=10,color="#fff"}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path fill="none" d="M5 5l14 14M19 5L5 19" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  );
}


function IconCalendar({size=48}) {
  return (
    <svg width={size} height={size*(53/62)} viewBox="43 224 62 53" xmlns="http://www.w3.org/2000/svg">
      <path d="M44.1398 238.331L45.5 243.5L54 240L49.5 231.5L47.1803 232.392C44.8009 233.307 43.4911 235.866 44.1398 238.331Z" fill="#1B5EA7"/>
      <path d="M94 236L48.5 240.5L47.2847 236.125C46.6161 233.718 48.2927 231.294 50.7806 231.07L87.5651 227.764C89.3105 227.607 90.9547 228.604 91.622 230.225L94 236Z" fill="#1781D5"/>
      <path d="M55.5 236.097C53.1 235.297 53.8333 233.764 54.5 233.097C55.0168 231.897 55.5487 231.167 55.5 231C55.5 230.5 54.5 231 51.5 231C51.5 230.5 52.5 227.597 55 227.097C57.5 226.597 59.5 228 60 230C60.5 232 58.5 237.097 55.5 236.097Z" fill="#ACB7AC"/>
      <path d="M69 235.102C66.6 234.302 67.3333 232.768 68 232.102C68.5168 230.902 69.0487 230.172 69 230.005C69 229.505 68 230.005 65 230.005C65 229.505 66 226.602 68.5 226.102C71 225.602 73 227.005 73.5 229.005C74 231.005 72 236.102 69 235.102Z" fill="#ACB7AC"/>
      <path d="M82 234.102C79.6 233.302 80.3333 231.768 81 231.102C81.5168 229.902 82.0487 229.172 82 229.005C82 228.505 81 229 78 229C78 228.5 79 225.602 81.5 225.102C84 224.602 86 226.005 86.5 228.005C87 230.005 85 235.102 82 234.102Z" fill="#ACB7AC"/>
      <path d="M103.85 264.654L94 236L48.5 240.5L56.8205 273.32C57.2044 274.834 58.6862 275.8 60.2267 275.541L101.511 268.588C103.338 268.28 104.452 266.406 103.85 264.654Z" fill="white"/>
      <path d="M55.3014 256.486C55.0109 255.346 55.7634 254.202 56.9258 254.017L59.8744 253.549C60.8205 253.399 61.7402 253.941 62.0677 254.841L62.845 256.978C63.2664 258.136 62.5495 259.396 61.3384 259.626L58.1896 260.224C57.1516 260.421 56.1393 259.776 55.8786 258.753L55.3014 256.486Z" fill="#2A2A2A"/>
      <path d="M58.2372 265.365C57.9467 264.225 58.6992 263.081 59.8616 262.896L62.8102 262.428C63.7563 262.278 64.676 262.819 65.0035 263.72L65.7808 265.857C66.2022 267.015 65.4853 268.275 64.2742 268.505L61.1254 269.103C60.0873 269.3 59.0751 268.655 58.8144 267.632L58.2372 265.365Z" fill="#2A2A2A"/>
      <path d="M63.5906 245.634C63.3001 244.493 64.0526 243.35 65.215 243.165L68.1636 242.697C69.1097 242.546 70.0294 243.088 70.3568 243.988L71.1342 246.125C71.5556 247.284 70.8387 248.544 69.6276 248.774L66.4788 249.372C65.4407 249.569 64.4285 248.924 64.1678 247.9L63.5906 245.634Z" fill="#2A2A2A"/>
      <path d="M66.5265 254.513C66.236 253.372 66.9885 252.229 68.1509 252.044L71.0995 251.576C72.0456 251.425 72.9653 251.967 73.2928 252.867L74.0701 255.004C74.4915 256.163 73.7746 257.423 72.5635 257.653L69.4147 258.25C68.3767 258.447 67.3644 257.803 67.1037 256.779L66.5265 254.513Z" fill="#ED292A"/>
      <path d="M69.4623 263.392C69.1718 262.251 69.9243 261.108 71.0867 260.923L74.0353 260.455C74.9814 260.304 75.9011 260.846 76.2285 261.746L77.0059 263.883C77.4273 265.042 76.7104 266.302 75.4993 266.532L72.3505 267.129C71.3124 267.326 70.3002 266.682 70.0395 265.658L69.4623 263.392Z" fill="#2A2A2A"/>
      <path d="M80.6874 261.418C80.3969 260.278 81.1494 259.134 82.3118 258.95L85.2604 258.481C86.2065 258.331 87.1262 258.873 87.4536 259.773L88.231 261.91C88.6524 263.068 87.9355 264.329 86.7244 264.558L83.5756 265.156C82.5375 265.353 81.5253 264.709 81.2646 263.685L80.6874 261.418Z" fill="#2A2A2A"/>
      <path d="M74.8157 243.66C74.5252 242.52 75.2777 241.376 76.4401 241.192L79.3887 240.723C80.3348 240.573 81.2545 241.115 81.5819 242.015L82.3593 244.152C82.7807 245.31 82.0638 246.571 80.8527 246.801L77.7039 247.398C76.6658 247.595 75.6536 246.951 75.3928 245.927L74.8157 243.66Z" fill="#2A2A2A"/>
      <path d="M84.9099 241.771C84.6194 240.631 85.3719 239.487 86.5344 239.302L89.483 238.834C90.429 238.684 91.3487 239.226 91.6762 240.126L92.4535 242.263C92.8749 243.421 92.158 244.681 90.9469 244.911L87.7981 245.509C86.7601 245.706 85.7478 245.061 85.4871 244.038L84.9099 241.771Z" fill="#2A2A2A"/>
      <path d="M87.8457 250.65C87.5552 249.51 88.3077 248.366 89.4702 248.181L92.4188 247.713C93.3648 247.563 94.2845 248.105 94.612 249.005L95.3893 251.142C95.8107 252.3 95.0938 253.56 93.8827 253.79L90.7339 254.388C89.6959 254.585 88.6836 253.94 88.4229 252.917L87.8457 250.65Z" fill="#2A2A2A"/>
      <path d="M77.7516 252.539C77.4611 251.399 78.2136 250.255 79.376 250.071L82.3246 249.602C83.2707 249.452 84.1904 249.994 84.5179 250.894L85.2952 253.031C85.7166 254.189 84.9997 255.45 83.7886 255.679L80.6398 256.277C79.6018 256.474 78.5895 255.83 78.3288 254.806L77.7516 252.539Z" fill="#2A2A2A"/>
    </svg>
  );
}

function IconClapper({size=48}) {
  return (
    <svg width={size} height={size*(66/66)} viewBox="42 353 66 66" xmlns="http://www.w3.org/2000/svg">
      <path d="M51.9163 384.801C52.8685 389.932 57.6928 411.716 59.2163 414.636C60.2437 416.605 61.2151 417.236 62.0551 417.471C56.6857 417.124 54.8054 414.064 54.4554 412.414L47.4728 384.008L51.9163 384.801Z" fill="#750FA6"/>
      <path d="M100.953 405.59C94.9865 407.495 72.4761 414.297 62.0551 417.471L62.2316 416.382L98.8904 372.423L103.493 393.529C104.921 399.56 106.92 403.686 100.953 405.59Z" fill="#B93EF5"/>
      <path d="M99.0491 372.581L62.0728 417.493C60.1685 417.493 58.6344 415.482 58.1054 414.477L51.9163 385.436L99.0491 372.581Z" fill="#B100FF"/>
      <path d="M89.5273 375.597L59.6924 384.008L61.438 374.327L90.6382 365.758L89.5273 375.597Z" fill="#F8F8FA"/>
      <path d="M90.6381 365.916L63.1837 373.851L61.2793 372.105L84.2903 365.44L90.6381 365.916Z" fill="#ACB7AC"/>
      <path d="M71.912 371.312L70.1664 380.992L79.8469 378.612L81.2751 368.931L74.6099 368.297L66.199 370.677L71.912 371.312Z" fill="black"/>
      <path d="M88.099 358.934L62.3902 372.74L53.0271 367.979L79.5294 354.331L88.099 358.934Z" fill="#F8F8FA"/>
      <path d="M79.5295 354.649L53.662 367.979L50.488 366.868L75.086 354.173L79.5295 354.649Z" fill="#ACB7AC"/>
      <path d="M59.6924 383.849L52.3923 386.071L55.2489 375.279L62.2315 372.74L63.1837 373.375L59.6924 383.849Z" fill="black"/>
      <path d="M50.0712 385.618L52.3924 386.071L56.3598 375.755L62.2316 372.74L53.9793 367.662L50.6467 366.868C49.0598 367.556 45.6954 369.185 44.9336 370.201C43.9815 371.471 43.0293 372.423 43.3467 374.803C43.4982 375.94 44.1093 378.376 44.7349 380.695C45.417 383.224 47.5007 385.116 50.0712 385.618Z" fill="black" stroke="black"/>
      <path d="M57.1983 383.4L55.6452 384.165C53.5308 385.206 50.9797 384.203 50.1772 381.987C49.3657 379.746 48.4775 377.207 47.8952 375.315C46.6256 371.189 50.2757 370.395 51.7039 371.03C53.8418 371.98 56.2996 374.393 58.4327 376.68C60.3295 378.713 59.6927 382.171 57.1983 383.4Z" fill="#ACB7AC"/>
      <circle cx="51.1229" cy="374.01" r="1.90436" fill="#858585"/>
      <circle cx="53.9793" cy="381.945" r="1.58696" fill="#858585"/>
      <path d="M61.9142 363.377L70.0077 368.614L78.736 364.012L70.6425 358.616L67.1512 358.14L57.7881 363.06L61.9142 363.377Z" fill="black"/>
      <path d="M83.2241 396.399C82.9828 397.591 82.4841 398.858 81.3211 399.214L80.3478 399.511C78.6473 400.031 76.6034 399.085 76.6542 397.307C76.6554 397.266 76.6571 397.225 76.6594 397.183C76.6956 396.452 76.8635 395.745 77.1629 395.063C77.4731 394.377 78.2413 393.103 79.4673 391.24C80.1245 390.259 80.3622 389.472 80.1806 388.878C79.999 388.284 79.6803 387.879 79.2247 387.664C78.7766 387.435 78.1961 387.429 77.483 387.647C76.716 387.881 76.1562 388.33 75.8036 388.993C75.0432 390.461 74.3292 392.176 72.7011 392.462L72.328 392.527C70.5489 392.839 68.7529 391.658 68.9511 389.863C69.0737 388.751 69.4041 387.712 69.9421 386.745C70.9788 384.88 73.0097 383.486 76.0347 382.561C78.3899 381.841 80.4416 381.752 82.1899 382.292C84.5623 383.02 86.0871 384.491 86.7641 386.706C87.0448 387.624 87.0617 388.588 86.8148 389.596C86.568 390.605 85.8495 391.965 84.6594 393.675C83.8325 394.873 83.354 395.781 83.2241 396.399ZM78.4477 405.062C77.9566 403.456 78.8609 401.755 80.4674 401.264L81.2455 401.026C82.8519 400.535 84.5523 401.439 85.0433 403.046C85.5344 404.652 84.6302 406.353 83.0237 406.844L82.2456 407.082C80.6391 407.573 78.9388 406.669 78.4477 405.062Z" fill="#FFBF38"/>
    </svg>
  );
}

function IconStopwatch({size=48}) {
  return (
    <svg width={size} height={size*(69/63)} viewBox="42 477 63 69" xmlns="http://www.w3.org/2000/svg"
      style={{filter:"drop-shadow(1px 0 0 #1C1D21) drop-shadow(-1px 0 0 #1C1D21) drop-shadow(0 1px 0 #1C1D21) drop-shadow(0 -1px 0 #1C1D21)"}}>
      <path d="M75.1234 483.645C75.1234 484.925 73.4964 485.824 72.785 486.179C70.651 486.713 65.7427 487.886 63.1818 488.313C59.9808 488.847 58.3802 485.112 59.4472 482.978C60.5143 480.844 62.1148 479.244 65.3159 478.71C68.5169 478.177 71.718 478.177 73.3185 478.71C74.9191 479.244 75.1234 482.045 75.1234 483.645Z" fill="#FFBF38"/>
      <ellipse cx="67.9514" cy="485.795" rx="7.20699" ry="2.97483" transform="rotate(-12.2569 67.9514 485.795)" fill="#D78428"/>
      <rect x="70.629" y="483.645" width="7.63548" height="5.33512" rx="2" transform="rotate(73.2547 70.629 483.645)" fill="#FFBF38"/>
      <ellipse cx="73.8642" cy="515.719" rx="29.2079" ry="29.3218" transform="rotate(-3.33518 73.8642 515.719)" fill="#B12A2E"/>
      <ellipse cx="75.6128" cy="514.575" rx="27.7847" ry="28.3536" transform="rotate(-3.33518 75.6128 514.575)" fill="#F462AC"/>
      <ellipse cx="75.6179" cy="514.129" rx="20.7318" ry="20.9081" transform="rotate(-3.33518 75.6179 514.129)" fill="#FFD9E3"/>
      <path d="M74.4011 493.256C85.8316 492.59 95.6424 501.395 96.3142 512.923C96.787 521.037 92.6051 528.338 86.1003 532.181C90.7761 528.079 93.583 521.914 93.1912 515.188C92.5194 503.661 82.7085 494.855 71.2781 495.521C67.893 495.719 64.7458 496.725 62.0095 498.343C65.3479 495.413 69.6389 493.533 74.4011 493.256Z" fill="#B12A2E"/>
      <path d="M65.6448 526.872C67.0228 520.451 71.0236 506.942 76.8549 509.755C84.197 513.296 72.5366 523.357 67.2181 527.79C66.5055 528.384 65.4501 527.779 65.6448 526.872Z" fill="#B100FF"/>
      <path d="M45.1345 498.471L43.6223 496.959C43.318 496.655 43.2435 496.192 43.4567 495.818C43.927 494.993 44.8793 493.441 46.3137 491.648C47.8303 489.752 49.6162 488.395 50.5228 487.769C50.8727 487.527 51.3342 487.562 51.661 487.834L53.5482 489.407C53.9725 489.761 54.0298 490.391 53.6762 490.815L51.6489 493.248L53.5198 494.745C53.9571 495.095 54.0219 495.736 53.6633 496.166L52.2764 497.83C51.9278 498.249 51.3086 498.311 50.8834 497.971L48.9813 496.449L46.4818 498.532C46.0845 498.863 45.5002 498.837 45.1345 498.471Z" fill="#FFBF38"/>
      <path fill="none" d="M74.0563 528.46C82.3065 528.46 88.9946 522.011 88.9946 514.055C88.9946 506.1 82.3065 499.65 74.0563 499.65" stroke="#3892FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconChevronRight({size=18,color="#fff"}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path fill="none" d="M9 5l7 7-7 7" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Logo({small}) {
  return (
    <div style={{textAlign:small?"left":"center"}}>
      <div style={{display:"inline-flex",alignItems:"baseline",gap:small?3:6,position:"relative"}}>
        <h1 style={{
          margin:0, fontFamily:FONT_FIGMA_STICKER,
          fontSize:small?22:44, fontWeight:400, letterSpacing:"0.02em", lineHeight:1,
          ...YELLOW_STICKER_TEXT,
        }}>PLOT</h1>
        <h1 style={{
          margin:0, fontFamily:FONT_FIGMA_STICKER,
          fontSize:small?22:44, fontWeight:400, letterSpacing:"0.02em", lineHeight:1,
          color:"#fff",
          textShadow:"0 2px 0 #1C1D21",
        }}>MIX</h1>
      </div>
      {!small&&<p style={{margin:"8px 0 0",fontFamily:FONT_FIGMA_STICKER,fontSize:11,color:"rgba(255,255,255,0.7)",letterSpacing:"0.28em",textTransform:"uppercase"}}>Find the mashed title</p>}
    </div>
  );
}

function DiffBadge({level, reason}) {
  const s={
    Easy:   {bg:T.green},
    Medium: {bg:T.gold},
    Hard:   {bg:T.red},
  }[level]||{bg:T.textMuted};
  const minWidthByLevel = { Easy: 58, Medium: 86, Hard: 62 };
  const [show,setShow]=useState(false);
  return (
    <div style={{position:"relative",display:"inline-block"}}>
      <span onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}
        style={{
          background:s.bg,
          color:"#FFFFFF",
          border:`2px solid ${T.border}`,
          borderRadius:999,
          minHeight:28,
          minWidth:minWidthByLevel[level] || 62,
          padding:"0 12px",
          fontSize:11,
          lineHeight:1,
          fontFamily:FONT_FIGMA_STICKER,
          fontWeight:700,
          letterSpacing:"0.04em",
          textShadow:"none",
          textTransform:"uppercase",
          cursor:reason?"help":"default",
          display:"inline-flex",
          alignItems:"center",
          justifyContent:"center",
          whiteSpace:"nowrap",
          boxShadow:"0 2px 0 #1C1D21",
        }}>
        {level}
      </span>
      {reason&&show&&(
        <div style={{position:"absolute",bottom:"calc(100% + 8px)",left:0,background:"#fff",border:`2px solid ${T.border}`,borderRadius:T.r,padding:"12px 16px",fontSize:13,fontFamily:"'Outfit',sans-serif",color:T.textSecondary,zIndex:100,fontStyle:"italic",boxShadow:T.shadow,maxWidth:280,lineHeight:1.65,whiteSpace:"normal"}}>
          {reason}
        </div>
      )}
    </div>
  );
}

function TensionBar({tension}) {
  if(tension<=0) return null;
  const hue=Math.round(20-tension*20);
  return (
    <div style={{width:"100%",height:6,background:T.surfaceAlt,borderRadius:3,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${tension*100}%`,background:`hsl(${hue},80%,50%)`,transition:"width 1.2s ease,background 1.2s ease",borderRadius:3}}/>
    </div>
  );
}

function ProgressBar({current,total}) {
  return (
    <div style={{display:"flex",gap:3}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{flex:1,height:6,borderRadius:3,background:i<current?T.gold:T.border,transition:"background 0.4s"}}/>
      ))}
    </div>
  );
}

function ScoreChip({pts,label,color}) {
  return (
    <div style={{textAlign:"center"}}>
      <div style={{fontFamily:FONT_FIGMA_STICKER,fontSize:T.xl,color:color||T.gold,lineHeight:1,fontWeight:700}}>{pts}</div>
      <div style={{fontFamily:FONT_FIGMA_STICKER,fontSize:T.xs,color:T.textMuted,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:4}}>{label}</div>
    </div>
  );
}

// Confidence mode picker
const GuessInput = forwardRef(function GuessInput({onSubmit,disabled,allowSingleLetterY=false},fref) {
  const [val,setVal]=useState("");
  const ref=useRef(null);
  const go=()=>{
    const guess = val.trim();
    const isSingleLetterY = allowSingleLetterY && norm(guess) === "y";
    if((guess.length<2 && !isSingleLetterY)||disabled)return;
    onSubmit(guess);
    setVal("");
    ref.current?.focus();
  };
  useImperativeHandle(fref,()=>({
    submit:go,
    hasValue: val.trim().length>=2 || (allowSingleLetterY && norm(val.trim()) === "y")
  }));
  return (
    <div style={{position:"relative",width:"100%",height:41,opacity:disabled?0.5:1}}>
      <img src="/design-reference/Frame%2019.svg" alt="" aria-hidden="true" draggable="false"
        style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block",pointerEvents:"none",userSelect:"none"}}/>
      <input ref={ref} value={val} onChange={e=>setVal(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&go()} disabled={disabled}
        placeholder="Type your guess..." aria-label="Movie title guess" className="guess-input"
        autoComplete="new-password" autoCorrect="off" autoCapitalize="none" spellCheck={false}
        name="plotmix-guess-input"
        data-lpignore="true"
        data-1p-ignore="true"
        data-form-type="other"
        inputMode="text" enterKeyHint="go"
        style={{position:"absolute",left:0,top:0,width:"100%",height:"100%",boxSizing:"border-box",background:"transparent",border:"none",padding:"10px 16px 8px",color:T.textPrimary,fontSize:14,fontFamily:FONT_DISPLAY,letterSpacing:"0.02em",textTransform:"uppercase",fontWeight:400,lineHeight:"17px",outline:"none"}}/>
    </div>
  );
});
function HowToPlayModal({onClose}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:400,overflowY:"auto"}}>
      <Onboarding onDone={onClose} showClose finalLabel="Got It"/>
    </div>
  );
}

// Persistent floating "?" button — shown everywhere except inside the modal itself
function HelpButton({onClick}) {
  return (
    <button onClick={onClick} aria-label="How to play"
      style={{position:"fixed",bottom:24,right:24,width:44,height:44,borderRadius:"50%",background:T.gold,border:`2px solid ${T.border}`,cursor:"pointer",zIndex:100,boxShadow:T.shadow,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",padding:0}}>
      <span style={{...WHITE_STICKER_TEXT,fontSize:18,lineHeight:1,display:"inline-block",transform:"translateY(1px)"}}>?</span>
    </button>
  );
}

// Onboarding wrapper — shows modal on first visit, then marks done
// Chevron arrow used by the carousel nav buttons — exact path from carousel_2.svg
function IconCarouselArrow({size=14,flip=false}) {
  return (
    <svg width={size} height={size} viewBox="347 813 8 12" style={{transform:flip?"scaleX(-1)":"none"}} xmlns="http://www.w3.org/2000/svg">
      <path d="M347.5 824.086V814.914C347.5 814.023 348.577 813.577 349.207 814.207L353.793 818.793C354.183 819.183 354.183 819.817 353.793 820.207L349.207 824.793C348.577 825.423 347.5 824.977 347.5 824.086Z" fill="white" stroke="black" strokeLinejoin="round"/>
    </svg>
  );
}

function LabelAsset({src,height=11}) {
  return <img src={src} alt="" aria-hidden="true" draggable="false" style={{display:"block",height,width:"auto",pointerEvents:"none"}}/>;
}

function GuessLabelSvg() {
  return <LabelAsset src="/design-reference/label-guess.svg" height={10}/>;
}

function SkipLabelSvg() {
  return <LabelAsset src="/design-reference/label-skip.svg" height={10}/>;
}

function IntroVideoScreen({onDone}) {
  const [didFinish, setDidFinish] = useState(false);
  const videoRef = useRef(null);
  const endTimerRef = useRef(null);

  const finish = () => {
    if (didFinish) return;
    setDidFinish(true);
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }
    onDone();
  };

  const scheduleCutoff = (durationSec) => {
    if (!Number.isFinite(durationSec) || durationSec <= 0) return;
    const cutoffMs = Math.max(250, Math.round((durationSec - 4) * 1000));
    if (endTimerRef.current) clearTimeout(endTimerRef.current);
    endTimerRef.current = setTimeout(finish, cutoffMs);
  };

  const handlePlaying = (e) => {
    scheduleCutoff(e.currentTarget?.duration);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && video.paused) {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
    return () => {
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    };
  }, []);

  return (
    <div style={{minHeight:"100dvh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <video
        ref={videoRef}
        src="/design-reference/it_s_nearly_perfect_except_th.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onPlaying={handlePlaying}
        onEnded={finish}
        onError={finish}
        style={{display:"block",width:"100%",height:"100dvh",objectFit:"cover",background:"#000"}}
      />
    </div>
  );
}

function Onboarding({onDone, showClose=false, finalLabel="Let's Start", showSkip=false, onSkip}) {
  const [step,setStep] = useState(0);
  const isLast = step === 2;
  const slideSrc = `/design-reference/carousel%20${step+1}.svg`;
  const skipHandler = onSkip || onDone;

  // Figma geometry on a 402x874 frame.
  const NAV_Y = 804;
  const NAV_W = 46;
  const NAV_H = 47;
  const BACK_X = 30;
  const NEXT_X = 327;
  const CTA_X = 105;
  const CTA_W = 192;

  return (
    <div style={{height:"100dvh",background:T.bg,display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden"}}>
      <div style={{position:"relative",width:"min(402px, calc(100dvh * 402 / 874))",height:"min(874px, 100dvh)"}}>
        <img src={slideSrc} alt="How to play" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block",userSelect:"none",pointerEvents:"none"}}/>

        {showClose&&(
          <button onClick={onDone} aria-label="Close"
            style={{position:"absolute",top:`${25/874*100}%`,left:`${20/402*100}%`,width:`${33/402*100}%`,height:`${31/874*100}%`,background:"#4845F3",border:`2px solid ${T.border}`,borderRadius:8,boxShadow:T.shadowSm,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:2}}>
            <IconX size={15}/>
          </button>
        )}

        {step>0&&(
          <button onClick={()=>setStep(s=>Math.max(0,s-1))} aria-label="Back"
            style={{position:"absolute",top:`${NAV_Y/874*100}%`,left:`${BACK_X/402*100}%`,width:`${NAV_W/402*100}%`,height:`${NAV_H/874*100}%`,background:"transparent",border:"none",padding:0,cursor:"pointer",zIndex:2}}/>
        )}

        {!isLast&&(
          <button onClick={()=>setStep(s=>Math.min(2,s+1))} aria-label="Next"
            style={{position:"absolute",top:`${NAV_Y/874*100}%`,left:`${NEXT_X/402*100}%`,width:`${NAV_W/402*100}%`,height:`${NAV_H/874*100}%`,background:"transparent",border:"none",padding:0,cursor:"pointer",zIndex:2}}/>
        )}

        {showSkip&&(
          <button onClick={skipHandler} aria-label="Skip how to play"
            style={{position:"absolute",top:`${20/874*100}%`,right:`${16/402*100}%`,background:"rgba(36,29,102,0.96)",border:`2px solid ${T.border}`,borderRadius:999,padding:"8px 12px",fontFamily:FONT_FIGMA_STICKER,fontSize:10,color:"#FFFFFF",textTransform:"uppercase",letterSpacing:"0.04em",cursor:"pointer",zIndex:3,boxShadow:"0 2px 0 #1C1D21"}}>
            Skip How To
          </button>
        )}

        {isLast&&(
          <button onClick={onDone} aria-label={finalLabel}
            style={{position:"absolute",top:`${NAV_Y/874*100}%`,left:`${CTA_X/402*100}%`,width:`${CTA_W/402*100}%`,height:`${NAV_H/874*100}%`,background:"transparent",border:"none",padding:0,cursor:"pointer",zIndex:2}}/>
        )}

      </div>
    </div>
  );
}

// 
// MODE SELECT
// 
// 
// MODE SELECT — rendered directly from the Figma export (Select_mode.svg).
// The artwork below is the untouched vector from the design file: card shapes,
// icons and label typography are the real thing, not CSS approximations.
// Only the checkerboard is swapped for a CSS tile (it was 14,000 identical rects).
// Interaction is transparent hit-areas positioned over the card geometry.
// 
const MODESELECT_ART = `
<g clip-path="url(#clip0_2_177825)">
<g clip-path="url(#clip1_2_177825)">
</g>
<mask id="path-14176-inside-1_2_177825" fill="white">
<path d="M0 0H403V165H0V0Z"/>
</mask>
<path d="M0 0H403V165H0V0Z" fill="#12287E"/>
<path d="M403 165V164H0V165V166H403V165Z" fill="black" mask="url(#path-14176-inside-1_2_177825)"/>
<g filter="url(#filter0_d_2_177825)">
<mask id="path-14178-outside-2_2_177825" maskUnits="userSpaceOnUse" x="121" y="74" width="161" height="21" fill="black">
<rect fill="white" x="121" y="74" width="161" height="21"/>
<path d="M131.648 76.2C133.152 76.2 134.464 76.456 135.584 76.968C136.704 77.48 137.56 78.176 138.152 79.056C138.744 79.936 139.04 80.92 139.04 82.008C139.04 83.8 138.48 85.208 137.36 86.232C136.24 87.24 134.336 87.744 131.648 87.744H128.48V92.352C128.48 92.528 128.416 92.68 128.288 92.808C128.16 92.936 128.008 93 127.832 93H122.672C122.496 93 122.344 92.936 122.216 92.808C122.088 92.68 122.024 92.528 122.024 92.352V76.848C122.024 76.672 122.088 76.52 122.216 76.392C122.344 76.264 122.496 76.2 122.672 76.2H131.648ZM131.552 83.304C131.936 83.304 132.24 83.192 132.464 82.968C132.688 82.728 132.8 82.416 132.8 82.032C132.8 81.632 132.688 81.304 132.464 81.048C132.24 80.792 131.936 80.664 131.552 80.664H128.504V83.304H131.552ZM157.415 88.08C157.591 88.08 157.743 88.144 157.871 88.272C157.999 88.4 158.063 88.552 158.063 88.728V92.352C158.063 92.528 157.999 92.68 157.871 92.808C157.743 92.936 157.591 93 157.415 93H143.399C143.223 93 143.071 92.936 142.943 92.808C142.815 92.68 142.751 92.528 142.751 92.352V76.848C142.751 76.672 142.815 76.52 142.943 76.392C143.071 76.264 143.223 76.2 143.399 76.2H148.583C148.759 76.2 148.911 76.264 149.039 76.392C149.167 76.52 149.231 76.672 149.231 76.848V88.08H157.415ZM178.909 86.064C178.909 88.512 178.093 90.32 176.461 91.488C174.845 92.656 172.685 93.24 169.981 93.24C167.277 93.24 165.109 92.656 163.477 91.488C161.861 90.32 161.053 88.496 161.053 86.016V83.184C161.053 81.552 161.437 80.2 162.205 79.128C162.989 78.04 164.053 77.24 165.397 76.728C166.741 76.216 168.269 75.96 169.981 75.96C171.693 75.96 173.213 76.216 174.541 76.728C175.885 77.24 176.949 78.032 177.733 79.104C178.517 80.176 178.909 81.52 178.909 83.136V86.064ZM167.533 86.52C167.533 87.176 167.749 87.68 168.181 88.032C168.629 88.384 169.229 88.56 169.981 88.56C170.733 88.56 171.325 88.384 171.757 88.032C172.205 87.664 172.429 87.152 172.429 86.496V82.704C172.429 82.048 172.205 81.544 171.757 81.192C171.325 80.824 170.733 80.64 169.981 80.64C169.229 80.64 168.629 80.816 168.181 81.168C167.749 81.52 167.533 82.024 167.533 82.68V86.52ZM198.652 76.2C198.828 76.2 198.98 76.264 199.108 76.392C199.236 76.52 199.3 76.672 199.3 76.848V80.712C199.3 80.888 199.236 81.04 199.108 81.168C198.98 81.296 198.828 81.36 198.652 81.36H193.492V92.352C193.492 92.528 193.428 92.68 193.3 92.808C193.172 92.936 193.02 93 192.844 93H187.9C187.724 93 187.572 92.936 187.444 92.808C187.316 92.68 187.252 92.528 187.252 92.352V81.36H182.092C181.916 81.36 181.764 81.296 181.636 81.168C181.508 81.04 181.444 80.888 181.444 80.712V76.848C181.444 76.672 181.508 76.52 181.636 76.392C181.764 76.264 181.916 76.2 182.092 76.2H198.652ZM234.297 76.848C234.537 76.416 234.881 76.2 235.329 76.2H239.721C239.897 76.2 240.049 76.264 240.177 76.392C240.305 76.52 240.369 76.672 240.369 76.848V92.352C240.369 92.528 240.305 92.68 240.177 92.808C240.049 92.936 239.897 93 239.721 93H235.377C235.201 93 235.049 92.936 234.921 92.808C234.793 92.68 234.729 92.528 234.729 92.352V84.912L232.977 88.368C232.929 88.48 232.817 88.608 232.641 88.752C232.465 88.896 232.241 88.968 231.969 88.968H230.337C230.065 88.968 229.841 88.896 229.665 88.752C229.489 88.608 229.377 88.48 229.329 88.368L227.577 84.912V92.352C227.577 92.528 227.513 92.68 227.385 92.808C227.257 92.936 227.105 93 226.929 93H222.585C222.409 93 222.257 92.936 222.129 92.808C222.001 92.68 221.937 92.528 221.937 92.352V76.848C221.937 76.672 222.001 76.52 222.129 76.392C222.257 76.264 222.409 76.2 222.585 76.2H226.977C227.425 76.2 227.769 76.416 228.009 76.848L231.153 82.608L234.297 76.848ZM254.808 88.08H259.152C259.328 88.08 259.48 88.144 259.608 88.272C259.736 88.4 259.8 88.552 259.8 88.728V92.352C259.8 92.528 259.736 92.68 259.608 92.808C259.48 92.936 259.328 93 259.152 93H243.936C243.76 93 243.608 92.936 243.48 92.808C243.352 92.68 243.288 92.528 243.288 92.352V88.728C243.288 88.552 243.352 88.4 243.48 88.272C243.608 88.144 243.76 88.08 243.936 88.08H248.328V81.12H243.936C243.76 81.12 243.608 81.056 243.48 80.928C243.352 80.8 243.288 80.648 243.288 80.472V76.848C243.288 76.672 243.352 76.52 243.48 76.392C243.608 76.264 243.76 76.2 243.936 76.2H259.152C259.328 76.2 259.48 76.264 259.608 76.392C259.736 76.52 259.8 76.672 259.8 76.848V80.472C259.8 80.648 259.736 80.8 259.608 80.928C259.48 81.056 259.328 81.12 259.152 81.12H254.808V88.08ZM280.838 92.208C280.886 92.256 280.91 92.32 280.91 92.4C280.91 92.56 280.854 92.704 280.742 92.832C280.646 92.944 280.526 93 280.382 93H275.222C274.79 93 274.462 92.816 274.238 92.448L271.91 88.872L269.63 92.448C269.39 92.816 269.062 93 268.646 93H263.462C263.318 93 263.19 92.952 263.078 92.856C262.982 92.744 262.934 92.616 262.934 92.472V92.4C262.934 92.32 262.958 92.256 263.006 92.208L268.31 84.096L263.582 76.992C263.534 76.928 263.51 76.84 263.51 76.728C263.51 76.584 263.558 76.464 263.654 76.368C263.766 76.256 263.894 76.2 264.038 76.2H269.222C269.638 76.2 269.974 76.4 270.23 76.8L272.102 79.872L274.118 76.752C274.23 76.608 274.35 76.48 274.478 76.368C274.622 76.256 274.83 76.2 275.102 76.2H280.262C280.406 76.2 280.526 76.256 280.622 76.368C280.734 76.464 280.79 76.584 280.79 76.728V76.8C280.79 76.88 280.766 76.944 280.718 76.992L275.702 84.408L280.838 92.208Z"/>
</mask>
<path d="M131.648 76.2C133.152 76.2 134.464 76.456 135.584 76.968C136.704 77.48 137.56 78.176 138.152 79.056C138.744 79.936 139.04 80.92 139.04 82.008C139.04 83.8 138.48 85.208 137.36 86.232C136.24 87.24 134.336 87.744 131.648 87.744H128.48V92.352C128.48 92.528 128.416 92.68 128.288 92.808C128.16 92.936 128.008 93 127.832 93H122.672C122.496 93 122.344 92.936 122.216 92.808C122.088 92.68 122.024 92.528 122.024 92.352V76.848C122.024 76.672 122.088 76.52 122.216 76.392C122.344 76.264 122.496 76.2 122.672 76.2H131.648ZM131.552 83.304C131.936 83.304 132.24 83.192 132.464 82.968C132.688 82.728 132.8 82.416 132.8 82.032C132.8 81.632 132.688 81.304 132.464 81.048C132.24 80.792 131.936 80.664 131.552 80.664H128.504V83.304H131.552ZM157.415 88.08C157.591 88.08 157.743 88.144 157.871 88.272C157.999 88.4 158.063 88.552 158.063 88.728V92.352C158.063 92.528 157.999 92.68 157.871 92.808C157.743 92.936 157.591 93 157.415 93H143.399C143.223 93 143.071 92.936 142.943 92.808C142.815 92.68 142.751 92.528 142.751 92.352V76.848C142.751 76.672 142.815 76.52 142.943 76.392C143.071 76.264 143.223 76.2 143.399 76.2H148.583C148.759 76.2 148.911 76.264 149.039 76.392C149.167 76.52 149.231 76.672 149.231 76.848V88.08H157.415ZM178.909 86.064C178.909 88.512 178.093 90.32 176.461 91.488C174.845 92.656 172.685 93.24 169.981 93.24C167.277 93.24 165.109 92.656 163.477 91.488C161.861 90.32 161.053 88.496 161.053 86.016V83.184C161.053 81.552 161.437 80.2 162.205 79.128C162.989 78.04 164.053 77.24 165.397 76.728C166.741 76.216 168.269 75.96 169.981 75.96C171.693 75.96 173.213 76.216 174.541 76.728C175.885 77.24 176.949 78.032 177.733 79.104C178.517 80.176 178.909 81.52 178.909 83.136V86.064ZM167.533 86.52C167.533 87.176 167.749 87.68 168.181 88.032C168.629 88.384 169.229 88.56 169.981 88.56C170.733 88.56 171.325 88.384 171.757 88.032C172.205 87.664 172.429 87.152 172.429 86.496V82.704C172.429 82.048 172.205 81.544 171.757 81.192C171.325 80.824 170.733 80.64 169.981 80.64C169.229 80.64 168.629 80.816 168.181 81.168C167.749 81.52 167.533 82.024 167.533 82.68V86.52ZM198.652 76.2C198.828 76.2 198.98 76.264 199.108 76.392C199.236 76.52 199.3 76.672 199.3 76.848V80.712C199.3 80.888 199.236 81.04 199.108 81.168C198.98 81.296 198.828 81.36 198.652 81.36H193.492V92.352C193.492 92.528 193.428 92.68 193.3 92.808C193.172 92.936 193.02 93 192.844 93H187.9C187.724 93 187.572 92.936 187.444 92.808C187.316 92.68 187.252 92.528 187.252 92.352V81.36H182.092C181.916 81.36 181.764 81.296 181.636 81.168C181.508 81.04 181.444 80.888 181.444 80.712V76.848C181.444 76.672 181.508 76.52 181.636 76.392C181.764 76.264 181.916 76.2 182.092 76.2H198.652ZM234.297 76.848C234.537 76.416 234.881 76.2 235.329 76.2H239.721C239.897 76.2 240.049 76.264 240.177 76.392C240.305 76.52 240.369 76.672 240.369 76.848V92.352C240.369 92.528 240.305 92.68 240.177 92.808C240.049 92.936 239.897 93 239.721 93H235.377C235.201 93 235.049 92.936 234.921 92.808C234.793 92.68 234.729 92.528 234.729 92.352V84.912L232.977 88.368C232.929 88.48 232.817 88.608 232.641 88.752C232.465 88.896 232.241 88.968 231.969 88.968H230.337C230.065 88.968 229.841 88.896 229.665 88.752C229.489 88.608 229.377 88.48 229.329 88.368L227.577 84.912V92.352C227.577 92.528 227.513 92.68 227.385 92.808C227.257 92.936 227.105 93 226.929 93H222.585C222.409 93 222.257 92.936 222.129 92.808C222.001 92.68 221.937 92.528 221.937 92.352V76.848C221.937 76.672 222.001 76.52 222.129 76.392C222.257 76.264 222.409 76.2 222.585 76.2H226.977C227.425 76.2 227.769 76.416 228.009 76.848L231.153 82.608L234.297 76.848ZM254.808 88.08H259.152C259.328 88.08 259.48 88.144 259.608 88.272C259.736 88.4 259.8 88.552 259.8 88.728V92.352C259.8 92.528 259.736 92.68 259.608 92.808C259.48 92.936 259.328 93 259.152 93H243.936C243.76 93 243.608 92.936 243.48 92.808C243.352 92.68 243.288 92.528 243.288 92.352V88.728C243.288 88.552 243.352 88.4 243.48 88.272C243.608 88.144 243.76 88.08 243.936 88.08H248.328V81.12H243.936C243.76 81.12 243.608 81.056 243.48 80.928C243.352 80.8 243.288 80.648 243.288 80.472V76.848C243.288 76.672 243.352 76.52 243.48 76.392C243.608 76.264 243.76 76.2 243.936 76.2H259.152C259.328 76.2 259.48 76.264 259.608 76.392C259.736 76.52 259.8 76.672 259.8 76.848V80.472C259.8 80.648 259.736 80.8 259.608 80.928C259.48 81.056 259.328 81.12 259.152 81.12H254.808V88.08ZM280.838 92.208C280.886 92.256 280.91 92.32 280.91 92.4C280.91 92.56 280.854 92.704 280.742 92.832C280.646 92.944 280.526 93 280.382 93H275.222C274.79 93 274.462 92.816 274.238 92.448L271.91 88.872L269.63 92.448C269.39 92.816 269.062 93 268.646 93H263.462C263.318 93 263.19 92.952 263.078 92.856C262.982 92.744 262.934 92.616 262.934 92.472V92.4C262.934 92.32 262.958 92.256 263.006 92.208L268.31 84.096L263.582 76.992C263.534 76.928 263.51 76.84 263.51 76.728C263.51 76.584 263.558 76.464 263.654 76.368C263.766 76.256 263.894 76.2 264.038 76.2H269.222C269.638 76.2 269.974 76.4 270.23 76.8L272.102 79.872L274.118 76.752C274.23 76.608 274.35 76.48 274.478 76.368C274.622 76.256 274.83 76.2 275.102 76.2H280.262C280.406 76.2 280.526 76.256 280.622 76.368C280.734 76.464 280.79 76.584 280.79 76.728V76.8C280.79 76.88 280.766 76.944 280.718 76.992L275.702 84.408L280.838 92.208Z" fill="white"/>
<path d="M137.36 86.232L138.029 86.9753L138.035 86.97L137.36 86.232ZM128.48 87.744V86.744H127.48V87.744H128.48ZM128.288 92.808L128.995 93.5151L128.995 93.5151L128.288 92.808ZM132.464 82.968L133.171 83.6751L133.183 83.6629L133.195 83.6503L132.464 82.968ZM132.464 81.048L133.217 80.3895V80.3895L132.464 81.048ZM128.504 80.664V79.664H127.504V80.664H128.504ZM128.504 83.304H127.504V84.304H128.504V83.304ZM131.648 76.2V77.2C133.04 77.2 134.204 77.4368 135.168 77.8775L135.584 76.968L136 76.0585C134.724 75.4752 133.264 75.2 131.648 75.2V76.2ZM135.584 76.968L135.168 77.8775C136.148 78.3254 136.849 78.9105 137.322 79.6142L138.152 79.056L138.982 78.4978C138.271 77.4415 137.26 76.6346 136 76.0585L135.584 76.968ZM138.152 79.056L137.322 79.6142C137.8 80.3247 138.04 81.1134 138.04 82.008H139.04H140.04C140.04 80.7266 139.688 79.5473 138.982 78.4978L138.152 79.056ZM139.04 82.008H138.04C138.04 83.5747 137.56 84.6938 136.685 85.494L137.36 86.232L138.035 86.97C139.4 85.7222 140.04 84.0253 140.04 82.008H139.04ZM137.36 86.232L136.691 85.4887C135.853 86.2432 134.264 86.744 131.648 86.744V87.744V88.744C134.408 88.744 136.627 88.2368 138.029 86.9753L137.36 86.232ZM131.648 87.744V86.744H128.48V87.744V88.744H131.648V87.744ZM128.48 87.744H127.48V92.352H128.48H129.48V87.744H128.48ZM128.48 92.352H127.48C127.48 92.3158 127.487 92.2649 127.51 92.2099C127.533 92.1556 127.562 92.1194 127.581 92.1009L128.288 92.808L128.995 93.5151C129.305 93.2056 129.48 92.8016 129.48 92.352H128.48ZM128.288 92.808L127.581 92.1009C127.599 92.0824 127.636 92.0533 127.69 92.0304C127.745 92.0072 127.796 92 127.832 92V93V94C128.282 94 128.686 93.8247 128.995 93.5151L128.288 92.808ZM127.832 93V92H122.672V93V94H127.832V93ZM122.672 93V92C122.708 92 122.759 92.0072 122.814 92.0304C122.868 92.0533 122.905 92.0824 122.923 92.1009L122.216 92.808L121.509 93.5151C121.818 93.8247 122.222 94 122.672 94V93ZM122.216 92.808L122.923 92.1009C122.942 92.1194 122.971 92.1556 122.994 92.2099C123.017 92.2649 123.024 92.3158 123.024 92.352H122.024H121.024C121.024 92.8016 121.199 93.2056 121.509 93.5151L122.216 92.808ZM122.024 92.352H123.024V76.848H122.024H121.024V92.352H122.024ZM122.024 76.848H123.024C123.024 76.8842 123.017 76.9351 122.994 76.9901C122.971 77.0444 122.942 77.0806 122.923 77.0991L122.216 76.392L121.509 75.6849C121.199 75.9944 121.024 76.3984 121.024 76.848H122.024ZM122.216 76.392L122.923 77.0991C122.905 77.1176 122.868 77.1467 122.814 77.1696C122.759 77.1928 122.708 77.2 122.672 77.2V76.2V75.2C122.222 75.2 121.818 75.3753 121.509 75.6849L122.216 76.392ZM122.672 76.2V77.2H131.648V76.2V75.2H122.672V76.2ZM131.552 83.304V84.304C132.141 84.304 132.721 84.1252 133.171 83.6751L132.464 82.968L131.757 82.2609C131.75 82.2682 131.742 82.2745 131.722 82.2817C131.699 82.2901 131.647 82.304 131.552 82.304V83.304ZM132.464 82.968L133.195 83.6503C133.621 83.1941 133.8 82.6234 133.8 82.032H132.8H131.8C131.8 82.2086 131.755 82.2619 131.733 82.2857L132.464 82.968ZM132.8 82.032H133.8C133.8 81.4348 133.627 80.859 133.217 80.3895L132.464 81.048L131.711 81.7065C131.749 81.749 131.8 81.8292 131.8 82.032H132.8ZM132.464 81.048L133.217 80.3895C132.777 79.8871 132.183 79.664 131.552 79.664V80.664V81.664C131.632 81.664 131.669 81.6771 131.68 81.6816C131.688 81.6849 131.696 81.6891 131.711 81.7065L132.464 81.048ZM131.552 80.664V79.664H128.504V80.664V81.664H131.552V80.664ZM128.504 80.664H127.504V83.304H128.504H129.504V80.664H128.504ZM128.504 83.304V84.304H131.552V83.304V82.304H128.504V83.304ZM149.039 76.392L148.332 77.0991L148.332 77.0991L149.039 76.392ZM149.231 88.08H148.231V89.08H149.231V88.08ZM157.415 88.08V89.08C157.378 89.08 157.327 89.0728 157.273 89.0496C157.218 89.0267 157.182 88.9976 157.164 88.9791L157.871 88.272L158.578 87.5649C158.268 87.2553 157.864 87.08 157.415 87.08V88.08ZM157.871 88.272L157.164 88.9791C157.145 88.9606 157.116 88.9244 157.093 88.8701C157.07 88.8151 157.063 88.7642 157.063 88.728H158.063H159.063C159.063 88.2784 158.887 87.8744 158.578 87.5649L157.871 88.272ZM158.063 88.728H157.063V92.352H158.063H159.063V88.728H158.063ZM158.063 92.352H157.063C157.063 92.3158 157.07 92.2649 157.093 92.2099C157.116 92.1556 157.145 92.1194 157.164 92.1009L157.871 92.808L158.578 93.5151C158.887 93.2056 159.063 92.8016 159.063 92.352H158.063ZM157.871 92.808L157.164 92.1009C157.182 92.0824 157.218 92.0533 157.273 92.0304C157.327 92.0072 157.378 92 157.415 92V93V94C157.864 94 158.268 93.8247 158.578 93.5151L157.871 92.808ZM157.415 93V92H143.399V93V94H157.415V93ZM143.399 93V92C143.435 92 143.486 92.0072 143.541 92.0304C143.595 92.0533 143.631 92.0824 143.65 92.1009L142.943 92.808L142.236 93.5151C142.545 93.8247 142.949 94 143.399 94V93ZM142.943 92.808L143.65 92.1009C143.668 92.1194 143.697 92.1556 143.72 92.2099C143.743 92.2649 143.751 92.3158 143.751 92.352H142.751H141.751C141.751 92.8016 141.926 93.2056 142.236 93.5151L142.943 92.808ZM142.751 92.352H143.751V76.848H142.751H141.751V92.352H142.751ZM142.751 76.848H143.751C143.751 76.8842 143.743 76.9351 143.72 76.9901C143.697 77.0444 143.668 77.0806 143.65 77.0991L142.943 76.392L142.236 75.6849C141.926 75.9944 141.751 76.3984 141.751 76.848H142.751ZM142.943 76.392L143.65 77.0991C143.631 77.1176 143.595 77.1467 143.541 77.1696C143.486 77.1928 143.435 77.2 143.399 77.2V76.2V75.2C142.949 75.2 142.545 75.3753 142.236 75.6849L142.943 76.392ZM143.399 76.2V77.2H148.583V76.2V75.2H143.399V76.2ZM148.583 76.2V77.2C148.546 77.2 148.495 77.1928 148.441 77.1696C148.386 77.1467 148.35 77.1176 148.332 77.0991L149.039 76.392L149.746 75.6849C149.436 75.3753 149.032 75.2 148.583 75.2V76.2ZM149.039 76.392L148.332 77.0991C148.313 77.0806 148.284 77.0444 148.261 76.9901C148.238 76.9351 148.231 76.8842 148.231 76.848H149.231H150.231C150.231 76.3984 150.055 75.9944 149.746 75.6849L149.039 76.392ZM149.231 76.848H148.231V88.08H149.231H150.231V76.848H149.231ZM149.231 88.08V89.08H157.415V88.08V87.08H149.231V88.08ZM176.461 91.488L175.879 90.6748L175.875 90.6775L176.461 91.488ZM163.477 91.488L162.891 92.2985L162.895 92.3012L163.477 91.488ZM162.205 79.128L161.394 78.5434L161.392 78.5456L162.205 79.128ZM174.541 76.728L174.182 77.6611L174.185 77.6625L174.541 76.728ZM177.733 79.104L176.926 79.6943V79.6943L177.733 79.104ZM168.181 88.032L167.55 88.8072L167.556 88.8128L167.563 88.8183L168.181 88.032ZM171.757 88.032L172.389 88.8072L172.392 88.8047L171.757 88.032ZM171.757 81.192L171.109 81.9532L171.124 81.9661L171.139 81.9783L171.757 81.192ZM168.181 81.168L167.563 80.3817L167.556 80.3872L167.55 80.3928L168.181 81.168ZM178.909 86.064H177.909C177.909 88.2694 177.19 89.7367 175.879 90.6748L176.461 91.488L177.043 92.3012C178.997 90.9033 179.909 88.7547 179.909 86.064H178.909ZM176.461 91.488L175.875 90.6775C174.481 91.6853 172.549 92.24 169.981 92.24V93.24V94.24C172.822 94.24 175.209 93.6267 177.047 92.2985L176.461 91.488ZM169.981 93.24V92.24C167.415 92.24 165.471 91.6855 164.059 90.6748L163.477 91.488L162.895 92.3012C164.747 93.6265 167.14 94.24 169.981 94.24V93.24ZM163.477 91.488L164.063 90.6775C162.771 89.7435 162.053 88.2626 162.053 86.016H161.053H160.053C160.053 88.7295 160.952 90.8965 162.891 92.2985L163.477 91.488ZM161.053 86.016H162.053V83.184H161.053H160.053V86.016H161.053ZM161.053 83.184H162.053C162.053 81.7106 162.398 80.5758 163.018 79.7104L162.205 79.128L161.392 78.5456C160.476 79.8242 160.053 81.3934 160.053 83.184H161.053ZM162.205 79.128L163.017 79.7126C163.678 78.7949 164.578 78.1102 165.753 77.6625L165.397 76.728L165.041 75.7935C163.528 76.3698 162.301 77.2851 161.394 78.5434L162.205 79.128ZM165.397 76.728L165.753 77.6625C166.964 77.2012 168.368 76.96 169.981 76.96V75.96V74.96C168.17 74.96 166.518 75.2308 165.041 75.7935L165.397 76.728ZM169.981 75.96V76.96C171.595 76.96 172.989 77.2013 174.182 77.6611L174.541 76.728L174.901 75.7949C173.438 75.2307 171.792 74.96 169.981 74.96V75.96ZM174.541 76.728L174.185 77.6625C175.364 78.1117 176.266 78.7912 176.926 79.6943L177.733 79.104L178.54 78.5137C177.633 77.2728 176.406 76.3683 174.897 75.7935L174.541 76.728ZM177.733 79.104L176.926 79.6943C177.56 80.5606 177.909 81.6853 177.909 83.136H178.909H179.909C179.909 81.3547 179.475 79.7914 178.54 78.5137L177.733 79.104ZM178.909 83.136H177.909V86.064H178.909H179.909V83.136H178.909ZM167.533 86.52H166.533C166.533 87.4173 166.842 88.2308 167.55 88.8072L168.181 88.032L168.813 87.2568C168.656 87.1292 168.533 86.9347 168.533 86.52H167.533ZM168.181 88.032L167.563 88.8183C168.237 89.3474 169.077 89.56 169.981 89.56V88.56V87.56C169.381 87.56 169.022 87.4206 168.799 87.2457L168.181 88.032ZM169.981 88.56V89.56C170.883 89.56 171.725 89.3484 172.389 88.8072L171.757 88.032L171.126 87.2568C170.926 87.4196 170.583 87.56 169.981 87.56V88.56ZM171.757 88.032L172.392 88.8047C173.103 88.2203 173.429 87.4069 173.429 86.496H172.429H171.429C171.429 86.8971 171.307 87.1077 171.123 87.2593L171.757 88.032ZM172.429 86.496H173.429V82.704H172.429H171.429V86.496H172.429ZM172.429 82.704H173.429C173.429 81.7936 173.103 80.9775 172.375 80.4057L171.757 81.192L171.139 81.9783C171.308 82.1105 171.429 82.3024 171.429 82.704H172.429ZM171.757 81.192L172.406 80.4308C171.741 79.8646 170.893 79.64 169.981 79.64V80.64V81.64C170.574 81.64 170.909 81.7834 171.109 81.9532L171.757 81.192ZM169.981 80.64V79.64C169.077 79.64 168.237 79.8526 167.563 80.3817L168.181 81.168L168.799 81.9543C169.022 81.7794 169.381 81.64 169.981 81.64V80.64ZM168.181 81.168L167.55 80.3928C166.842 80.9692 166.533 81.7827 166.533 82.68H167.533H168.533C168.533 82.2653 168.656 82.0708 168.813 81.9432L168.181 81.168ZM167.533 82.68H166.533V86.52H167.533H168.533V82.68H167.533ZM193.492 81.36V80.36H192.492V81.36H193.492ZM193.3 92.808L194.007 93.5151L194.007 93.5151L193.3 92.808ZM187.444 92.808L186.737 93.5151V93.5151L187.444 92.808ZM187.252 81.36H188.252V80.36H187.252V81.36ZM198.652 76.2V77.2C198.616 77.2 198.565 77.1928 198.51 77.1696C198.455 77.1467 198.419 77.1176 198.401 77.0991L199.108 76.392L199.815 75.6849C199.505 75.3753 199.101 75.2 198.652 75.2V76.2ZM199.108 76.392L198.401 77.0991C198.382 77.0806 198.353 77.0444 198.33 76.9901C198.307 76.9351 198.3 76.8842 198.3 76.848H199.3H200.3C200.3 76.3984 200.125 75.9944 199.815 75.6849L199.108 76.392ZM199.3 76.848H198.3V80.712H199.3H200.3V76.848H199.3ZM199.3 80.712H198.3C198.3 80.6758 198.307 80.6249 198.33 80.5699C198.353 80.5156 198.382 80.4794 198.401 80.4609L199.108 81.168L199.815 81.8751C200.125 81.5656 200.3 81.1616 200.3 80.712H199.3ZM199.108 81.168L198.401 80.4609C198.419 80.4424 198.455 80.4133 198.51 80.3904C198.565 80.3672 198.616 80.36 198.652 80.36V81.36V82.36C199.101 82.36 199.505 82.1847 199.815 81.8751L199.108 81.168ZM198.652 81.36V80.36H193.492V81.36V82.36H198.652V81.36ZM193.492 81.36H192.492V92.352H193.492H194.492V81.36H193.492ZM193.492 92.352H192.492C192.492 92.3158 192.499 92.2649 192.522 92.2099C192.545 92.1556 192.574 92.1194 192.593 92.1009L193.3 92.808L194.007 93.5151C194.317 93.2056 194.492 92.8016 194.492 92.352H193.492ZM193.3 92.808L192.593 92.1009C192.611 92.0824 192.647 92.0533 192.702 92.0304C192.757 92.0072 192.808 92 192.844 92V93V94C193.293 94 193.697 93.8247 194.007 93.5151L193.3 92.808ZM192.844 93V92H187.9V93V94H192.844V93ZM187.9 93V92C187.936 92 187.987 92.0072 188.042 92.0304C188.096 92.0533 188.132 92.0824 188.151 92.1009L187.444 92.808L186.737 93.5151C187.046 93.8247 187.45 94 187.9 94V93ZM187.444 92.808L188.151 92.1009C188.169 92.1194 188.199 92.1556 188.222 92.2099C188.245 92.2649 188.252 92.3158 188.252 92.352H187.252H186.252C186.252 92.8016 186.427 93.2056 186.737 93.5151L187.444 92.808ZM187.252 92.352H188.252V81.36H187.252H186.252V92.352H187.252ZM187.252 81.36V80.36H182.092V81.36V82.36H187.252V81.36ZM182.092 81.36V80.36C182.128 80.36 182.179 80.3672 182.234 80.3904C182.288 80.4133 182.324 80.4424 182.343 80.4609L181.636 81.168L180.929 81.8751C181.238 82.1847 181.642 82.36 182.092 82.36V81.36ZM181.636 81.168L182.343 80.4609C182.361 80.4794 182.391 80.5156 182.414 80.5699C182.437 80.6249 182.444 80.6758 182.444 80.712H181.444H180.444C180.444 81.1616 180.619 81.5656 180.929 81.8751L181.636 81.168ZM181.444 80.712H182.444V76.848H181.444H180.444V80.712H181.444ZM181.444 76.848H182.444C182.444 76.8842 182.437 76.9351 182.414 76.9901C182.391 77.0444 182.361 77.0806 182.343 77.0991L181.636 76.392L180.929 75.6849C180.619 75.9944 180.444 76.3984 180.444 76.848H181.444ZM181.636 76.392L182.343 77.0991C182.324 77.1176 182.288 77.1467 182.234 77.1696C182.179 77.1928 182.128 77.2 182.092 77.2V76.2V75.2C181.642 75.2 181.238 75.3753 180.929 75.6849L181.636 76.392ZM182.092 76.2V77.2H198.652V76.2V75.2H182.092V76.2ZM234.297 76.848L233.423 76.3623L233.419 76.3689L234.297 76.848ZM240.177 76.392L240.884 75.6849V75.6849L240.177 76.392ZM240.177 92.808L240.884 93.5151V93.5151L240.177 92.808ZM234.729 84.912H235.729L233.837 84.4598L234.729 84.912ZM232.977 88.368L232.085 87.9158L232.071 87.9445L232.058 87.9741L232.977 88.368ZM232.641 88.752L233.274 89.526V89.526L232.641 88.752ZM229.665 88.752L229.032 89.526H229.032L229.665 88.752ZM229.329 88.368L230.248 87.9741L230.236 87.9445L230.221 87.9158L229.329 88.368ZM227.577 84.912L228.469 84.4598L226.577 84.912H227.577ZM227.385 92.808L226.678 92.1009V92.1009L227.385 92.808ZM228.009 76.848L228.887 76.3689L228.883 76.3624L228.009 76.848ZM231.153 82.608L230.275 83.0871L231.153 84.6952L232.031 83.0871L231.153 82.608ZM234.297 76.848L235.171 77.3336C235.227 77.2333 235.265 77.2098 235.267 77.2089C235.269 77.2077 235.271 77.2067 235.276 77.2053C235.282 77.2037 235.298 77.2 235.329 77.2V76.2V75.2C234.474 75.2 233.817 75.6528 233.423 76.3624L234.297 76.848ZM235.329 76.2V77.2H239.721V76.2V75.2H235.329V76.2ZM239.721 76.2V77.2C239.685 77.2 239.634 77.1928 239.579 77.1696C239.525 77.1467 239.489 77.1176 239.47 77.0991L240.177 76.392L240.884 75.6849C240.575 75.3753 240.171 75.2 239.721 75.2V76.2ZM240.177 76.392L239.47 77.0991C239.452 77.0806 239.422 77.0444 239.399 76.9901C239.376 76.9351 239.369 76.8842 239.369 76.848H240.369H241.369C241.369 76.3984 241.194 75.9944 240.884 75.6849L240.177 76.392ZM240.369 76.848H239.369V92.352H240.369H241.369V76.848H240.369ZM240.369 92.352H239.369C239.369 92.3158 239.376 92.2649 239.399 92.2099C239.422 92.1556 239.452 92.1194 239.47 92.1009L240.177 92.808L240.884 93.5151C241.194 93.2056 241.369 92.8016 241.369 92.352H240.369ZM240.177 92.808L239.47 92.1009C239.489 92.0824 239.525 92.0533 239.579 92.0304C239.634 92.0072 239.685 92 239.721 92V93V94C240.171 94 240.575 93.8247 240.884 93.5151L240.177 92.808ZM239.721 93V92H235.377V93V94H239.721V93ZM235.377 93V92C235.413 92 235.464 92.0072 235.519 92.0304C235.574 92.0533 235.61 92.0824 235.628 92.1009L234.921 92.808L234.214 93.5151C234.524 93.8247 234.928 94 235.377 94V93ZM234.921 92.808L235.628 92.1009C235.647 92.1194 235.676 92.1556 235.699 92.2099C235.722 92.2649 235.729 92.3158 235.729 92.352H234.729H233.729C233.729 92.8016 233.904 93.2056 234.214 93.5151L234.921 92.808ZM234.729 92.352H235.729V84.912H234.729H233.729V92.352H234.729ZM234.729 84.912L233.837 84.4598L232.085 87.9158L232.977 88.368L233.869 88.8202L235.621 85.3642L234.729 84.912ZM232.977 88.368L232.058 87.9741C232.074 87.9368 232.089 87.9122 232.097 87.9003C232.105 87.8883 232.109 87.8847 232.105 87.8895C232.1 87.8941 232.091 87.9043 232.075 87.92C232.058 87.9355 232.036 87.9549 232.008 87.978L232.641 88.752L233.274 89.526C233.485 89.3539 233.751 89.1008 233.896 88.7619L232.977 88.368ZM232.641 88.752L232.008 87.978C232.013 87.9738 232.019 87.9698 232.025 87.9666C232.031 87.9634 232.035 87.9621 232.035 87.962C232.036 87.9617 232.017 87.968 231.969 87.968V88.968V89.968C232.425 89.968 232.886 89.8434 233.274 89.526L232.641 88.752ZM231.969 88.968V87.968H230.337V88.968V89.968H231.969V88.968ZM230.337 88.968V87.968C230.289 87.968 230.27 87.9617 230.271 87.962C230.272 87.9621 230.275 87.9634 230.281 87.9666C230.287 87.9698 230.293 87.9738 230.298 87.978L229.665 88.752L229.032 89.526C229.42 89.8434 229.881 89.968 230.337 89.968V88.968ZM229.665 88.752L230.298 87.978C230.27 87.9549 230.248 87.9355 230.232 87.92C230.215 87.9043 230.206 87.8941 230.202 87.8895C230.197 87.8847 230.201 87.8883 230.209 87.9003C230.217 87.9122 230.232 87.9368 230.248 87.9741L229.329 88.368L228.41 88.7619C228.555 89.1008 228.822 89.3539 229.032 89.526L229.665 88.752ZM229.329 88.368L230.221 87.9158L228.469 84.4598L227.577 84.912L226.685 85.3642L228.437 88.8202L229.329 88.368ZM227.577 84.912H226.577V92.352H227.577H228.577V84.912H227.577ZM227.577 92.352H226.577C226.577 92.3158 226.584 92.2649 226.607 92.2099C226.63 92.1556 226.66 92.1194 226.678 92.1009L227.385 92.808L228.092 93.5151C228.402 93.2056 228.577 92.8016 228.577 92.352H227.577ZM227.385 92.808L226.678 92.1009C226.697 92.0824 226.733 92.0533 226.787 92.0304C226.842 92.0072 226.893 92 226.929 92V93V94C227.379 94 227.783 93.8247 228.092 93.5151L227.385 92.808ZM226.929 93V92H222.585V93V94H226.929V93ZM222.585 93V92C222.621 92 222.672 92.0072 222.727 92.0304C222.782 92.0533 222.818 92.0824 222.836 92.1009L222.129 92.808L221.422 93.5151C221.732 93.8247 222.136 94 222.585 94V93ZM222.129 92.808L222.836 92.1009C222.855 92.1194 222.884 92.1556 222.907 92.2099C222.93 92.2649 222.937 92.3158 222.937 92.352H221.937H220.937C220.937 92.8016 221.112 93.2056 221.422 93.5151L222.129 92.808ZM221.937 92.352H222.937V76.848H221.937H220.937V92.352H221.937ZM221.937 76.848H222.937C222.937 76.8842 222.93 76.9351 222.907 76.9901C222.884 77.0444 222.855 77.0806 222.836 77.0991L222.129 76.392L221.422 75.6849C221.112 75.9944 220.937 76.3984 220.937 76.848H221.937ZM222.129 76.392L222.836 77.0991C222.818 77.1176 222.782 77.1467 222.727 77.1696C222.672 77.1928 222.621 77.2 222.585 77.2V76.2V75.2C222.136 75.2 221.732 75.3753 221.422 75.6849L222.129 76.392ZM222.585 76.2V77.2H226.977V76.2V75.2H222.585V76.2ZM226.977 76.2V77.2C227.008 77.2 227.025 77.2037 227.031 77.2053C227.036 77.2067 227.038 77.2077 227.039 77.2089C227.041 77.2098 227.079 77.2333 227.135 77.3336L228.009 76.848L228.883 76.3624C228.489 75.6528 227.832 75.2 226.977 75.2V76.2ZM228.009 76.848L227.131 77.3271L230.275 83.0871L231.153 82.608L232.031 82.1289L228.887 76.3689L228.009 76.848ZM231.153 82.608L232.031 83.0871L235.175 77.3271L234.297 76.848L233.419 76.3689L230.275 82.1289L231.153 82.608ZM254.808 88.08H253.808V89.08H254.808V88.08ZM248.328 88.08V89.08H249.328V88.08H248.328ZM248.328 81.12H249.328V80.12H248.328V81.12ZM243.48 80.928L242.773 81.6351V81.6351L243.48 80.928ZM259.608 80.928L260.315 81.6351V81.6351L259.608 80.928ZM254.808 81.12V80.12H253.808V81.12H254.808ZM254.808 88.08V89.08H259.152V88.08V87.08H254.808V88.08ZM259.152 88.08V89.08C259.116 89.08 259.065 89.0728 259.01 89.0496C258.955 89.0267 258.919 88.9976 258.901 88.9791L259.608 88.272L260.315 87.5649C260.005 87.2553 259.601 87.08 259.152 87.08V88.08ZM259.608 88.272L258.901 88.9791C258.882 88.9606 258.853 88.9244 258.83 88.8701C258.807 88.8151 258.8 88.7642 258.8 88.728H259.8H260.8C260.8 88.2784 260.624 87.8744 260.315 87.5649L259.608 88.272ZM259.8 88.728H258.8V92.352H259.8H260.8V88.728H259.8ZM259.8 92.352H258.8C258.8 92.3158 258.807 92.2649 258.83 92.2099C258.853 92.1556 258.882 92.1194 258.901 92.1009L259.608 92.808L260.315 93.5151C260.624 93.2056 260.8 92.8016 260.8 92.352H259.8ZM259.608 92.808L258.901 92.1009C258.919 92.0824 258.955 92.0533 259.01 92.0304C259.065 92.0072 259.116 92 259.152 92V93V94C259.601 94 260.005 93.8247 260.315 93.5151L259.608 92.808ZM259.152 93V92H243.936V93V94H259.152V93ZM243.936 93V92C243.972 92 244.023 92.0072 244.078 92.0304C244.132 92.0533 244.168 92.0824 244.187 92.1009L243.48 92.808L242.773 93.5151C243.082 93.8247 243.486 94 243.936 94V93ZM243.48 92.808L244.187 92.1009C244.205 92.1194 244.234 92.1556 244.257 92.2099C244.281 92.2649 244.288 92.3158 244.288 92.352H243.288H242.288C242.288 92.8016 242.463 93.2056 242.773 93.5151L243.48 92.808ZM243.288 92.352H244.288V88.728H243.288H242.288V92.352H243.288ZM243.288 88.728H244.288C244.288 88.7642 244.281 88.8151 244.257 88.8701C244.234 88.9244 244.205 88.9606 244.187 88.9791L243.48 88.272L242.773 87.5649C242.463 87.8744 242.288 88.2784 242.288 88.728H243.288ZM243.48 88.272L244.187 88.9791C244.168 88.9976 244.132 89.0267 244.078 89.0496C244.023 89.0728 243.972 89.08 243.936 89.08V88.08V87.08C243.486 87.08 243.082 87.2553 242.773 87.5649L243.48 88.272ZM243.936 88.08V89.08H248.328V88.08V87.08H243.936V88.08ZM248.328 88.08H249.328V81.12H248.328H247.328V88.08H248.328ZM248.328 81.12V80.12H243.936V81.12V82.12H248.328V81.12ZM243.936 81.12V80.12C243.972 80.12 244.023 80.1272 244.078 80.1504C244.132 80.1733 244.168 80.2024 244.187 80.2209L243.48 80.928L242.773 81.6351C243.082 81.9447 243.486 82.12 243.936 82.12V81.12ZM243.48 80.928L244.187 80.2209C244.205 80.2394 244.234 80.2756 244.257 80.3299C244.281 80.3849 244.288 80.4358 244.288 80.472H243.288H242.288C242.288 80.9216 242.463 81.3256 242.773 81.6351L243.48 80.928ZM243.288 80.472H244.288V76.848H243.288H242.288V80.472H243.288ZM243.288 76.848H244.288C244.288 76.8842 244.281 76.9351 244.257 76.9901C244.234 77.0444 244.205 77.0806 244.187 77.0991L243.48 76.392L242.773 75.6849C242.463 75.9944 242.288 76.3984 242.288 76.848H243.288ZM243.48 76.392L244.187 77.0991C244.168 77.1176 244.132 77.1467 244.078 77.1696C244.023 77.1928 243.972 77.2 243.936 77.2V76.2V75.2C243.486 75.2 243.082 75.3753 242.773 75.6849L243.48 76.392ZM243.936 76.2V77.2H259.152V76.2V75.2H243.936V76.2ZM259.152 76.2V77.2C259.116 77.2 259.065 77.1928 259.01 77.1696C258.955 77.1467 258.919 77.1176 258.901 77.0991L259.608 76.392L260.315 75.6849C260.005 75.3753 259.601 75.2 259.152 75.2V76.2ZM259.608 76.392L258.901 77.0991C258.882 77.0806 258.853 77.0444 258.83 76.9901C258.807 76.9351 258.8 76.8842 258.8 76.848H259.8H260.8C260.8 76.3984 260.624 75.9944 260.315 75.6849L259.608 76.392ZM259.8 76.848H258.8V80.472H259.8H260.8V76.848H259.8ZM259.8 80.472H258.8C258.8 80.4358 258.807 80.3849 258.83 80.3299C258.853 80.2756 258.882 80.2394 258.901 80.2209L259.608 80.928L260.315 81.6351C260.624 81.3256 260.8 80.9216 260.8 80.472H259.8ZM259.608 80.928L258.901 80.2209C258.919 80.2024 258.955 80.1733 259.01 80.1504C259.065 80.1272 259.116 80.12 259.152 80.12V81.12V82.12C259.601 82.12 260.005 81.9447 260.315 81.6351L259.608 80.928ZM259.152 81.12V80.12H254.808V81.12V82.12H259.152V81.12ZM254.808 81.12H253.808V88.08H254.808H255.808V81.12H254.808ZM280.838 92.208L280.003 92.7579L280.059 92.8431L280.131 92.9151L280.838 92.208ZM280.742 92.832L279.99 92.1735L279.983 92.1812L280.742 92.832ZM274.238 92.448L275.093 91.9281L275.085 91.9151L275.076 91.9024L274.238 92.448ZM271.91 88.872L272.748 88.3264L271.902 87.0256L271.067 88.3344L271.91 88.872ZM269.63 92.448L270.468 92.9943L270.474 92.9856L269.63 92.448ZM263.078 92.856L262.319 93.5068L262.369 93.5652L262.428 93.6153L263.078 92.856ZM263.006 92.208L263.713 92.9151L263.787 92.8419L263.843 92.7552L263.006 92.208ZM268.31 84.096L269.147 84.6432L269.508 84.0911L269.143 83.5419L268.31 84.096ZM263.582 76.992L264.415 76.4379L264.399 76.4145L264.382 76.392L263.582 76.992ZM263.654 76.368L264.361 77.0751V77.0751L263.654 76.368ZM270.23 76.8L271.084 76.2796L271.079 76.2702L271.073 76.2609L270.23 76.8ZM272.102 79.872L271.248 80.3924L272.078 81.753L272.942 80.4147L272.102 79.872ZM274.118 76.752L273.329 76.1381L273.302 76.1726L273.278 76.2093L274.118 76.752ZM274.478 76.368L273.864 75.5786L273.842 75.5964L273.82 75.6154L274.478 76.368ZM280.622 76.368L279.863 77.0188L279.913 77.0772L279.972 77.1273L280.622 76.368ZM280.718 76.992L280.011 76.2849L279.944 76.3525L279.89 76.4317L280.718 76.992ZM275.702 84.408L274.874 83.8477L274.5 84.4005L274.867 84.9579L275.702 84.408ZM280.838 92.208L280.131 92.9151C280.054 92.8374 279.994 92.7438 279.956 92.6431C279.919 92.5455 279.91 92.4599 279.91 92.4H280.91H281.91C281.91 92.1057 281.814 91.7696 281.545 91.5009L280.838 92.208ZM280.91 92.4H279.91C279.91 92.3605 279.918 92.3132 279.936 92.2656C279.955 92.2188 279.977 92.1882 279.99 92.1735L280.742 92.832L281.495 93.4905C281.756 93.1927 281.91 92.8183 281.91 92.4H280.91ZM280.742 92.832L279.983 92.1812C280.017 92.1415 280.074 92.0906 280.157 92.0518C280.241 92.0128 280.321 92 280.382 92V93V94C280.826 94 281.221 93.8102 281.502 93.4828L280.742 92.832ZM280.382 93V92H275.222V93V94H280.382V93ZM275.222 93V92C275.185 92 275.164 91.9961 275.153 91.9936C275.148 91.9923 275.145 91.9912 275.143 91.9907C275.142 91.9901 275.142 91.9899 275.142 91.9899C275.142 91.9899 275.141 91.9896 275.14 91.9888C275.139 91.988 275.137 91.9861 275.133 91.9824C275.126 91.9752 275.111 91.959 275.093 91.9281L274.238 92.448L273.384 92.9679C273.79 93.6351 274.443 94 275.222 94V93ZM274.238 92.448L275.076 91.9024L272.748 88.3264L271.91 88.872L271.072 89.4176L273.4 92.9936L274.238 92.448ZM271.91 88.872L271.067 88.3344L268.787 91.9104L269.63 92.448L270.474 92.9856L272.754 89.4096L271.91 88.872ZM269.63 92.448L268.793 91.9017C268.746 91.9734 268.716 91.9891 268.715 91.9899C268.713 91.9911 268.709 91.9929 268.702 91.9947C268.694 91.9967 268.676 92 268.646 92V93V94C269.422 94 270.056 93.6263 270.468 92.9943L269.63 92.448ZM268.646 93V92H263.462V93V94H268.646V93ZM263.462 93V92C263.504 92 263.555 92.0074 263.609 92.0277C263.663 92.0479 263.703 92.0747 263.729 92.0967L263.078 92.856L262.428 93.6153C262.716 93.8625 263.073 94 263.462 94V93ZM263.078 92.856L263.838 92.2052C263.86 92.2309 263.887 92.271 263.907 92.3249C263.927 92.3791 263.934 92.4306 263.934 92.472H262.934H261.934C261.934 92.861 262.072 93.2184 262.319 93.5068L263.078 92.856ZM262.934 92.472H263.934V92.4H262.934H261.934V92.472H262.934ZM262.934 92.4H263.934C263.934 92.4599 263.925 92.5455 263.889 92.6431C263.851 92.7438 263.791 92.8374 263.713 92.9151L263.006 92.208L262.299 91.5009C262.031 91.7696 261.934 92.1057 261.934 92.4H262.934ZM263.006 92.208L263.843 92.7552L269.147 84.6432L268.31 84.096L267.473 83.5487L262.169 91.6608L263.006 92.208ZM268.31 84.096L269.143 83.5419L264.415 76.4379L263.582 76.992L262.75 77.5461L267.478 84.6501L268.31 84.096ZM263.582 76.992L264.382 76.392C264.507 76.5583 264.51 76.7081 264.51 76.728H263.51H262.51C262.51 76.9719 262.562 77.2977 262.782 77.592L263.582 76.992ZM263.51 76.728H264.51C264.51 76.7687 264.503 76.8305 264.475 76.9014C264.446 76.9734 264.404 77.0323 264.361 77.0751L263.654 76.368L262.947 75.6609C262.651 75.9567 262.51 76.3366 262.51 76.728H263.51ZM263.654 76.368L264.361 77.0751C264.341 77.0956 264.3 77.1299 264.235 77.1582C264.169 77.1872 264.1 77.2 264.038 77.2V76.2V75.2C263.601 75.2 263.226 75.382 262.947 75.6609L263.654 76.368ZM264.038 76.2V77.2H269.222V76.2V75.2H264.038V76.2ZM269.222 76.2V77.2C269.246 77.2 269.258 77.2027 269.262 77.2039C269.267 77.205 269.27 77.2063 269.275 77.2093C269.284 77.2144 269.326 77.2424 269.388 77.3391L270.23 76.8L271.073 76.2609C270.663 75.6216 270.033 75.2 269.222 75.2V76.2ZM270.23 76.8L269.376 77.3204L271.248 80.3924L272.102 79.872L272.956 79.3516L271.084 76.2796L270.23 76.8ZM272.102 79.872L272.942 80.4147L274.958 77.2947L274.118 76.752L273.278 76.2093L271.262 79.3293L272.102 79.872ZM274.118 76.752L274.908 77.3659C274.983 77.2686 275.06 77.1877 275.137 77.1206L274.478 76.368L273.82 75.6154C273.641 75.7723 273.477 75.9474 273.329 76.1381L274.118 76.752ZM274.478 76.368L275.092 77.1574C275.042 77.1965 275.004 77.2072 275.002 77.2076C275.002 77.2078 275.009 77.2058 275.026 77.2038C275.043 77.2018 275.068 77.2 275.102 77.2V76.2V75.2C274.712 75.2 274.252 75.2775 273.864 75.5786L274.478 76.368ZM275.102 76.2V77.2H280.262V76.2V75.2H275.102V76.2ZM280.262 76.2V77.2C280.201 77.2 280.121 77.1872 280.037 77.1482C279.954 77.1094 279.897 77.0585 279.863 77.0188L280.622 76.368L281.382 75.7172C281.101 75.3898 280.706 75.2 280.262 75.2V76.2ZM280.622 76.368L279.972 77.1273C279.932 77.0932 279.881 77.0359 279.842 76.9529C279.803 76.8692 279.79 76.7892 279.79 76.728H280.79H281.79C281.79 76.284 281.601 75.8894 281.273 75.6087L280.622 76.368ZM280.79 76.728H279.79V76.8H280.79H281.79V76.728H280.79ZM280.79 76.8H279.79C279.79 76.7401 279.799 76.6545 279.836 76.5569C279.874 76.4562 279.934 76.3625 280.011 76.2849L280.718 76.992L281.425 77.6991C281.694 77.4304 281.79 77.0943 281.79 76.8H280.79ZM280.718 76.992L279.89 76.4317L274.874 83.8477L275.702 84.408L276.531 84.9683L281.547 77.5523L280.718 76.992ZM275.702 84.408L274.867 84.9579L280.003 92.7579L280.838 92.208L281.674 91.6581L276.538 83.8581L275.702 84.408Z" fill="black" mask="url(#path-14178-outside-2_2_177825)"/>
</g>
<g filter="url(#filter1_d_2_177825)">
<mask id="path-14180-outside-3_2_177825" maskUnits="userSpaceOnUse" x="95" y="107" width="218" height="15" fill="black">
<rect fill="white" x="95" y="107" width="218" height="15"/>
<path d="M101.392 119.568C101.36 119.664 101.28 119.76 101.152 119.856C101.035 119.952 100.88 120 100.688 120H98.448C98.2453 120 98.0747 119.941 97.936 119.824C97.808 119.696 97.7333 119.552 97.712 119.392L96.32 109.2V109.152C96.32 109.056 96.352 108.976 96.416 108.912C96.4907 108.837 96.576 108.8 96.672 108.8H99.424C99.6373 108.8 99.808 108.864 99.936 108.992C100.075 109.12 100.155 109.28 100.176 109.472L100.688 114.368L101.616 111.824C101.648 111.717 101.723 111.616 101.84 111.52C101.968 111.413 102.128 111.36 102.32 111.36H103.408C103.6 111.36 103.755 111.413 103.872 111.52C104 111.616 104.08 111.717 104.112 111.824L105.04 114.368L105.552 109.472C105.573 109.28 105.648 109.12 105.776 108.992C105.915 108.864 106.091 108.8 106.304 108.8H109.056C109.152 108.8 109.232 108.837 109.296 108.912C109.371 108.976 109.408 109.056 109.408 109.152V109.2L108.016 119.392C107.995 119.552 107.915 119.696 107.776 119.824C107.648 119.941 107.483 120 107.28 120H105.04C104.848 120 104.688 119.952 104.56 119.856C104.443 119.76 104.368 119.664 104.336 119.568L102.864 116.192L101.392 119.568ZM121.722 108.8C121.839 108.8 121.94 108.843 122.026 108.928C122.111 109.013 122.154 109.115 122.154 109.232V119.568C122.154 119.685 122.111 119.787 122.026 119.872C121.94 119.957 121.839 120 121.722 120H118.426C118.308 120 118.207 119.957 118.122 119.872C118.036 119.787 117.994 119.685 117.994 119.568V116.16H114.794V119.568C114.794 119.685 114.751 119.787 114.666 119.872C114.58 119.957 114.479 120 114.362 120H111.066C110.948 120 110.847 119.963 110.762 119.888C110.676 119.803 110.634 119.696 110.634 119.568V109.232C110.634 109.115 110.676 109.013 110.762 108.928C110.847 108.843 110.948 108.8 111.066 108.8H114.362C114.479 108.8 114.58 108.843 114.666 108.928C114.751 109.013 114.794 109.115 114.794 109.232V112.512H117.994V109.232C117.994 109.115 118.036 109.013 118.122 108.928C118.207 108.843 118.308 108.8 118.426 108.8H121.722ZM127.684 119.456C127.545 119.819 127.305 120 126.964 120H123.94C123.844 120 123.758 119.968 123.684 119.904C123.62 119.829 123.588 119.744 123.588 119.648L123.604 119.552L127.092 109.328C127.134 109.189 127.214 109.067 127.332 108.96C127.449 108.853 127.609 108.8 127.812 108.8H132.26C132.462 108.8 132.622 108.853 132.74 108.96C132.857 109.067 132.937 109.189 132.98 109.328L136.468 119.552L136.484 119.648C136.484 119.744 136.446 119.829 136.372 119.904C136.308 119.968 136.228 120 136.132 120H133.108C132.766 120 132.526 119.819 132.388 119.456L131.988 118.336H128.084L127.684 119.456ZM130.036 111.888L128.9 115.216H131.172L130.036 111.888ZM149.101 108.8C149.219 108.8 149.32 108.843 149.405 108.928C149.491 109.013 149.533 109.115 149.533 109.232V111.808C149.533 111.925 149.491 112.027 149.405 112.112C149.32 112.197 149.219 112.24 149.101 112.24H145.661V119.568C145.661 119.685 145.619 119.787 145.533 119.872C145.448 119.957 145.347 120 145.229 120H141.933C141.816 120 141.715 119.957 141.629 119.872C141.544 119.787 141.501 119.685 141.501 119.568V112.24H138.061C137.944 112.24 137.843 112.197 137.757 112.112C137.672 112.027 137.629 111.925 137.629 111.808V109.232C137.629 109.115 137.672 109.013 137.757 108.928C137.843 108.843 137.944 108.8 138.061 108.8H149.101ZM150.327 109.264C150.348 109.104 150.428 108.96 150.567 108.832C150.716 108.704 150.892 108.64 151.095 108.64H153.095C153.191 108.64 153.271 108.677 153.335 108.752C153.41 108.816 153.447 108.896 153.447 108.992C153.447 109.035 153.442 109.072 153.431 109.104L151.911 112.96C151.858 113.088 151.767 113.205 151.639 113.312C151.522 113.419 151.367 113.472 151.175 113.472H150.087C149.991 113.472 149.911 113.44 149.847 113.376C149.772 113.301 149.735 113.216 149.735 113.12V113.088L150.327 109.264ZM159.367 112.864C160.54 112.992 161.479 113.2 162.183 113.488C162.898 113.776 163.415 114.155 163.735 114.624C164.055 115.093 164.215 115.68 164.215 116.384C164.215 117.152 163.964 117.824 163.463 118.4C162.972 118.965 162.29 119.403 161.415 119.712C160.54 120.011 159.543 120.16 158.423 120.16C157.175 120.16 156.119 120.005 155.255 119.696C154.391 119.387 153.746 118.976 153.319 118.464C152.892 117.941 152.679 117.371 152.679 116.752C152.679 116.645 152.711 116.56 152.775 116.496C152.85 116.432 152.94 116.4 153.047 116.4H156.327C156.551 116.4 156.732 116.469 156.871 116.608C157.052 116.779 157.255 116.896 157.479 116.96C157.703 117.013 158.018 117.04 158.423 117.04C159.436 117.04 159.943 116.885 159.943 116.576C159.943 116.448 159.874 116.341 159.735 116.256C159.607 116.16 159.372 116.08 159.031 116.016C158.7 115.941 158.21 115.867 157.559 115.792C156.098 115.621 154.978 115.259 154.199 114.704C153.42 114.139 153.031 113.344 153.031 112.32C153.031 111.595 153.25 110.955 153.687 110.4C154.124 109.845 154.743 109.413 155.543 109.104C156.354 108.795 157.292 108.64 158.359 108.64C159.468 108.64 160.439 108.816 161.271 109.168C162.103 109.509 162.738 109.936 163.175 110.448C163.612 110.96 163.831 111.461 163.831 111.952C163.831 112.059 163.794 112.144 163.719 112.208C163.655 112.272 163.564 112.304 163.447 112.304H160.007C159.826 112.304 159.66 112.24 159.511 112.112C159.394 112.005 159.255 111.92 159.095 111.856C158.935 111.792 158.69 111.76 158.359 111.76C157.644 111.76 157.287 111.909 157.287 112.208C157.287 112.368 157.426 112.496 157.703 112.592C157.98 112.677 158.535 112.768 159.367 112.864ZM189.883 108.8C190 108.8 190.101 108.843 190.187 108.928C190.272 109.013 190.315 109.115 190.315 109.232V111.808C190.315 111.925 190.272 112.027 190.187 112.112C190.101 112.197 190 112.24 189.883 112.24H186.443V119.568C186.443 119.685 186.4 119.787 186.315 119.872C186.229 119.957 186.128 120 186.01 120H182.715C182.597 120 182.496 119.957 182.411 119.872C182.325 119.787 182.283 119.685 182.283 119.568V112.24H178.843C178.725 112.24 178.624 112.197 178.539 112.112C178.453 112.027 178.411 111.925 178.411 111.808V109.232C178.411 109.115 178.453 109.013 178.539 108.928C178.624 108.843 178.725 108.8 178.843 108.8H189.883ZM203.284 108.8C203.402 108.8 203.503 108.843 203.588 108.928C203.674 109.013 203.716 109.115 203.716 109.232V119.568C203.716 119.685 203.674 119.787 203.588 119.872C203.503 119.957 203.402 120 203.284 120H199.988C199.871 120 199.77 119.957 199.684 119.872C199.599 119.787 199.556 119.685 199.556 119.568V116.16H196.356V119.568C196.356 119.685 196.314 119.787 196.228 119.872C196.143 119.957 196.042 120 195.924 120H192.628C192.511 120 192.41 119.963 192.324 119.888C192.239 119.803 192.196 119.696 192.196 119.568V109.232C192.196 109.115 192.239 109.013 192.324 108.928C192.41 108.843 192.511 108.8 192.628 108.8H195.924C196.042 108.8 196.143 108.843 196.228 108.928C196.314 109.013 196.356 109.115 196.356 109.232V112.512H199.556V109.232C199.556 109.115 199.599 109.013 199.684 108.928C199.77 108.843 199.871 108.8 199.988 108.8H203.284ZM216.734 116.88C216.851 116.88 216.953 116.923 217.038 117.008C217.123 117.093 217.166 117.195 217.166 117.312V119.568C217.166 119.685 217.123 119.787 217.038 119.872C216.953 119.957 216.851 120 216.734 120H206.622C206.505 120 206.403 119.957 206.318 119.872C206.233 119.787 206.19 119.685 206.19 119.568V109.232C206.19 109.115 206.233 109.013 206.318 108.928C206.403 108.843 206.505 108.8 206.622 108.8H216.574C216.691 108.8 216.793 108.843 216.878 108.928C216.963 109.013 217.006 109.115 217.006 109.232V111.488C217.006 111.605 216.963 111.707 216.878 111.792C216.793 111.877 216.691 111.92 216.574 111.92H210.35V112.928H215.694C215.811 112.928 215.913 112.971 215.998 113.056C216.083 113.141 216.126 113.243 216.126 113.36V115.44C216.126 115.557 216.083 115.659 215.998 115.744C215.913 115.829 215.811 115.872 215.694 115.872H210.35V116.88H216.734ZM244.258 108.8C244.375 108.8 244.476 108.843 244.562 108.928C244.647 109.013 244.69 109.115 244.69 109.232V111.808C244.69 111.925 244.647 112.027 244.562 112.112C244.476 112.197 244.375 112.24 244.258 112.24H240.818V119.568C240.818 119.685 240.775 119.787 240.69 119.872C240.604 119.957 240.503 120 240.385 120H237.09C236.972 120 236.871 119.957 236.786 119.872C236.7 119.787 236.658 119.685 236.658 119.568V112.24H233.218C233.1 112.24 232.999 112.197 232.914 112.112C232.828 112.027 232.786 111.925 232.786 111.808V109.232C232.786 109.115 232.828 109.013 232.914 108.928C232.999 108.843 233.1 108.8 233.218 108.8H244.258ZM254.507 116.72H257.403C257.521 116.72 257.622 116.763 257.707 116.848C257.793 116.933 257.835 117.035 257.835 117.152V119.568C257.835 119.685 257.793 119.787 257.707 119.872C257.622 119.957 257.521 120 257.403 120H247.259C247.142 120 247.041 119.957 246.955 119.872C246.87 119.787 246.827 119.685 246.827 119.568V117.152C246.827 117.035 246.87 116.933 246.955 116.848C247.041 116.763 247.142 116.72 247.259 116.72H250.187V112.08H247.259C247.142 112.08 247.041 112.037 246.955 111.952C246.87 111.867 246.827 111.765 246.827 111.648V109.232C246.827 109.115 246.87 109.013 246.955 108.928C247.041 108.843 247.142 108.8 247.259 108.8H257.403C257.521 108.8 257.622 108.843 257.707 108.928C257.793 109.013 257.835 109.115 257.835 109.232V111.648C257.835 111.765 257.793 111.867 257.707 111.952C257.622 112.037 257.521 112.08 257.403 112.08H254.507V116.72ZM271.445 108.8C271.562 108.8 271.664 108.843 271.749 108.928C271.834 109.013 271.877 109.115 271.877 109.232V111.808C271.877 111.925 271.834 112.027 271.749 112.112C271.664 112.197 271.562 112.24 271.445 112.24H268.005V119.568C268.005 119.685 267.962 119.787 267.877 119.872C267.792 119.957 267.69 120 267.573 120H264.277C264.16 120 264.058 119.957 263.973 119.872C263.888 119.787 263.845 119.685 263.845 119.568V112.24H260.405C260.288 112.24 260.186 112.197 260.101 112.112C260.016 112.027 259.973 111.925 259.973 111.808V109.232C259.973 109.115 260.016 109.013 260.101 108.928C260.186 108.843 260.288 108.8 260.405 108.8H271.445ZM284.735 116.72C284.852 116.72 284.953 116.763 285.039 116.848C285.124 116.933 285.167 117.035 285.167 117.152V119.568C285.167 119.685 285.124 119.787 285.039 119.872C284.953 119.957 284.852 120 284.735 120H275.391C275.273 120 275.172 119.957 275.087 119.872C275.001 119.787 274.959 119.685 274.959 119.568V109.232C274.959 109.115 275.001 109.013 275.087 108.928C275.172 108.843 275.273 108.8 275.391 108.8H278.847C278.964 108.8 279.065 108.843 279.151 108.928C279.236 109.013 279.279 109.115 279.279 109.232V116.72H284.735ZM298.297 116.88C298.414 116.88 298.515 116.923 298.601 117.008C298.686 117.093 298.729 117.195 298.729 117.312V119.568C298.729 119.685 298.686 119.787 298.601 119.872C298.515 119.957 298.414 120 298.297 120H288.185C288.067 120 287.966 119.957 287.881 119.872C287.795 119.787 287.753 119.685 287.753 119.568V109.232C287.753 109.115 287.795 109.013 287.881 108.928C287.966 108.843 288.067 108.8 288.185 108.8H298.137C298.254 108.8 298.355 108.843 298.441 108.928C298.526 109.013 298.569 109.115 298.569 109.232V111.488C298.569 111.605 298.526 111.707 298.441 111.792C298.355 111.877 298.254 111.92 298.137 111.92H291.913V112.928H297.257C297.374 112.928 297.475 112.971 297.561 113.056C297.646 113.141 297.689 113.243 297.689 113.36V115.44C297.689 115.557 297.646 115.659 297.561 115.744C297.475 115.829 297.374 115.872 297.257 115.872H291.913V116.88H298.297ZM306.962 108.64C308.2 108.64 309.186 108.811 309.922 109.152C310.669 109.483 311.192 109.877 311.49 110.336C311.789 110.795 311.938 111.232 311.938 111.648C311.938 112.032 311.858 112.384 311.698 112.704C311.538 113.013 311.346 113.28 311.122 113.504C310.909 113.717 310.616 113.989 310.242 114.32C309.762 114.704 309.426 115.029 309.234 115.296C309.096 115.488 308.994 115.616 308.93 115.68C308.877 115.733 308.786 115.76 308.658 115.76H304.914C304.84 115.76 304.77 115.733 304.706 115.68C304.642 115.616 304.61 115.547 304.61 115.472C304.61 115.419 304.616 115.376 304.626 115.344C304.744 114.981 304.946 114.656 305.234 114.368C305.533 114.08 305.912 113.776 306.37 113.456C306.722 113.2 306.978 112.997 307.138 112.848C307.298 112.688 307.378 112.528 307.378 112.368C307.378 112.208 307.325 112.069 307.218 111.952C307.112 111.835 306.93 111.776 306.674 111.776C306.397 111.776 306.2 111.824 306.082 111.92C305.976 112.005 305.88 112.139 305.794 112.32C305.72 112.469 305.64 112.581 305.554 112.656C305.48 112.731 305.352 112.768 305.17 112.768H301.874C301.757 112.768 301.661 112.72 301.586 112.624C301.512 112.528 301.474 112.416 301.474 112.288V112.272C301.474 111.696 301.672 111.131 302.066 110.576C302.461 110.011 303.069 109.547 303.89 109.184C304.722 108.821 305.746 108.64 306.962 108.64ZM308.402 116.432C308.52 116.432 308.621 116.475 308.706 116.56C308.792 116.645 308.834 116.747 308.834 116.864V119.568C308.834 119.685 308.792 119.787 308.706 119.872C308.621 119.957 308.52 120 308.402 120H305.154C305.037 120 304.936 119.957 304.85 119.872C304.765 119.787 304.722 119.685 304.722 119.568V116.864C304.722 116.747 304.765 116.645 304.85 116.56C304.936 116.475 305.037 116.432 305.154 116.432H308.402Z"/>
</mask>
<path d="M101.392 119.568C101.36 119.664 101.28 119.76 101.152 119.856C101.035 119.952 100.88 120 100.688 120H98.448C98.2453 120 98.0747 119.941 97.936 119.824C97.808 119.696 97.7333 119.552 97.712 119.392L96.32 109.2V109.152C96.32 109.056 96.352 108.976 96.416 108.912C96.4907 108.837 96.576 108.8 96.672 108.8H99.424C99.6373 108.8 99.808 108.864 99.936 108.992C100.075 109.12 100.155 109.28 100.176 109.472L100.688 114.368L101.616 111.824C101.648 111.717 101.723 111.616 101.84 111.52C101.968 111.413 102.128 111.36 102.32 111.36H103.408C103.6 111.36 103.755 111.413 103.872 111.52C104 111.616 104.08 111.717 104.112 111.824L105.04 114.368L105.552 109.472C105.573 109.28 105.648 109.12 105.776 108.992C105.915 108.864 106.091 108.8 106.304 108.8H109.056C109.152 108.8 109.232 108.837 109.296 108.912C109.371 108.976 109.408 109.056 109.408 109.152V109.2L108.016 119.392C107.995 119.552 107.915 119.696 107.776 119.824C107.648 119.941 107.483 120 107.28 120H105.04C104.848 120 104.688 119.952 104.56 119.856C104.443 119.76 104.368 119.664 104.336 119.568L102.864 116.192L101.392 119.568ZM121.722 108.8C121.839 108.8 121.94 108.843 122.026 108.928C122.111 109.013 122.154 109.115 122.154 109.232V119.568C122.154 119.685 122.111 119.787 122.026 119.872C121.94 119.957 121.839 120 121.722 120H118.426C118.308 120 118.207 119.957 118.122 119.872C118.036 119.787 117.994 119.685 117.994 119.568V116.16H114.794V119.568C114.794 119.685 114.751 119.787 114.666 119.872C114.58 119.957 114.479 120 114.362 120H111.066C110.948 120 110.847 119.963 110.762 119.888C110.676 119.803 110.634 119.696 110.634 119.568V109.232C110.634 109.115 110.676 109.013 110.762 108.928C110.847 108.843 110.948 108.8 111.066 108.8H114.362C114.479 108.8 114.58 108.843 114.666 108.928C114.751 109.013 114.794 109.115 114.794 109.232V112.512H117.994V109.232C117.994 109.115 118.036 109.013 118.122 108.928C118.207 108.843 118.308 108.8 118.426 108.8H121.722ZM127.684 119.456C127.545 119.819 127.305 120 126.964 120H123.94C123.844 120 123.758 119.968 123.684 119.904C123.62 119.829 123.588 119.744 123.588 119.648L123.604 119.552L127.092 109.328C127.134 109.189 127.214 109.067 127.332 108.96C127.449 108.853 127.609 108.8 127.812 108.8H132.26C132.462 108.8 132.622 108.853 132.74 108.96C132.857 109.067 132.937 109.189 132.98 109.328L136.468 119.552L136.484 119.648C136.484 119.744 136.446 119.829 136.372 119.904C136.308 119.968 136.228 120 136.132 120H133.108C132.766 120 132.526 119.819 132.388 119.456L131.988 118.336H128.084L127.684 119.456ZM130.036 111.888L128.9 115.216H131.172L130.036 111.888ZM149.101 108.8C149.219 108.8 149.32 108.843 149.405 108.928C149.491 109.013 149.533 109.115 149.533 109.232V111.808C149.533 111.925 149.491 112.027 149.405 112.112C149.32 112.197 149.219 112.24 149.101 112.24H145.661V119.568C145.661 119.685 145.619 119.787 145.533 119.872C145.448 119.957 145.347 120 145.229 120H141.933C141.816 120 141.715 119.957 141.629 119.872C141.544 119.787 141.501 119.685 141.501 119.568V112.24H138.061C137.944 112.24 137.843 112.197 137.757 112.112C137.672 112.027 137.629 111.925 137.629 111.808V109.232C137.629 109.115 137.672 109.013 137.757 108.928C137.843 108.843 137.944 108.8 138.061 108.8H149.101ZM150.327 109.264C150.348 109.104 150.428 108.96 150.567 108.832C150.716 108.704 150.892 108.64 151.095 108.64H153.095C153.191 108.64 153.271 108.677 153.335 108.752C153.41 108.816 153.447 108.896 153.447 108.992C153.447 109.035 153.442 109.072 153.431 109.104L151.911 112.96C151.858 113.088 151.767 113.205 151.639 113.312C151.522 113.419 151.367 113.472 151.175 113.472H150.087C149.991 113.472 149.911 113.44 149.847 113.376C149.772 113.301 149.735 113.216 149.735 113.12V113.088L150.327 109.264ZM159.367 112.864C160.54 112.992 161.479 113.2 162.183 113.488C162.898 113.776 163.415 114.155 163.735 114.624C164.055 115.093 164.215 115.68 164.215 116.384C164.215 117.152 163.964 117.824 163.463 118.4C162.972 118.965 162.29 119.403 161.415 119.712C160.54 120.011 159.543 120.16 158.423 120.16C157.175 120.16 156.119 120.005 155.255 119.696C154.391 119.387 153.746 118.976 153.319 118.464C152.892 117.941 152.679 117.371 152.679 116.752C152.679 116.645 152.711 116.56 152.775 116.496C152.85 116.432 152.94 116.4 153.047 116.4H156.327C156.551 116.4 156.732 116.469 156.871 116.608C157.052 116.779 157.255 116.896 157.479 116.96C157.703 117.013 158.018 117.04 158.423 117.04C159.436 117.04 159.943 116.885 159.943 116.576C159.943 116.448 159.874 116.341 159.735 116.256C159.607 116.16 159.372 116.08 159.031 116.016C158.7 115.941 158.21 115.867 157.559 115.792C156.098 115.621 154.978 115.259 154.199 114.704C153.42 114.139 153.031 113.344 153.031 112.32C153.031 111.595 153.25 110.955 153.687 110.4C154.124 109.845 154.743 109.413 155.543 109.104C156.354 108.795 157.292 108.64 158.359 108.64C159.468 108.64 160.439 108.816 161.271 109.168C162.103 109.509 162.738 109.936 163.175 110.448C163.612 110.96 163.831 111.461 163.831 111.952C163.831 112.059 163.794 112.144 163.719 112.208C163.655 112.272 163.564 112.304 163.447 112.304H160.007C159.826 112.304 159.66 112.24 159.511 112.112C159.394 112.005 159.255 111.92 159.095 111.856C158.935 111.792 158.69 111.76 158.359 111.76C157.644 111.76 157.287 111.909 157.287 112.208C157.287 112.368 157.426 112.496 157.703 112.592C157.98 112.677 158.535 112.768 159.367 112.864ZM189.883 108.8C190 108.8 190.101 108.843 190.187 108.928C190.272 109.013 190.315 109.115 190.315 109.232V111.808C190.315 111.925 190.272 112.027 190.187 112.112C190.101 112.197 190 112.24 189.883 112.24H186.443V119.568C186.443 119.685 186.4 119.787 186.315 119.872C186.229 119.957 186.128 120 186.01 120H182.715C182.597 120 182.496 119.957 182.411 119.872C182.325 119.787 182.283 119.685 182.283 119.568V112.24H178.843C178.725 112.24 178.624 112.197 178.539 112.112C178.453 112.027 178.411 111.925 178.411 111.808V109.232C178.411 109.115 178.453 109.013 178.539 108.928C178.624 108.843 178.725 108.8 178.843 108.8H189.883ZM203.284 108.8C203.402 108.8 203.503 108.843 203.588 108.928C203.674 109.013 203.716 109.115 203.716 109.232V119.568C203.716 119.685 203.674 119.787 203.588 119.872C203.503 119.957 203.402 120 203.284 120H199.988C199.871 120 199.77 119.957 199.684 119.872C199.599 119.787 199.556 119.685 199.556 119.568V116.16H196.356V119.568C196.356 119.685 196.314 119.787 196.228 119.872C196.143 119.957 196.042 120 195.924 120H192.628C192.511 120 192.41 119.963 192.324 119.888C192.239 119.803 192.196 119.696 192.196 119.568V109.232C192.196 109.115 192.239 109.013 192.324 108.928C192.41 108.843 192.511 108.8 192.628 108.8H195.924C196.042 108.8 196.143 108.843 196.228 108.928C196.314 109.013 196.356 109.115 196.356 109.232V112.512H199.556V109.232C199.556 109.115 199.599 109.013 199.684 108.928C199.77 108.843 199.871 108.8 199.988 108.8H203.284ZM216.734 116.88C216.851 116.88 216.953 116.923 217.038 117.008C217.123 117.093 217.166 117.195 217.166 117.312V119.568C217.166 119.685 217.123 119.787 217.038 119.872C216.953 119.957 216.851 120 216.734 120H206.622C206.505 120 206.403 119.957 206.318 119.872C206.233 119.787 206.19 119.685 206.19 119.568V109.232C206.19 109.115 206.233 109.013 206.318 108.928C206.403 108.843 206.505 108.8 206.622 108.8H216.574C216.691 108.8 216.793 108.843 216.878 108.928C216.963 109.013 217.006 109.115 217.006 109.232V111.488C217.006 111.605 216.963 111.707 216.878 111.792C216.793 111.877 216.691 111.92 216.574 111.92H210.35V112.928H215.694C215.811 112.928 215.913 112.971 215.998 113.056C216.083 113.141 216.126 113.243 216.126 113.36V115.44C216.126 115.557 216.083 115.659 215.998 115.744C215.913 115.829 215.811 115.872 215.694 115.872H210.35V116.88H216.734ZM244.258 108.8C244.375 108.8 244.476 108.843 244.562 108.928C244.647 109.013 244.69 109.115 244.69 109.232V111.808C244.69 111.925 244.647 112.027 244.562 112.112C244.476 112.197 244.375 112.24 244.258 112.24H240.818V119.568C240.818 119.685 240.775 119.787 240.69 119.872C240.604 119.957 240.503 120 240.385 120H237.09C236.972 120 236.871 119.957 236.786 119.872C236.7 119.787 236.658 119.685 236.658 119.568V112.24H233.218C233.1 112.24 232.999 112.197 232.914 112.112C232.828 112.027 232.786 111.925 232.786 111.808V109.232C232.786 109.115 232.828 109.013 232.914 108.928C232.999 108.843 233.1 108.8 233.218 108.8H244.258ZM254.507 116.72H257.403C257.521 116.72 257.622 116.763 257.707 116.848C257.793 116.933 257.835 117.035 257.835 117.152V119.568C257.835 119.685 257.793 119.787 257.707 119.872C257.622 119.957 257.521 120 257.403 120H247.259C247.142 120 247.041 119.957 246.955 119.872C246.87 119.787 246.827 119.685 246.827 119.568V117.152C246.827 117.035 246.87 116.933 246.955 116.848C247.041 116.763 247.142 116.72 247.259 116.72H250.187V112.08H247.259C247.142 112.08 247.041 112.037 246.955 111.952C246.87 111.867 246.827 111.765 246.827 111.648V109.232C246.827 109.115 246.87 109.013 246.955 108.928C247.041 108.843 247.142 108.8 247.259 108.8H257.403C257.521 108.8 257.622 108.843 257.707 108.928C257.793 109.013 257.835 109.115 257.835 109.232V111.648C257.835 111.765 257.793 111.867 257.707 111.952C257.622 112.037 257.521 112.08 257.403 112.08H254.507V116.72ZM271.445 108.8C271.562 108.8 271.664 108.843 271.749 108.928C271.834 109.013 271.877 109.115 271.877 109.232V111.808C271.877 111.925 271.834 112.027 271.749 112.112C271.664 112.197 271.562 112.24 271.445 112.24H268.005V119.568C268.005 119.685 267.962 119.787 267.877 119.872C267.792 119.957 267.69 120 267.573 120H264.277C264.16 120 264.058 119.957 263.973 119.872C263.888 119.787 263.845 119.685 263.845 119.568V112.24H260.405C260.288 112.24 260.186 112.197 260.101 112.112C260.016 112.027 259.973 111.925 259.973 111.808V109.232C259.973 109.115 260.016 109.013 260.101 108.928C260.186 108.843 260.288 108.8 260.405 108.8H271.445ZM284.735 116.72C284.852 116.72 284.953 116.763 285.039 116.848C285.124 116.933 285.167 117.035 285.167 117.152V119.568C285.167 119.685 285.124 119.787 285.039 119.872C284.953 119.957 284.852 120 284.735 120H275.391C275.273 120 275.172 119.957 275.087 119.872C275.001 119.787 274.959 119.685 274.959 119.568V109.232C274.959 109.115 275.001 109.013 275.087 108.928C275.172 108.843 275.273 108.8 275.391 108.8H278.847C278.964 108.8 279.065 108.843 279.151 108.928C279.236 109.013 279.279 109.115 279.279 109.232V116.72H284.735ZM298.297 116.88C298.414 116.88 298.515 116.923 298.601 117.008C298.686 117.093 298.729 117.195 298.729 117.312V119.568C298.729 119.685 298.686 119.787 298.601 119.872C298.515 119.957 298.414 120 298.297 120H288.185C288.067 120 287.966 119.957 287.881 119.872C287.795 119.787 287.753 119.685 287.753 119.568V109.232C287.753 109.115 287.795 109.013 287.881 108.928C287.966 108.843 288.067 108.8 288.185 108.8H298.137C298.254 108.8 298.355 108.843 298.441 108.928C298.526 109.013 298.569 109.115 298.569 109.232V111.488C298.569 111.605 298.526 111.707 298.441 111.792C298.355 111.877 298.254 111.92 298.137 111.92H291.913V112.928H297.257C297.374 112.928 297.475 112.971 297.561 113.056C297.646 113.141 297.689 113.243 297.689 113.36V115.44C297.689 115.557 297.646 115.659 297.561 115.744C297.475 115.829 297.374 115.872 297.257 115.872H291.913V116.88H298.297ZM306.962 108.64C308.2 108.64 309.186 108.811 309.922 109.152C310.669 109.483 311.192 109.877 311.49 110.336C311.789 110.795 311.938 111.232 311.938 111.648C311.938 112.032 311.858 112.384 311.698 112.704C311.538 113.013 311.346 113.28 311.122 113.504C310.909 113.717 310.616 113.989 310.242 114.32C309.762 114.704 309.426 115.029 309.234 115.296C309.096 115.488 308.994 115.616 308.93 115.68C308.877 115.733 308.786 115.76 308.658 115.76H304.914C304.84 115.76 304.77 115.733 304.706 115.68C304.642 115.616 304.61 115.547 304.61 115.472C304.61 115.419 304.616 115.376 304.626 115.344C304.744 114.981 304.946 114.656 305.234 114.368C305.533 114.08 305.912 113.776 306.37 113.456C306.722 113.2 306.978 112.997 307.138 112.848C307.298 112.688 307.378 112.528 307.378 112.368C307.378 112.208 307.325 112.069 307.218 111.952C307.112 111.835 306.93 111.776 306.674 111.776C306.397 111.776 306.2 111.824 306.082 111.92C305.976 112.005 305.88 112.139 305.794 112.32C305.72 112.469 305.64 112.581 305.554 112.656C305.48 112.731 305.352 112.768 305.17 112.768H301.874C301.757 112.768 301.661 112.72 301.586 112.624C301.512 112.528 301.474 112.416 301.474 112.288V112.272C301.474 111.696 301.672 111.131 302.066 110.576C302.461 110.011 303.069 109.547 303.89 109.184C304.722 108.821 305.746 108.64 306.962 108.64ZM308.402 116.432C308.52 116.432 308.621 116.475 308.706 116.56C308.792 116.645 308.834 116.747 308.834 116.864V119.568C308.834 119.685 308.792 119.787 308.706 119.872C308.621 119.957 308.52 120 308.402 120H305.154C305.037 120 304.936 119.957 304.85 119.872C304.765 119.787 304.722 119.685 304.722 119.568V116.864C304.722 116.747 304.765 116.645 304.85 116.56C304.936 116.475 305.037 116.432 305.154 116.432H308.402Z" fill="#F6A507"/>
<path d="M101.392 119.568L100.475 119.168L100.457 119.209L100.443 119.252L101.392 119.568ZM101.152 119.856L100.552 119.056L100.535 119.069L100.519 119.082L101.152 119.856ZM97.936 119.824L97.2289 120.531L97.2583 120.561L97.2901 120.587L97.936 119.824ZM97.712 119.392L98.7032 119.26L98.7028 119.257L97.712 119.392ZM96.32 109.2H95.32V109.268L95.3292 109.335L96.32 109.2ZM96.416 108.912L97.1231 109.619L97.1231 109.619L96.416 108.912ZM99.936 108.992L99.2289 109.699L99.243 109.713L99.2577 109.727L99.936 108.992ZM100.176 109.472L101.171 109.368L101.17 109.362L100.176 109.472ZM100.688 114.368L99.6934 114.472L101.627 114.711L100.688 114.368ZM101.616 111.824L102.555 112.167L102.565 112.139L102.574 112.111L101.616 111.824ZM101.84 111.52L102.473 112.294L102.48 112.288L101.84 111.52ZM103.872 111.52L103.199 112.26L103.234 112.292L103.272 112.32L103.872 111.52ZM104.112 111.824L103.154 112.111L103.163 112.139L103.173 112.167L104.112 111.824ZM105.04 114.368L104.101 114.711L106.035 114.472L105.04 114.368ZM105.552 109.472L104.558 109.362L104.557 109.368L105.552 109.472ZM105.776 108.992L105.098 108.257L105.083 108.271L105.069 108.285L105.776 108.992ZM109.296 108.912L108.537 109.563L108.587 109.621L108.645 109.671L109.296 108.912ZM109.408 109.2L110.399 109.335L110.408 109.268V109.2H109.408ZM108.016 119.392L107.025 119.257L107.025 119.26L108.016 119.392ZM107.776 119.824L108.452 120.561L108.454 120.559L107.776 119.824ZM104.56 119.856L103.927 120.63L103.943 120.643L103.96 120.656L104.56 119.856ZM104.336 119.568L105.285 119.252L105.271 119.209L105.253 119.168L104.336 119.568ZM102.864 116.192L103.781 115.792L102.864 113.69L101.947 115.792L102.864 116.192ZM101.392 119.568L100.443 119.252C100.475 119.157 100.518 119.098 100.54 119.072C100.561 119.046 100.57 119.042 100.552 119.056L101.152 119.856L101.752 120.656C101.956 120.503 102.217 120.256 102.341 119.884L101.392 119.568ZM101.152 119.856L100.519 119.082C100.566 119.043 100.615 119.02 100.652 119.009C100.686 118.998 100.702 119 100.688 119V120V121C101.048 121 101.446 120.908 101.785 120.63L101.152 119.856ZM100.688 120V119H98.448V120V121H100.688V120ZM98.448 120V119C98.4438 119 98.4618 119 98.4931 119.01C98.5259 119.022 98.5572 119.04 98.5819 119.061L97.936 119.824L97.2901 120.587C97.6304 120.875 98.038 121 98.448 121V120ZM97.936 119.824L98.6431 119.117C98.643 119.117 98.6465 119.12 98.6519 119.128C98.6574 119.135 98.6644 119.146 98.6718 119.16C98.6873 119.19 98.6985 119.225 98.7032 119.26L97.712 119.392L96.7208 119.524C96.7746 119.928 96.9655 120.268 97.2289 120.531L97.936 119.824ZM97.712 119.392L98.7028 119.257L97.3108 109.065L96.32 109.2L95.3292 109.335L96.7212 119.527L97.712 119.392ZM96.32 109.2H97.32V109.152H96.32H95.32V109.2H96.32ZM96.32 109.152H97.32C97.32 109.217 97.3088 109.301 97.2725 109.391C97.2357 109.483 97.1819 109.56 97.1231 109.619L96.416 108.912L95.7089 108.205C95.4451 108.469 95.32 108.809 95.32 109.152H96.32ZM96.416 108.912L97.1231 109.619C97.084 109.658 97.0226 109.707 96.9368 109.744C96.8492 109.782 96.7576 109.8 96.672 109.8V108.8V107.8C96.283 107.8 95.9505 107.963 95.7089 108.205L96.416 108.912ZM96.672 108.8V109.8H99.424V108.8V107.8H96.672V108.8ZM99.424 108.8V109.8C99.4308 109.8 99.4052 109.801 99.3609 109.784C99.3135 109.767 99.2666 109.737 99.2289 109.699L99.936 108.992L100.643 108.285C100.294 107.936 99.8516 107.8 99.424 107.8V108.8ZM99.936 108.992L99.2577 109.727C99.2431 109.713 99.2226 109.689 99.2056 109.655C99.1887 109.622 99.1834 109.594 99.1821 109.582L100.176 109.472L101.17 109.362C101.123 108.936 100.934 108.553 100.614 108.257L99.936 108.992ZM100.176 109.472L99.1814 109.576L99.6934 114.472L100.688 114.368L101.683 114.264L101.171 109.368L100.176 109.472ZM100.688 114.368L101.627 114.711L102.555 112.167L101.616 111.824L100.677 111.481L99.7486 114.025L100.688 114.368ZM101.616 111.824L102.574 112.111C102.531 112.253 102.456 112.308 102.473 112.294L101.84 111.52L101.207 110.746C100.989 110.924 100.765 111.181 100.658 111.537L101.616 111.824ZM101.84 111.52L102.48 112.288C102.447 112.316 102.409 112.336 102.372 112.349C102.337 112.36 102.317 112.36 102.32 112.36V111.36V110.36C101.932 110.36 101.534 110.473 101.2 110.752L101.84 111.52ZM102.32 111.36V112.36H103.408V111.36V110.36H102.32V111.36ZM103.408 111.36V112.36C103.412 112.36 103.386 112.361 103.342 112.345C103.295 112.329 103.244 112.301 103.199 112.26L103.872 111.52L104.545 110.78C104.206 110.472 103.794 110.36 103.408 110.36V111.36ZM103.872 111.52L103.272 112.32C103.301 112.342 103.205 112.281 103.154 112.111L104.112 111.824L105.07 111.537C104.955 111.153 104.699 110.89 104.472 110.72L103.872 111.52ZM104.112 111.824L103.173 112.167L104.101 114.711L105.04 114.368L105.979 114.025L105.051 111.481L104.112 111.824ZM105.04 114.368L106.035 114.472L106.547 109.576L105.552 109.472L104.557 109.368L104.045 114.264L105.04 114.368ZM105.552 109.472L106.546 109.582C106.546 109.585 106.543 109.603 106.53 109.631C106.517 109.659 106.499 109.683 106.483 109.699L105.776 108.992L105.069 108.285C104.769 108.585 104.603 108.96 104.558 109.362L105.552 109.472ZM105.776 108.992L106.454 109.727C106.427 109.752 106.391 109.774 106.354 109.788C106.318 109.801 106.298 109.8 106.304 109.8V108.8V107.8C105.875 107.8 105.446 107.936 105.098 108.257L105.776 108.992ZM106.304 108.8V109.8H109.056V108.8V107.8H106.304V108.8ZM109.056 108.8V109.8C108.971 109.8 108.869 109.783 108.765 109.734C108.662 109.686 108.587 109.621 108.537 109.563L109.296 108.912L110.055 108.261C109.807 107.971 109.452 107.8 109.056 107.8V108.8ZM109.296 108.912L108.645 109.671C108.587 109.621 108.522 109.546 108.474 109.443C108.425 109.339 108.408 109.237 108.408 109.152H109.408H110.408C110.408 108.756 110.237 108.401 109.947 108.153L109.296 108.912ZM109.408 109.152H108.408V109.2H109.408H110.408V109.152H109.408ZM109.408 109.2L108.417 109.065L107.025 119.257L108.016 119.392L109.007 119.527L110.399 109.335L109.408 109.2ZM108.016 119.392L107.025 119.26C107.031 119.213 107.046 119.17 107.066 119.134C107.084 119.101 107.1 119.087 107.098 119.089L107.776 119.824L108.454 120.559C108.734 120.301 108.95 119.953 109.007 119.524L108.016 119.392ZM107.776 119.824L107.1 119.087C107.136 119.054 107.179 119.029 107.222 119.014C107.262 118.999 107.285 119 107.28 119V120V121C107.688 121 108.109 120.875 108.452 120.561L107.776 119.824ZM107.28 120V119H105.04V120V121H107.28V120ZM105.04 120V119C105.027 119 105.037 118.998 105.063 119.006C105.091 119.014 105.126 119.03 105.16 119.056L104.56 119.856L103.96 120.656C104.294 120.906 104.676 121 105.04 121V120ZM104.56 119.856L105.193 119.082C105.179 119.07 105.187 119.075 105.205 119.098C105.224 119.122 105.258 119.173 105.285 119.252L104.336 119.568L103.387 119.884C103.502 120.228 103.731 120.47 103.927 120.63L104.56 119.856ZM104.336 119.568L105.253 119.168L103.781 115.792L102.864 116.192L101.947 116.592L103.419 119.968L104.336 119.568ZM102.864 116.192L101.947 115.792L100.475 119.168L101.392 119.568L102.309 119.968L103.781 116.592L102.864 116.192ZM122.026 108.928L121.319 109.635L121.319 109.635L122.026 108.928ZM122.026 119.872L121.319 119.165L121.319 119.165L122.026 119.872ZM118.122 119.872L118.829 119.165L118.829 119.165L118.122 119.872ZM117.994 116.16H118.994V115.16H117.994V116.16ZM114.794 116.16V115.16H113.794V116.16H114.794ZM114.666 119.872L113.959 119.165L113.959 119.165L114.666 119.872ZM110.762 119.888L110.055 120.595L110.078 120.619L110.103 120.641L110.762 119.888ZM110.762 108.928L111.469 109.635V109.635L110.762 108.928ZM114.666 108.928L113.959 109.635L113.959 109.635L114.666 108.928ZM114.794 112.512H113.794V113.512H114.794V112.512ZM117.994 112.512V113.512H118.994V112.512H117.994ZM118.122 108.928L118.829 109.635L118.829 109.635L118.122 108.928ZM121.722 108.8V109.8C121.656 109.8 121.578 109.787 121.498 109.754C121.418 109.72 121.358 109.675 121.319 109.635L122.026 108.928L122.733 108.221C122.466 107.954 122.113 107.8 121.722 107.8V108.8ZM122.026 108.928L121.319 109.635C121.279 109.595 121.234 109.536 121.2 109.456C121.166 109.376 121.154 109.298 121.154 109.232H122.154H123.154C123.154 108.841 123 108.488 122.733 108.221L122.026 108.928ZM122.154 109.232H121.154V119.568H122.154H123.154V109.232H122.154ZM122.154 119.568H121.154C121.154 119.502 121.166 119.424 121.2 119.344C121.234 119.264 121.279 119.205 121.319 119.165L122.026 119.872L122.733 120.579C123 120.312 123.154 119.959 123.154 119.568H122.154ZM122.026 119.872L121.319 119.165C121.358 119.125 121.418 119.08 121.498 119.046C121.578 119.013 121.656 119 121.722 119V120V121C122.113 121 122.466 120.846 122.733 120.579L122.026 119.872ZM121.722 120V119H118.426V120V121H121.722V120ZM118.426 120V119C118.491 119 118.57 119.013 118.65 119.046C118.73 119.08 118.789 119.125 118.829 119.165L118.122 119.872L117.415 120.579C117.682 120.846 118.035 121 118.426 121V120ZM118.122 119.872L118.829 119.165C118.869 119.205 118.914 119.264 118.947 119.344C118.981 119.424 118.994 119.502 118.994 119.568H117.994H116.994C116.994 119.959 117.148 120.312 117.415 120.579L118.122 119.872ZM117.994 119.568H118.994V116.16H117.994H116.994V119.568H117.994ZM117.994 116.16V115.16H114.794V116.16V117.16H117.994V116.16ZM114.794 116.16H113.794V119.568H114.794H115.794V116.16H114.794ZM114.794 119.568H113.794C113.794 119.502 113.806 119.424 113.84 119.344C113.874 119.264 113.919 119.205 113.959 119.165L114.666 119.872L115.373 120.579C115.64 120.312 115.794 119.959 115.794 119.568H114.794ZM114.666 119.872L113.959 119.165C113.998 119.125 114.058 119.08 114.138 119.046C114.218 119.013 114.296 119 114.362 119V120V121C114.753 121 115.106 120.846 115.373 120.579L114.666 119.872ZM114.362 120V119H111.066V120V121H114.362V120ZM111.066 120V119C111.115 119 111.178 119.008 111.247 119.034C111.317 119.059 111.376 119.096 111.42 119.135L110.762 119.888L110.103 120.641C110.378 120.881 110.715 121 111.066 121V120ZM110.762 119.888L111.469 119.181C111.517 119.229 111.563 119.294 111.594 119.373C111.625 119.45 111.634 119.519 111.634 119.568H110.634H109.634C109.634 119.943 109.77 120.31 110.055 120.595L110.762 119.888ZM110.634 119.568H111.634V109.232H110.634H109.634V119.568H110.634ZM110.634 109.232H111.634C111.634 109.298 111.621 109.376 111.587 109.456C111.554 109.536 111.509 109.595 111.469 109.635L110.762 108.928L110.055 108.221C109.788 108.488 109.634 108.841 109.634 109.232H110.634ZM110.762 108.928L111.469 109.635C111.429 109.675 111.37 109.72 111.29 109.754C111.21 109.787 111.131 109.8 111.066 109.8V108.8V107.8C110.675 107.8 110.322 107.954 110.055 108.221L110.762 108.928ZM111.066 108.8V109.8H114.362V108.8V107.8H111.066V108.8ZM114.362 108.8V109.8C114.296 109.8 114.218 109.787 114.138 109.754C114.058 109.72 113.998 109.675 113.959 109.635L114.666 108.928L115.373 108.221C115.106 107.954 114.753 107.8 114.362 107.8V108.8ZM114.666 108.928L113.959 109.635C113.919 109.595 113.874 109.536 113.84 109.456C113.806 109.376 113.794 109.298 113.794 109.232H114.794H115.794C115.794 108.841 115.64 108.488 115.373 108.221L114.666 108.928ZM114.794 109.232H113.794V112.512H114.794H115.794V109.232H114.794ZM114.794 112.512V113.512H117.994V112.512V111.512H114.794V112.512ZM117.994 112.512H118.994V109.232H117.994H116.994V112.512H117.994ZM117.994 109.232H118.994C118.994 109.298 118.981 109.376 118.947 109.456C118.914 109.536 118.869 109.595 118.829 109.635L118.122 108.928L117.415 108.221C117.148 108.488 116.994 108.841 116.994 109.232H117.994ZM118.122 108.928L118.829 109.635C118.789 109.675 118.73 109.72 118.65 109.754C118.57 109.787 118.491 109.8 118.426 109.8V108.8V107.8C118.035 107.8 117.682 107.954 117.415 108.221L118.122 108.928ZM118.426 108.8V109.8H121.722V108.8V107.8H118.426V108.8ZM127.684 119.456L128.618 119.813L128.622 119.803L128.625 119.792L127.684 119.456ZM123.684 119.904L122.924 120.555L122.974 120.613L123.033 120.663L123.684 119.904ZM123.587 119.648L122.601 119.484L122.587 119.565V119.648H123.587ZM123.604 119.552L122.657 119.229L122.631 119.307L122.617 119.388L123.604 119.552ZM127.091 109.328L128.038 109.651L128.043 109.637L128.047 109.622L127.091 109.328ZM127.332 108.96L126.659 108.22L126.659 108.22L127.332 108.96ZM132.74 108.96L133.412 108.22V108.22L132.74 108.96ZM132.979 109.328L132.024 109.622L132.028 109.637L132.033 109.651L132.979 109.328ZM136.467 119.552L137.454 119.388L137.44 119.307L137.414 119.229L136.467 119.552ZM136.484 119.648H137.484V119.565L137.47 119.484L136.484 119.648ZM136.372 119.904L137.079 120.611L137.079 120.611L136.372 119.904ZM132.388 119.456L131.446 119.792L131.449 119.803L131.453 119.813L132.388 119.456ZM131.987 118.336L132.929 118L132.692 117.336H131.987V118.336ZM128.083 118.336V117.336H127.379L127.142 118L128.083 118.336ZM130.035 111.888L130.982 111.565L130.035 108.792L129.089 111.565L130.035 111.888ZM128.9 115.216L127.953 114.893L127.502 116.216H128.9V115.216ZM131.172 115.216V116.216H132.569L132.118 114.893L131.172 115.216ZM127.684 119.456L126.749 119.099C126.728 119.155 126.729 119.117 126.797 119.066C126.83 119.041 126.867 119.023 126.903 119.011C126.937 119.001 126.96 119 126.964 119V120V121C127.321 121 127.686 120.901 128.002 120.662C128.31 120.43 128.5 120.119 128.618 119.813L127.684 119.456ZM126.964 120V119H123.94V120V121H126.964V120ZM123.94 120V119C124.005 119 124.079 119.011 124.155 119.04C124.23 119.068 124.29 119.107 124.334 119.145L123.684 119.904L123.033 120.663C123.284 120.878 123.598 121 123.94 121V120ZM123.684 119.904L124.443 119.253C124.481 119.298 124.52 119.358 124.548 119.433C124.576 119.508 124.587 119.583 124.587 119.648H123.587H122.587C122.587 119.989 122.709 120.304 122.924 120.555L123.684 119.904ZM123.587 119.648L124.574 119.812L124.59 119.716L123.604 119.552L122.617 119.388L122.601 119.484L123.587 119.648ZM123.604 119.552L124.55 119.875L128.038 109.651L127.091 109.328L126.145 109.005L122.657 119.229L123.604 119.552ZM127.091 109.328L128.047 109.622C128.041 109.643 128.032 109.662 128.021 109.678C128.011 109.694 128.003 109.701 128.004 109.7L127.332 108.96L126.659 108.22C126.422 108.436 126.236 108.708 126.136 109.034L127.091 109.328ZM127.332 108.96L128.004 109.7C127.953 109.746 127.899 109.774 127.856 109.789C127.816 109.802 127.797 109.8 127.812 109.8V108.8V107.8C127.432 107.8 127.007 107.903 126.659 108.22L127.332 108.96ZM127.812 108.8V109.8H132.259V108.8V107.8H127.812V108.8ZM132.259 108.8V109.8C132.274 109.8 132.255 109.802 132.215 109.789C132.172 109.774 132.118 109.746 132.067 109.7L132.74 108.96L133.412 108.22C133.064 107.903 132.639 107.8 132.259 107.8V108.8ZM132.74 108.96L132.067 109.7C132.068 109.701 132.06 109.694 132.05 109.678C132.039 109.662 132.03 109.643 132.024 109.622L132.979 109.328L133.935 109.034C133.835 108.708 133.649 108.436 133.412 108.22L132.74 108.96ZM132.979 109.328L132.033 109.651L135.521 119.875L136.467 119.552L137.414 119.229L133.926 109.005L132.979 109.328ZM136.467 119.552L135.481 119.716L135.497 119.812L136.484 119.648L137.47 119.484L137.454 119.388L136.467 119.552ZM136.484 119.648H135.484C135.484 119.562 135.501 119.471 135.539 119.383C135.577 119.297 135.625 119.236 135.664 119.197L136.372 119.904L137.079 120.611C137.32 120.369 137.484 120.037 137.484 119.648H136.484ZM136.372 119.904L135.664 119.197C135.723 119.138 135.8 119.084 135.892 119.048C135.983 119.011 136.067 119 136.132 119V120V121C136.475 121 136.815 120.875 137.079 120.611L136.372 119.904ZM136.132 120V119H133.107V120V121H136.132V120ZM133.107 120V119C133.111 119 133.134 119.001 133.168 119.011C133.204 119.023 133.241 119.041 133.274 119.066C133.342 119.117 133.343 119.155 133.322 119.099L132.388 119.456L131.453 119.813C131.571 120.119 131.761 120.43 132.069 120.662C132.385 120.901 132.75 121 133.107 121V120ZM132.388 119.456L133.329 119.12L132.929 118L131.987 118.336L131.046 118.672L131.446 119.792L132.388 119.456ZM131.987 118.336V117.336H128.083V118.336V119.336H131.987V118.336ZM128.083 118.336L127.142 118L126.742 119.12L127.684 119.456L128.625 119.792L129.025 118.672L128.083 118.336ZM130.035 111.888L129.089 111.565L127.953 114.893L128.9 115.216L129.846 115.539L130.982 112.211L130.035 111.888ZM128.9 115.216V116.216H131.172V115.216V114.216H128.9V115.216ZM131.172 115.216L132.118 114.893L130.982 111.565L130.035 111.888L129.089 112.211L130.225 115.539L131.172 115.216ZM145.661 112.24V111.24H144.661V112.24H145.661ZM145.533 119.872L146.24 120.579L146.24 120.579L145.533 119.872ZM141.629 119.872L140.922 120.579V120.579L141.629 119.872ZM141.501 112.24H142.501V111.24H141.501V112.24ZM149.101 108.8V109.8C149.036 109.8 148.957 109.787 148.877 109.754C148.797 109.72 148.738 109.675 148.698 109.635L149.405 108.928L150.112 108.221C149.845 107.954 149.492 107.8 149.101 107.8V108.8ZM149.405 108.928L148.698 109.635C148.658 109.595 148.613 109.536 148.58 109.456C148.546 109.376 148.533 109.298 148.533 109.232H149.533H150.533C150.533 108.841 150.379 108.488 150.112 108.221L149.405 108.928ZM149.533 109.232H148.533V111.808H149.533H150.533V109.232H149.533ZM149.533 111.808H148.533C148.533 111.742 148.546 111.664 148.58 111.584C148.613 111.504 148.658 111.445 148.698 111.405L149.405 112.112L150.112 112.819C150.379 112.552 150.533 112.199 150.533 111.808H149.533ZM149.405 112.112L148.698 111.405C148.738 111.365 148.797 111.32 148.877 111.286C148.957 111.253 149.036 111.24 149.101 111.24V112.24V113.24C149.492 113.24 149.845 113.086 150.112 112.819L149.405 112.112ZM149.101 112.24V111.24H145.661V112.24V113.24H149.101V112.24ZM145.661 112.24H144.661V119.568H145.661H146.661V112.24H145.661ZM145.661 119.568H144.661C144.661 119.502 144.674 119.424 144.708 119.344C144.741 119.264 144.786 119.205 144.826 119.165L145.533 119.872L146.24 120.579C146.507 120.312 146.661 119.959 146.661 119.568H145.661ZM145.533 119.872L144.826 119.165C144.866 119.125 144.925 119.08 145.005 119.046C145.085 119.013 145.164 119 145.229 119V120V121C145.62 121 145.973 120.846 146.24 120.579L145.533 119.872ZM145.229 120V119H141.933V120V121H145.229V120ZM141.933 120V119C141.999 119 142.077 119.013 142.157 119.046C142.237 119.08 142.297 119.125 142.336 119.165L141.629 119.872L140.922 120.579C141.189 120.846 141.542 121 141.933 121V120ZM141.629 119.872L142.336 119.165C142.376 119.205 142.421 119.264 142.455 119.344C142.489 119.424 142.501 119.502 142.501 119.568H141.501H140.501C140.501 119.959 140.655 120.312 140.922 120.579L141.629 119.872ZM141.501 119.568H142.501V112.24H141.501H140.501V119.568H141.501ZM141.501 112.24V111.24H138.061V112.24V113.24H141.501V112.24ZM138.061 112.24V111.24C138.127 111.24 138.205 111.253 138.285 111.286C138.365 111.32 138.425 111.365 138.464 111.405L137.757 112.112L137.05 112.819C137.317 113.086 137.67 113.24 138.061 113.24V112.24ZM137.757 112.112L138.464 111.405C138.504 111.445 138.549 111.504 138.583 111.584C138.617 111.664 138.629 111.742 138.629 111.808H137.629H136.629C136.629 112.199 136.783 112.552 137.05 112.819L137.757 112.112ZM137.629 111.808H138.629V109.232H137.629H136.629V111.808H137.629ZM137.629 109.232H138.629C138.629 109.298 138.617 109.376 138.583 109.456C138.549 109.536 138.504 109.595 138.464 109.635L137.757 108.928L137.05 108.221C136.783 108.488 136.629 108.841 136.629 109.232H137.629ZM137.757 108.928L138.464 109.635C138.425 109.675 138.365 109.72 138.285 109.754C138.205 109.787 138.127 109.8 138.061 109.8V108.8V107.8C137.67 107.8 137.317 107.954 137.05 108.221L137.757 108.928ZM138.061 108.8V109.8H149.101V108.8V107.8H138.061V108.8ZM150.327 109.264L151.315 109.417L151.317 109.407L151.318 109.396L150.327 109.264ZM150.567 108.832L149.916 108.073L149.902 108.085L149.889 108.097L150.567 108.832ZM153.335 108.752L152.576 109.403L152.626 109.461L152.684 109.511L153.335 108.752ZM153.431 109.104L154.361 109.471L154.371 109.446L154.38 109.42L153.431 109.104ZM151.911 112.96L152.834 113.345L152.838 113.336L152.841 113.327L151.911 112.96ZM151.639 113.312L150.999 112.544L150.982 112.558L150.966 112.572L151.639 113.312ZM149.847 113.376L150.554 112.669V112.669L149.847 113.376ZM149.735 113.088L148.747 112.935L148.735 113.011V113.088H149.735ZM159.367 112.864L159.252 113.857L159.259 113.858L159.367 112.864ZM162.183 113.488L161.804 114.414L161.809 114.416L162.183 113.488ZM163.735 114.624L162.909 115.187V115.187L163.735 114.624ZM163.463 118.4L162.709 117.743L162.708 117.745L163.463 118.4ZM161.415 119.712L161.738 120.658L161.748 120.655L161.415 119.712ZM155.255 119.696L155.592 118.755V118.755L155.255 119.696ZM153.319 118.464L152.544 119.096L152.551 119.104L153.319 118.464ZM152.775 116.496L152.124 115.737L152.095 115.762L152.068 115.789L152.775 116.496ZM156.871 116.608L156.164 117.315L156.175 117.326L156.186 117.336L156.871 116.608ZM157.479 116.96L157.204 117.922L157.226 117.928L157.247 117.933L157.479 116.96ZM159.735 116.256L159.135 117.056L159.172 117.084L159.211 117.108L159.735 116.256ZM159.031 116.016L158.811 116.991L158.829 116.995L158.847 116.999L159.031 116.016ZM157.559 115.792L157.443 116.785L157.445 116.785L157.559 115.792ZM154.199 114.704L153.611 115.513L153.619 115.518L154.199 114.704ZM153.687 110.4L154.472 111.019V111.019L153.687 110.4ZM155.543 109.104L155.186 108.17L155.182 108.171L155.543 109.104ZM161.271 109.168L160.881 110.089L160.891 110.093L161.271 109.168ZM163.175 110.448L162.415 111.097V111.097L163.175 110.448ZM163.719 112.208L163.068 111.449L163.039 111.474L163.012 111.501L163.719 112.208ZM159.511 112.112L158.838 112.852L158.849 112.862L158.86 112.871L159.511 112.112ZM159.095 111.856L158.724 112.784L158.724 112.784L159.095 111.856ZM157.703 112.592L157.376 113.537L157.392 113.543L157.409 113.548L157.703 112.592ZM150.327 109.264L151.318 109.396C151.312 109.443 151.297 109.486 151.277 109.522C151.259 109.555 151.243 109.569 151.245 109.567L150.567 108.832L149.889 108.097C149.609 108.355 149.393 108.703 149.336 109.132L150.327 109.264ZM150.567 108.832L151.218 109.591C151.206 109.602 151.183 109.617 151.153 109.628C151.123 109.639 151.101 109.64 151.095 109.64V108.64V107.64C150.662 107.64 150.253 107.784 149.916 108.073L150.567 108.832ZM151.095 108.64V109.64H153.095V108.64V107.64H151.095V108.64ZM153.095 108.64V109.64C153.01 109.64 152.908 109.623 152.804 109.574C152.701 109.526 152.626 109.461 152.576 109.403L153.335 108.752L154.094 108.101C153.846 107.811 153.491 107.64 153.095 107.64V108.64ZM153.335 108.752L152.684 109.511C152.626 109.461 152.561 109.386 152.513 109.283C152.464 109.179 152.447 109.077 152.447 108.992H153.447H154.447C154.447 108.596 154.276 108.241 153.986 107.993L153.335 108.752ZM153.447 108.992H152.447C152.447 108.954 152.451 108.881 152.482 108.788L153.431 109.104L154.38 109.42C154.432 109.263 154.447 109.115 154.447 108.992H153.447ZM153.431 109.104L152.501 108.737L150.981 112.593L151.911 112.96L152.841 113.327L154.361 109.471L153.431 109.104ZM151.911 112.96L150.988 112.575C150.997 112.553 151.007 112.539 151.012 112.533C151.016 112.527 151.014 112.531 150.999 112.544L151.639 113.312L152.279 114.08C152.506 113.891 152.707 113.649 152.834 113.345L151.911 112.96ZM151.639 113.312L150.966 112.572C151.011 112.531 151.062 112.503 151.109 112.487C151.153 112.471 151.179 112.472 151.175 112.472V113.472V114.472C151.561 114.472 151.973 114.36 152.312 114.052L151.639 113.312ZM151.175 113.472V112.472H150.087V113.472V114.472H151.175V113.472ZM150.087 113.472V112.472C150.152 112.472 150.236 112.483 150.326 112.52C150.418 112.556 150.495 112.61 150.554 112.669L149.847 113.376L149.14 114.083C149.404 114.347 149.744 114.472 150.087 114.472V113.472ZM149.847 113.376L150.554 112.669C150.593 112.708 150.642 112.769 150.679 112.855C150.717 112.943 150.735 113.034 150.735 113.12H149.735H148.735C148.735 113.509 148.898 113.841 149.14 114.083L149.847 113.376ZM149.735 113.12H150.735V113.088H149.735H148.735V113.12H149.735ZM149.735 113.088L150.723 113.241L151.315 109.417L150.327 109.264L149.339 109.111L148.747 112.935L149.735 113.088ZM159.367 112.864L159.259 113.858C160.384 113.981 161.221 114.175 161.804 114.414L162.183 113.488L162.562 112.562C161.737 112.225 160.696 112.003 159.475 111.87L159.367 112.864ZM162.183 113.488L161.809 114.416C162.404 114.655 162.734 114.93 162.909 115.187L163.735 114.624L164.561 114.061C164.096 113.379 163.391 112.897 162.557 112.56L162.183 113.488ZM163.735 114.624L162.909 115.187C163.091 115.455 163.215 115.833 163.215 116.384H164.215H165.215C165.215 115.527 165.019 114.732 164.561 114.061L163.735 114.624ZM164.215 116.384H163.215C163.215 116.912 163.051 117.351 162.709 117.743L163.463 118.4L164.217 119.057C164.878 118.297 165.215 117.392 165.215 116.384H164.215ZM163.463 118.4L162.708 117.745C162.355 118.151 161.832 118.504 161.082 118.769L161.415 119.712L161.748 120.655C162.748 120.301 163.59 119.779 164.218 119.055L163.463 118.4ZM161.415 119.712L161.092 118.766C160.341 119.022 159.456 119.16 158.423 119.16V120.16V121.16C159.63 121.16 160.74 120.999 161.738 120.658L161.415 119.712ZM158.423 120.16V119.16C157.251 119.16 156.317 119.014 155.592 118.755L155.255 119.696L154.918 120.637C155.921 120.997 157.099 121.16 158.423 121.16V120.16ZM155.255 119.696L155.592 118.755C154.835 118.484 154.364 118.156 154.087 117.824L153.319 118.464L152.551 119.104C153.127 119.796 153.947 120.29 154.918 120.637L155.255 119.696ZM153.319 118.464L154.094 117.832C153.799 117.47 153.679 117.119 153.679 116.752H152.679H151.679C151.679 117.623 151.986 118.412 152.544 119.096L153.319 118.464ZM152.679 116.752H153.679C153.679 116.799 153.672 116.872 153.639 116.959C153.606 117.049 153.552 117.133 153.482 117.203L152.775 116.496L152.068 115.789C151.783 116.074 151.679 116.431 151.679 116.752H152.679ZM152.775 116.496L153.426 117.255C153.372 117.302 153.306 117.341 153.232 117.367C153.159 117.393 153.095 117.4 153.047 117.4V116.4V115.4C152.723 115.4 152.396 115.504 152.124 115.737L152.775 116.496ZM153.047 116.4V117.4H156.327V116.4V115.4H153.047V116.4ZM156.327 116.4V117.4C156.335 117.4 156.313 117.401 156.274 117.386C156.232 117.37 156.193 117.344 156.164 117.315L156.871 116.608L157.578 115.901C157.225 115.548 156.775 115.4 156.327 115.4V116.4ZM156.871 116.608L156.186 117.336C156.475 117.609 156.816 117.811 157.204 117.922L157.479 116.96L157.754 115.998C157.694 115.981 157.63 115.949 157.556 115.88L156.871 116.608ZM157.479 116.96L157.247 117.933C157.584 118.013 157.989 118.04 158.423 118.04V117.04V116.04C158.046 116.04 157.822 116.014 157.711 115.987L157.479 116.96ZM158.423 117.04V118.04C158.956 118.04 159.456 118.002 159.855 117.88C160.187 117.779 160.943 117.446 160.943 116.576H159.943H158.943C158.943 116.473 158.965 116.364 159.014 116.261C159.061 116.16 159.122 116.088 159.173 116.042C159.263 115.959 159.325 115.951 159.271 115.968C159.163 116.001 158.904 116.04 158.423 116.04V117.04ZM159.943 116.576H160.943C160.943 116.005 160.601 115.615 160.259 115.404L159.735 116.256L159.211 117.108C159.188 117.094 159.118 117.046 159.053 116.945C158.981 116.835 158.943 116.704 158.943 116.576H159.943ZM159.735 116.256L160.335 115.456C160.008 115.21 159.571 115.1 159.215 115.033L159.031 116.016L158.847 116.999C158.987 117.025 159.082 117.051 159.14 117.071C159.154 117.075 159.164 117.079 159.172 117.082C159.175 117.083 159.178 117.085 159.18 117.085C159.181 117.086 159.181 117.086 159.182 117.086C159.182 117.086 159.182 117.087 159.182 117.087C159.182 117.087 159.182 117.087 159.182 117.087C159.182 117.087 159.182 117.087 159.182 117.087C159.182 117.087 159.182 117.086 159.182 117.086C159.181 117.086 159.18 117.086 159.18 117.085C159.178 117.084 159.175 117.083 159.171 117.08C159.163 117.076 159.151 117.068 159.135 117.056L159.735 116.256ZM159.031 116.016L159.251 115.041C158.867 114.954 158.333 114.874 157.673 114.799L157.559 115.792L157.445 116.785C158.086 116.859 158.534 116.929 158.811 116.991L159.031 116.016ZM157.559 115.792L157.675 114.799C156.299 114.638 155.366 114.308 154.779 113.89L154.199 114.704L153.619 115.518C154.589 116.21 155.897 116.605 157.443 116.785L157.559 115.792ZM154.199 114.704L154.787 113.895C154.286 113.531 154.031 113.048 154.031 112.32H153.031H152.031C152.031 113.64 152.555 114.746 153.611 115.513L154.199 114.704ZM153.031 112.32H154.031C154.031 111.813 154.178 111.392 154.472 111.019L153.687 110.4L152.902 109.781C152.321 110.517 152.031 111.377 152.031 112.32H153.031ZM153.687 110.4L154.472 111.019C154.777 110.632 155.235 110.295 155.904 110.037L155.543 109.104L155.182 108.171C154.251 108.531 153.472 109.058 152.902 109.781L153.687 110.4ZM155.543 109.104L155.9 110.038C156.574 109.781 157.387 109.64 158.359 109.64V108.64V107.64C157.198 107.64 156.134 107.808 155.186 108.17L155.543 109.104ZM158.359 108.64V109.64C159.364 109.64 160.197 109.8 160.881 110.089L161.271 109.168L161.661 108.247C160.681 107.832 159.573 107.64 158.359 107.64V108.64ZM161.271 109.168L160.891 110.093C161.624 110.394 162.109 110.74 162.415 111.097L163.175 110.448L163.935 109.799C163.366 109.132 162.582 108.625 161.651 108.243L161.271 109.168ZM163.175 110.448L162.415 111.097C162.755 111.496 162.831 111.775 162.831 111.952H163.831H164.831C164.831 111.147 164.47 110.424 163.935 109.799L163.175 110.448ZM163.831 111.952H162.831C162.831 111.887 162.843 111.796 162.887 111.695C162.932 111.592 162.998 111.509 163.068 111.449L163.719 112.208L164.37 112.967C164.686 112.696 164.831 112.323 164.831 111.952H163.831ZM163.719 112.208L163.012 111.501C163.186 111.326 163.381 111.304 163.447 111.304V112.304V113.304C163.748 113.304 164.124 113.218 164.426 112.915L163.719 112.208ZM163.447 112.304V111.304H160.007V112.304V113.304H163.447V112.304ZM160.007 112.304V111.304C160.037 111.304 160.073 111.31 160.108 111.323C160.142 111.337 160.16 111.351 160.162 111.353L159.511 112.112L158.86 112.871C159.174 113.14 159.566 113.304 160.007 113.304V112.304ZM159.511 112.112L160.184 111.372C159.971 111.178 159.728 111.032 159.466 110.928L159.095 111.856L158.724 112.784C158.782 112.808 158.817 112.832 158.838 112.852L159.511 112.112ZM159.095 111.856L159.466 110.928C159.124 110.791 158.722 110.76 158.359 110.76V111.76V112.76C158.494 112.76 158.593 112.767 158.662 112.776C158.734 112.785 158.747 112.794 158.724 112.784L159.095 111.856ZM158.359 111.76V110.76C157.962 110.76 157.534 110.797 157.169 110.949C156.977 111.03 156.752 111.163 156.572 111.388C156.38 111.63 156.287 111.917 156.287 112.208H157.287H158.287C158.287 112.35 158.239 112.506 158.136 112.636C158.045 112.749 157.954 112.789 157.941 112.795C157.926 112.801 157.948 112.79 158.028 112.778C158.104 112.768 158.213 112.76 158.359 112.76V111.76ZM157.287 112.208H156.287C156.287 113.081 157.059 113.427 157.376 113.537L157.703 112.592L158.03 111.647C157.957 111.622 157.997 111.622 158.069 111.689C158.111 111.727 158.168 111.792 158.214 111.888C158.262 111.988 158.287 112.098 158.287 112.208H157.287ZM157.703 112.592L157.409 113.548C157.788 113.664 158.433 113.763 159.252 113.857L159.367 112.864L159.482 111.871C158.637 111.773 158.173 111.69 157.997 111.636L157.703 112.592ZM186.442 112.24V111.24H185.442V112.24H186.442ZM186.314 119.872L187.022 120.579V120.579L186.314 119.872ZM182.41 119.872L181.703 120.579V120.579L182.41 119.872ZM182.283 112.24H183.283V111.24H182.283V112.24ZM189.882 108.8V109.8C189.817 109.8 189.739 109.787 189.658 109.754C189.579 109.72 189.519 109.675 189.479 109.635L190.187 108.928L190.894 108.221C190.627 107.954 190.273 107.8 189.882 107.8V108.8ZM190.187 108.928L189.479 109.635C189.44 109.595 189.394 109.536 189.361 109.456C189.327 109.376 189.314 109.298 189.314 109.232H190.314H191.314C191.314 108.841 191.16 108.488 190.894 108.221L190.187 108.928ZM190.314 109.232H189.314V111.808H190.314H191.314V109.232H190.314ZM190.314 111.808H189.314C189.314 111.742 189.327 111.664 189.361 111.584C189.394 111.504 189.44 111.445 189.479 111.405L190.187 112.112L190.894 112.819C191.16 112.552 191.314 112.199 191.314 111.808H190.314ZM190.187 112.112L189.479 111.405C189.519 111.365 189.579 111.32 189.658 111.286C189.739 111.253 189.817 111.24 189.882 111.24V112.24V113.24C190.273 113.24 190.627 113.086 190.894 112.819L190.187 112.112ZM189.882 112.24V111.24H186.442V112.24V113.24H189.882V112.24ZM186.442 112.24H185.442V119.568H186.442H187.442V112.24H186.442ZM186.442 119.568H185.442C185.442 119.502 185.455 119.424 185.489 119.344C185.522 119.264 185.568 119.205 185.607 119.165L186.314 119.872L187.022 120.579C187.288 120.312 187.442 119.959 187.442 119.568H186.442ZM186.314 119.872L185.607 119.165C185.647 119.125 185.707 119.08 185.786 119.046C185.867 119.013 185.945 119 186.01 119V120V121C186.401 121 186.755 120.846 187.022 120.579L186.314 119.872ZM186.01 120V119H182.715V120V121H186.01V120ZM182.715 120V119C182.78 119 182.858 119.013 182.939 119.046C183.018 119.08 183.078 119.125 183.118 119.165L182.41 119.872L181.703 120.579C181.97 120.846 182.324 121 182.715 121V120ZM182.41 119.872L183.118 119.165C183.157 119.205 183.203 119.264 183.236 119.344C183.27 119.424 183.283 119.502 183.283 119.568H182.283H181.283C181.283 119.959 181.437 120.312 181.703 120.579L182.41 119.872ZM182.283 119.568H183.283V112.24H182.283H181.283V119.568H182.283ZM182.283 112.24V111.24H178.842V112.24V113.24H182.283V112.24ZM178.842 112.24V111.24C178.908 111.24 178.986 111.253 179.067 111.286C179.146 111.32 179.206 111.365 179.246 111.405L178.538 112.112L177.831 112.819C178.098 113.086 178.452 113.24 178.842 113.24V112.24ZM178.538 112.112L179.246 111.405C179.285 111.445 179.331 111.504 179.364 111.584C179.398 111.664 179.41 111.742 179.41 111.808H178.41H177.41C177.41 112.199 177.565 112.552 177.831 112.819L178.538 112.112ZM178.41 111.808H179.41V109.232H178.41H177.41V111.808H178.41ZM178.41 109.232H179.41C179.41 109.298 179.398 109.376 179.364 109.456C179.331 109.536 179.285 109.595 179.246 109.635L178.538 108.928L177.831 108.221C177.565 108.488 177.41 108.841 177.41 109.232H178.41ZM178.538 108.928L179.246 109.635C179.206 109.675 179.146 109.72 179.067 109.754C178.986 109.787 178.908 109.8 178.842 109.8V108.8V107.8C178.452 107.8 178.098 107.954 177.831 108.221L178.538 108.928ZM178.842 108.8V109.8H189.882V108.8V107.8H178.842V108.8ZM203.588 108.928L202.881 109.635V109.635L203.588 108.928ZM203.588 119.872L202.881 119.165V119.165L203.588 119.872ZM199.684 119.872L200.391 119.165V119.165L199.684 119.872ZM199.556 116.16H200.556V115.16H199.556V116.16ZM196.356 116.16V115.16H195.356V116.16H196.356ZM196.228 119.872L195.521 119.165V119.165L196.228 119.872ZM192.324 119.888L191.617 120.595L191.641 120.619L191.666 120.641L192.324 119.888ZM192.324 108.928L193.031 109.635V109.635L192.324 108.928ZM196.228 108.928L195.521 109.635V109.635L196.228 108.928ZM196.356 112.512H195.356V113.512H196.356V112.512ZM199.556 112.512V113.512H200.556V112.512H199.556ZM199.684 108.928L200.391 109.635V109.635L199.684 108.928ZM203.284 108.8V109.8C203.219 109.8 203.14 109.787 203.06 109.754C202.98 109.72 202.921 109.675 202.881 109.635L203.588 108.928L204.295 108.221C204.028 107.954 203.675 107.8 203.284 107.8V108.8ZM203.588 108.928L202.881 109.635C202.841 109.595 202.796 109.536 202.763 109.456C202.729 109.376 202.716 109.298 202.716 109.232H203.716H204.716C204.716 108.841 204.562 108.488 204.295 108.221L203.588 108.928ZM203.716 109.232H202.716V119.568H203.716H204.716V109.232H203.716ZM203.716 119.568H202.716C202.716 119.502 202.729 119.424 202.763 119.344C202.796 119.264 202.841 119.205 202.881 119.165L203.588 119.872L204.295 120.579C204.562 120.312 204.716 119.959 204.716 119.568H203.716ZM203.588 119.872L202.881 119.165C202.921 119.125 202.98 119.08 203.06 119.046C203.14 119.013 203.219 119 203.284 119V120V121C203.675 121 204.028 120.846 204.295 120.579L203.588 119.872ZM203.284 120V119H199.988V120V121H203.284V120ZM199.988 120V119C200.054 119 200.132 119.013 200.212 119.046C200.292 119.08 200.352 119.125 200.391 119.165L199.684 119.872L198.977 120.579C199.244 120.846 199.597 121 199.988 121V120ZM199.684 119.872L200.391 119.165C200.431 119.205 200.476 119.264 200.51 119.344C200.544 119.424 200.556 119.502 200.556 119.568H199.556H198.556C198.556 119.959 198.71 120.312 198.977 120.579L199.684 119.872ZM199.556 119.568H200.556V116.16H199.556H198.556V119.568H199.556ZM199.556 116.16V115.16H196.356V116.16V117.16H199.556V116.16ZM196.356 116.16H195.356V119.568H196.356H197.356V116.16H196.356ZM196.356 119.568H195.356C195.356 119.502 195.369 119.424 195.403 119.344C195.436 119.264 195.481 119.205 195.521 119.165L196.228 119.872L196.935 120.579C197.202 120.312 197.356 119.959 197.356 119.568H196.356ZM196.228 119.872L195.521 119.165C195.561 119.125 195.62 119.08 195.7 119.046C195.78 119.013 195.859 119 195.924 119V120V121C196.315 121 196.668 120.846 196.935 120.579L196.228 119.872ZM195.924 120V119H192.628V120V121H195.924V120ZM192.628 120V119C192.677 119 192.741 119.008 192.81 119.034C192.88 119.059 192.938 119.096 192.983 119.135L192.324 119.888L191.666 120.641C191.94 120.881 192.278 121 192.628 121V120ZM192.324 119.888L193.031 119.181C193.08 119.229 193.125 119.294 193.157 119.373C193.188 119.45 193.196 119.519 193.196 119.568H192.196H191.196C191.196 119.943 191.332 120.31 191.617 120.595L192.324 119.888ZM192.196 119.568H193.196V109.232H192.196H191.196V119.568H192.196ZM192.196 109.232H193.196C193.196 109.298 193.184 109.376 193.15 109.456C193.116 109.536 193.071 109.595 193.031 109.635L192.324 108.928L191.617 108.221C191.35 108.488 191.196 108.841 191.196 109.232H192.196ZM192.324 108.928L193.031 109.635C192.992 109.675 192.932 109.72 192.852 109.754C192.772 109.787 192.694 109.8 192.628 109.8V108.8V107.8C192.237 107.8 191.884 107.954 191.617 108.221L192.324 108.928ZM192.628 108.8V109.8H195.924V108.8V107.8H192.628V108.8ZM195.924 108.8V109.8C195.859 109.8 195.78 109.787 195.7 109.754C195.62 109.72 195.561 109.675 195.521 109.635L196.228 108.928L196.935 108.221C196.668 107.954 196.315 107.8 195.924 107.8V108.8ZM196.228 108.928L195.521 109.635C195.481 109.595 195.436 109.536 195.403 109.456C195.369 109.376 195.356 109.298 195.356 109.232H196.356H197.356C197.356 108.841 197.202 108.488 196.935 108.221L196.228 108.928ZM196.356 109.232H195.356V112.512H196.356H197.356V109.232H196.356ZM196.356 112.512V113.512H199.556V112.512V111.512H196.356V112.512ZM199.556 112.512H200.556V109.232H199.556H198.556V112.512H199.556ZM199.556 109.232H200.556C200.556 109.298 200.544 109.376 200.51 109.456C200.476 109.536 200.431 109.595 200.391 109.635L199.684 108.928L198.977 108.221C198.71 108.488 198.556 108.841 198.556 109.232H199.556ZM199.684 108.928L200.391 109.635C200.352 109.675 200.292 109.72 200.212 109.754C200.132 109.787 200.054 109.8 199.988 109.8V108.8V107.8C199.597 107.8 199.244 107.954 198.977 108.221L199.684 108.928ZM199.988 108.8V109.8H203.284V108.8V107.8H199.988V108.8ZM217.038 117.008L216.331 117.715V117.715L217.038 117.008ZM217.038 119.872L216.331 119.165V119.165L217.038 119.872ZM216.878 108.928L216.171 109.635V109.635L216.878 108.928ZM216.878 111.792L216.171 111.085V111.085L216.878 111.792ZM210.35 111.92V110.92H209.35V111.92H210.35ZM210.35 112.928H209.35V113.928H210.35V112.928ZM215.998 113.056L215.291 113.763V113.763L215.998 113.056ZM215.998 115.744L215.291 115.037V115.037L215.998 115.744ZM210.35 115.872V114.872H209.35V115.872H210.35ZM210.35 116.88H209.35V117.88H210.35V116.88ZM216.734 116.88V117.88C216.668 117.88 216.59 117.867 216.51 117.834C216.43 117.8 216.371 117.755 216.331 117.715L217.038 117.008L217.745 116.301C217.478 116.034 217.125 115.88 216.734 115.88V116.88ZM217.038 117.008L216.331 117.715C216.291 117.675 216.246 117.616 216.212 117.536C216.179 117.456 216.166 117.378 216.166 117.312H217.166H218.166C218.166 116.921 218.012 116.568 217.745 116.301L217.038 117.008ZM217.166 117.312H216.166V119.568H217.166H218.166V117.312H217.166ZM217.166 119.568H216.166C216.166 119.502 216.179 119.424 216.212 119.344C216.246 119.264 216.291 119.205 216.331 119.165L217.038 119.872L217.745 120.579C218.012 120.312 218.166 119.959 218.166 119.568H217.166ZM217.038 119.872L216.331 119.165C216.371 119.125 216.43 119.08 216.51 119.046C216.59 119.013 216.668 119 216.734 119V120V121C217.125 121 217.478 120.846 217.745 120.579L217.038 119.872ZM216.734 120V119H206.622V120V121H216.734V120ZM206.622 120V119C206.688 119 206.766 119.013 206.846 119.046C206.926 119.08 206.985 119.125 207.025 119.165L206.318 119.872L205.611 120.579C205.878 120.846 206.231 121 206.622 121V120ZM206.318 119.872L207.025 119.165C207.065 119.205 207.11 119.264 207.144 119.344C207.177 119.424 207.19 119.502 207.19 119.568H206.19H205.19C205.19 119.959 205.344 120.312 205.611 120.579L206.318 119.872ZM206.19 119.568H207.19V109.232H206.19H205.19V119.568H206.19ZM206.19 109.232H207.19C207.19 109.298 207.177 109.376 207.144 109.456C207.11 109.536 207.065 109.595 207.025 109.635L206.318 108.928L205.611 108.221C205.344 108.488 205.19 108.841 205.19 109.232H206.19ZM206.318 108.928L207.025 109.635C206.985 109.675 206.926 109.72 206.846 109.754C206.766 109.787 206.688 109.8 206.622 109.8V108.8V107.8C206.231 107.8 205.878 107.954 205.611 108.221L206.318 108.928ZM206.622 108.8V109.8H216.574V108.8V107.8H206.622V108.8ZM216.574 108.8V109.8C216.508 109.8 216.43 109.787 216.35 109.754C216.27 109.72 216.211 109.675 216.171 109.635L216.878 108.928L217.585 108.221C217.318 107.954 216.965 107.8 216.574 107.8V108.8ZM216.878 108.928L216.171 109.635C216.131 109.595 216.086 109.536 216.052 109.456C216.019 109.376 216.006 109.298 216.006 109.232H217.006H218.006C218.006 108.841 217.852 108.488 217.585 108.221L216.878 108.928ZM217.006 109.232H216.006V111.488H217.006H218.006V109.232H217.006ZM217.006 111.488H216.006C216.006 111.422 216.019 111.344 216.052 111.264C216.086 111.184 216.131 111.125 216.171 111.085L216.878 111.792L217.585 112.499C217.852 112.232 218.006 111.879 218.006 111.488H217.006ZM216.878 111.792L216.171 111.085C216.211 111.045 216.27 111 216.35 110.966C216.43 110.933 216.508 110.92 216.574 110.92V111.92V112.92C216.965 112.92 217.318 112.766 217.585 112.499L216.878 111.792ZM216.574 111.92V110.92H210.35V111.92V112.92H216.574V111.92ZM210.35 111.92H209.35V112.928H210.35H211.35V111.92H210.35ZM210.35 112.928V113.928H215.694V112.928V111.928H210.35V112.928ZM215.694 112.928V113.928C215.628 113.928 215.55 113.915 215.47 113.882C215.39 113.848 215.331 113.803 215.291 113.763L215.998 113.056L216.705 112.349C216.438 112.082 216.085 111.928 215.694 111.928V112.928ZM215.998 113.056L215.291 113.763C215.251 113.723 215.206 113.664 215.172 113.584C215.139 113.504 215.126 113.426 215.126 113.36H216.126H217.126C217.126 112.969 216.972 112.616 216.705 112.349L215.998 113.056ZM216.126 113.36H215.126V115.44H216.126H217.126V113.36H216.126ZM216.126 115.44H215.126C215.126 115.374 215.139 115.296 215.172 115.216C215.206 115.136 215.251 115.077 215.291 115.037L215.998 115.744L216.705 116.451C216.972 116.184 217.126 115.831 217.126 115.44H216.126ZM215.998 115.744L215.291 115.037C215.331 114.997 215.39 114.952 215.47 114.918C215.55 114.885 215.628 114.872 215.694 114.872V115.872V116.872C216.085 116.872 216.438 116.718 216.705 116.451L215.998 115.744ZM215.694 115.872V114.872H210.35V115.872V116.872H215.694V115.872ZM210.35 115.872H209.35V116.88H210.35H211.35V115.872H210.35ZM210.35 116.88V117.88H216.734V116.88V115.88H210.35V116.88ZM240.818 112.24V111.24H239.818V112.24H240.818ZM240.689 119.872L241.397 120.579V120.579L240.689 119.872ZM236.786 119.872L236.078 120.579V120.579L236.786 119.872ZM236.658 112.24H237.658V111.24H236.658V112.24ZM244.258 108.8V109.8C244.192 109.8 244.114 109.787 244.033 109.754C243.954 109.72 243.894 109.675 243.854 109.635L244.561 108.928L245.269 108.221C245.002 107.954 244.648 107.8 244.258 107.8V108.8ZM244.561 108.928L243.854 109.635C243.815 109.595 243.769 109.536 243.736 109.456C243.702 109.376 243.689 109.298 243.689 109.232H244.689H245.689C245.689 108.841 245.535 108.488 245.269 108.221L244.561 108.928ZM244.689 109.232H243.689V111.808H244.689H245.689V109.232H244.689ZM244.689 111.808H243.689C243.689 111.742 243.702 111.664 243.736 111.584C243.769 111.504 243.815 111.445 243.854 111.405L244.561 112.112L245.269 112.819C245.535 112.552 245.689 112.199 245.689 111.808H244.689ZM244.561 112.112L243.854 111.405C243.894 111.365 243.954 111.32 244.033 111.286C244.114 111.253 244.192 111.24 244.258 111.24V112.24V113.24C244.648 113.24 245.002 113.086 245.269 112.819L244.561 112.112ZM244.258 112.24V111.24H240.818V112.24V113.24H244.258V112.24ZM240.818 112.24H239.818V119.568H240.818H241.818V112.24H240.818ZM240.818 119.568H239.818C239.818 119.502 239.83 119.424 239.864 119.344C239.897 119.264 239.943 119.205 239.982 119.165L240.689 119.872L241.397 120.579C241.663 120.312 241.818 119.959 241.818 119.568H240.818ZM240.689 119.872L239.982 119.165C240.022 119.125 240.082 119.08 240.161 119.046C240.242 119.013 240.32 119 240.385 119V120V121C240.776 121 241.13 120.846 241.397 120.579L240.689 119.872ZM240.385 120V119H237.09V120V121H240.385V120ZM237.09 120V119C237.155 119 237.233 119.013 237.314 119.046C237.393 119.08 237.453 119.125 237.493 119.165L236.786 119.872L236.078 120.579C236.345 120.846 236.699 121 237.09 121V120ZM236.786 119.872L237.493 119.165C237.532 119.205 237.578 119.264 237.611 119.344C237.645 119.424 237.658 119.502 237.658 119.568H236.658H235.658C235.658 119.959 235.812 120.312 236.078 120.579L236.786 119.872ZM236.658 119.568H237.658V112.24H236.658H235.658V119.568H236.658ZM236.658 112.24V111.24H233.217V112.24V113.24H236.658V112.24ZM233.217 112.24V111.24C233.283 111.24 233.361 111.253 233.442 111.286C233.521 111.32 233.581 111.365 233.621 111.405L232.913 112.112L232.206 112.819C232.473 113.086 232.827 113.24 233.217 113.24V112.24ZM232.913 112.112L233.621 111.405C233.66 111.445 233.706 111.504 233.739 111.584C233.773 111.664 233.786 111.742 233.786 111.808H232.786H231.786C231.786 112.199 231.94 112.552 232.206 112.819L232.913 112.112ZM232.786 111.808H233.786V109.232H232.786H231.786V111.808H232.786ZM232.786 109.232H233.786C233.786 109.298 233.773 109.376 233.739 109.456C233.706 109.536 233.66 109.595 233.621 109.635L232.913 108.928L232.206 108.221C231.94 108.488 231.786 108.841 231.786 109.232H232.786ZM232.913 108.928L233.621 109.635C233.581 109.675 233.521 109.72 233.442 109.754C233.361 109.787 233.283 109.8 233.217 109.8V108.8V107.8C232.827 107.8 232.473 107.954 232.206 108.221L232.913 108.928ZM233.217 108.8V109.8H244.258V108.8V107.8H233.217V108.8ZM254.507 116.72H253.507V117.72H254.507V116.72ZM250.187 116.72V117.72H251.187V116.72H250.187ZM250.187 112.08H251.187V111.08H250.187V112.08ZM246.955 111.952L246.248 112.659V112.659L246.955 111.952ZM257.707 111.952L258.414 112.659V112.659L257.707 111.952ZM254.507 112.08V111.08H253.507V112.08H254.507ZM254.507 116.72V117.72H257.403V116.72V115.72H254.507V116.72ZM257.403 116.72V117.72C257.338 117.72 257.259 117.707 257.179 117.674C257.099 117.64 257.04 117.595 257 117.555L257.707 116.848L258.414 116.141C258.147 115.874 257.794 115.72 257.403 115.72V116.72ZM257.707 116.848L257 117.555C256.96 117.515 256.915 117.456 256.882 117.376C256.848 117.296 256.835 117.218 256.835 117.152H257.835H258.835C258.835 116.761 258.681 116.408 258.414 116.141L257.707 116.848ZM257.835 117.152H256.835V119.568H257.835H258.835V117.152H257.835ZM257.835 119.568H256.835C256.835 119.502 256.848 119.424 256.882 119.344C256.915 119.264 256.96 119.205 257 119.165L257.707 119.872L258.414 120.579C258.681 120.312 258.835 119.959 258.835 119.568H257.835ZM257.707 119.872L257 119.165C257.04 119.125 257.099 119.08 257.179 119.046C257.259 119.013 257.338 119 257.403 119V120V121C257.794 121 258.147 120.846 258.414 120.579L257.707 119.872ZM257.403 120V119H247.259V120V121H257.403V120ZM247.259 120V119C247.325 119 247.403 119.013 247.483 119.046C247.563 119.08 247.623 119.125 247.662 119.165L246.955 119.872L246.248 120.579C246.515 120.846 246.868 121 247.259 121V120ZM246.955 119.872L247.662 119.165C247.702 119.205 247.747 119.264 247.781 119.344C247.815 119.424 247.827 119.502 247.827 119.568H246.827H245.827C245.827 119.959 245.981 120.312 246.248 120.579L246.955 119.872ZM246.827 119.568H247.827V117.152H246.827H245.827V119.568H246.827ZM246.827 117.152H247.827C247.827 117.218 247.815 117.296 247.781 117.376C247.747 117.456 247.702 117.515 247.662 117.555L246.955 116.848L246.248 116.141C245.981 116.408 245.827 116.761 245.827 117.152H246.827ZM246.955 116.848L247.662 117.555C247.623 117.595 247.563 117.64 247.483 117.674C247.403 117.707 247.325 117.72 247.259 117.72V116.72V115.72C246.868 115.72 246.515 115.874 246.248 116.141L246.955 116.848ZM247.259 116.72V117.72H250.187V116.72V115.72H247.259V116.72ZM250.187 116.72H251.187V112.08H250.187H249.187V116.72H250.187ZM250.187 112.08V111.08H247.259V112.08V113.08H250.187V112.08ZM247.259 112.08V111.08C247.325 111.08 247.403 111.093 247.483 111.126C247.563 111.16 247.623 111.205 247.662 111.245L246.955 111.952L246.248 112.659C246.515 112.926 246.868 113.08 247.259 113.08V112.08ZM246.955 111.952L247.662 111.245C247.702 111.285 247.747 111.344 247.781 111.424C247.815 111.504 247.827 111.582 247.827 111.648H246.827H245.827C245.827 112.039 245.981 112.392 246.248 112.659L246.955 111.952ZM246.827 111.648H247.827V109.232H246.827H245.827V111.648H246.827ZM246.827 109.232H247.827C247.827 109.298 247.815 109.376 247.781 109.456C247.747 109.536 247.702 109.595 247.662 109.635L246.955 108.928L246.248 108.221C245.981 108.488 245.827 108.841 245.827 109.232H246.827ZM246.955 108.928L247.662 109.635C247.623 109.675 247.563 109.72 247.483 109.754C247.403 109.787 247.325 109.8 247.259 109.8V108.8V107.8C246.868 107.8 246.515 107.954 246.248 108.221L246.955 108.928ZM247.259 108.8V109.8H257.403V108.8V107.8H247.259V108.8ZM257.403 108.8V109.8C257.338 109.8 257.259 109.787 257.179 109.754C257.099 109.72 257.04 109.675 257 109.635L257.707 108.928L258.414 108.221C258.147 107.954 257.794 107.8 257.403 107.8V108.8ZM257.707 108.928L257 109.635C256.96 109.595 256.915 109.536 256.882 109.456C256.848 109.376 256.835 109.298 256.835 109.232H257.835H258.835C258.835 108.841 258.681 108.488 258.414 108.221L257.707 108.928ZM257.835 109.232H256.835V111.648H257.835H258.835V109.232H257.835ZM257.835 111.648H256.835C256.835 111.582 256.848 111.504 256.882 111.424C256.915 111.344 256.96 111.285 257 111.245L257.707 111.952L258.414 112.659C258.681 112.392 258.835 112.039 258.835 111.648H257.835ZM257.707 111.952L257 111.245C257.04 111.205 257.099 111.16 257.179 111.126C257.259 111.093 257.338 111.08 257.403 111.08V112.08V113.08C257.794 113.08 258.147 112.926 258.414 112.659L257.707 111.952ZM257.403 112.08V111.08H254.507V112.08V113.08H257.403V112.08ZM254.507 112.08H253.507V116.72H254.507H255.507V112.08H254.507ZM268.005 112.24V111.24H267.005V112.24H268.005ZM267.877 119.872L268.584 120.579V120.579L267.877 119.872ZM263.973 119.872L263.266 120.579V120.579L263.973 119.872ZM263.845 112.24H264.845V111.24H263.845V112.24ZM271.445 108.8V109.8C271.379 109.8 271.301 109.787 271.221 109.754C271.141 109.72 271.082 109.675 271.042 109.635L271.749 108.928L272.456 108.221C272.189 107.954 271.836 107.8 271.445 107.8V108.8ZM271.749 108.928L271.042 109.635C271.002 109.595 270.957 109.536 270.923 109.456C270.89 109.376 270.877 109.298 270.877 109.232H271.877H272.877C272.877 108.841 272.723 108.488 272.456 108.221L271.749 108.928ZM271.877 109.232H270.877V111.808H271.877H272.877V109.232H271.877ZM271.877 111.808H270.877C270.877 111.742 270.89 111.664 270.923 111.584C270.957 111.504 271.002 111.445 271.042 111.405L271.749 112.112L272.456 112.819C272.723 112.552 272.877 112.199 272.877 111.808H271.877ZM271.749 112.112L271.042 111.405C271.082 111.365 271.141 111.32 271.221 111.286C271.301 111.253 271.379 111.24 271.445 111.24V112.24V113.24C271.836 113.24 272.189 113.086 272.456 112.819L271.749 112.112ZM271.445 112.24V111.24H268.005V112.24V113.24H271.445V112.24ZM268.005 112.24H267.005V119.568H268.005H269.005V112.24H268.005ZM268.005 119.568H267.005C267.005 119.502 267.018 119.424 267.051 119.344C267.085 119.264 267.13 119.205 267.17 119.165L267.877 119.872L268.584 120.579C268.851 120.312 269.005 119.959 269.005 119.568H268.005ZM267.877 119.872L267.17 119.165C267.21 119.125 267.269 119.08 267.349 119.046C267.429 119.013 267.507 119 267.573 119V120V121C267.964 121 268.317 120.846 268.584 120.579L267.877 119.872ZM267.573 120V119H264.277V120V121H267.573V120ZM264.277 120V119C264.343 119 264.421 119.013 264.501 119.046C264.581 119.08 264.64 119.125 264.68 119.165L263.973 119.872L263.266 120.579C263.533 120.846 263.886 121 264.277 121V120ZM263.973 119.872L264.68 119.165C264.72 119.205 264.765 119.264 264.799 119.344C264.832 119.424 264.845 119.502 264.845 119.568H263.845H262.845C262.845 119.959 262.999 120.312 263.266 120.579L263.973 119.872ZM263.845 119.568H264.845V112.24H263.845H262.845V119.568H263.845ZM263.845 112.24V111.24H260.405V112.24V113.24H263.845V112.24ZM260.405 112.24V111.24C260.471 111.24 260.549 111.253 260.629 111.286C260.709 111.32 260.768 111.365 260.808 111.405L260.101 112.112L259.394 112.819C259.661 113.086 260.014 113.24 260.405 113.24V112.24ZM260.101 112.112L260.808 111.405C260.848 111.445 260.893 111.504 260.927 111.584C260.96 111.664 260.973 111.742 260.973 111.808H259.973H258.973C258.973 112.199 259.127 112.552 259.394 112.819L260.101 112.112ZM259.973 111.808H260.973V109.232H259.973H258.973V111.808H259.973ZM259.973 109.232H260.973C260.973 109.298 260.96 109.376 260.927 109.456C260.893 109.536 260.848 109.595 260.808 109.635L260.101 108.928L259.394 108.221C259.127 108.488 258.973 108.841 258.973 109.232H259.973ZM260.101 108.928L260.808 109.635C260.768 109.675 260.709 109.72 260.629 109.754C260.549 109.787 260.471 109.8 260.405 109.8V108.8V107.8C260.014 107.8 259.661 107.954 259.394 108.221L260.101 108.928ZM260.405 108.8V109.8H271.445V108.8V107.8H260.405V108.8ZM279.151 108.928L278.444 109.635V109.635L279.151 108.928ZM279.279 116.72H278.279V117.72H279.279V116.72ZM284.735 116.72V117.72C284.669 117.72 284.591 117.707 284.511 117.674C284.431 117.64 284.371 117.595 284.332 117.555L285.039 116.848L285.746 116.141C285.479 115.874 285.126 115.72 284.735 115.72V116.72ZM285.039 116.848L284.332 117.555C284.292 117.515 284.247 117.456 284.213 117.376C284.179 117.296 284.167 117.218 284.167 117.152H285.167H286.167C286.167 116.761 286.013 116.408 285.746 116.141L285.039 116.848ZM285.167 117.152H284.167V119.568H285.167H286.167V117.152H285.167ZM285.167 119.568H284.167C284.167 119.502 284.179 119.424 284.213 119.344C284.247 119.264 284.292 119.205 284.332 119.165L285.039 119.872L285.746 120.579C286.013 120.312 286.167 119.959 286.167 119.568H285.167ZM285.039 119.872L284.332 119.165C284.371 119.125 284.431 119.08 284.511 119.046C284.591 119.013 284.669 119 284.735 119V120V121C285.126 121 285.479 120.846 285.746 120.579L285.039 119.872ZM284.735 120V119H275.391V120V121H284.735V120ZM275.391 120V119C275.456 119 275.535 119.013 275.615 119.046C275.695 119.08 275.754 119.125 275.794 119.165L275.087 119.872L274.38 120.579C274.647 120.846 275 121 275.391 121V120ZM275.087 119.872L275.794 119.165C275.834 119.205 275.879 119.264 275.912 119.344C275.946 119.424 275.959 119.502 275.959 119.568H274.959H273.959C273.959 119.959 274.113 120.312 274.38 120.579L275.087 119.872ZM274.959 119.568H275.959V109.232H274.959H273.959V119.568H274.959ZM274.959 109.232H275.959C275.959 109.298 275.946 109.376 275.912 109.456C275.879 109.536 275.834 109.595 275.794 109.635L275.087 108.928L274.38 108.221C274.113 108.488 273.959 108.841 273.959 109.232H274.959ZM275.087 108.928L275.794 109.635C275.754 109.675 275.695 109.72 275.615 109.754C275.535 109.787 275.456 109.8 275.391 109.8V108.8V107.8C275 107.8 274.647 107.954 274.38 108.221L275.087 108.928ZM275.391 108.8V109.8H278.847V108.8V107.8H275.391V108.8ZM278.847 108.8V109.8C278.781 109.8 278.703 109.787 278.623 109.754C278.543 109.72 278.483 109.675 278.444 109.635L279.151 108.928L279.858 108.221C279.591 107.954 279.238 107.8 278.847 107.8V108.8ZM279.151 108.928L278.444 109.635C278.404 109.595 278.359 109.536 278.325 109.456C278.291 109.376 278.279 109.298 278.279 109.232H279.279H280.279C280.279 108.841 280.125 108.488 279.858 108.221L279.151 108.928ZM279.279 109.232H278.279V116.72H279.279H280.279V109.232H279.279ZM279.279 116.72V117.72H284.735V116.72V115.72H279.279V116.72ZM298.6 117.008L297.893 117.715V117.715L298.6 117.008ZM298.6 119.872L297.893 119.165L297.893 119.165L298.6 119.872ZM298.441 108.928L297.733 109.635V109.635L298.441 108.928ZM298.441 111.792L297.733 111.085V111.085L298.441 111.792ZM291.913 111.92V110.92H290.913V111.92H291.913ZM291.913 112.928H290.913V113.928H291.913V112.928ZM297.561 113.056L296.853 113.763V113.763L297.561 113.056ZM297.561 115.744L296.853 115.037V115.037L297.561 115.744ZM291.913 115.872V114.872H290.913V115.872H291.913ZM291.913 116.88H290.913V117.88H291.913V116.88ZM298.296 116.88V117.88C298.231 117.88 298.153 117.867 298.072 117.834C297.993 117.8 297.933 117.755 297.893 117.715L298.6 117.008L299.308 116.301C299.041 116.034 298.687 115.88 298.296 115.88V116.88ZM298.6 117.008L297.893 117.715C297.854 117.675 297.808 117.616 297.775 117.536C297.741 117.456 297.729 117.378 297.729 117.312H298.729H299.729C299.729 116.921 299.574 116.568 299.308 116.301L298.6 117.008ZM298.729 117.312H297.729V119.568H298.729H299.729V117.312H298.729ZM298.729 119.568H297.729C297.729 119.502 297.741 119.424 297.775 119.344C297.808 119.264 297.854 119.205 297.893 119.165L298.6 119.872L299.308 120.579C299.574 120.312 299.729 119.959 299.729 119.568H298.729ZM298.6 119.872L297.893 119.165C297.933 119.125 297.993 119.08 298.072 119.046C298.153 119.013 298.231 119 298.296 119V120V121C298.687 121 299.041 120.846 299.308 120.579L298.6 119.872ZM298.296 120V119H288.184V120V121H298.296V120ZM288.184 120V119C288.25 119 288.328 119.013 288.409 119.046C288.488 119.08 288.548 119.125 288.588 119.165L287.88 119.872L287.173 120.579C287.44 120.846 287.794 121 288.184 121V120ZM287.88 119.872L288.588 119.165C288.627 119.205 288.673 119.264 288.706 119.344C288.74 119.424 288.753 119.502 288.753 119.568H287.753H286.753C286.753 119.959 286.907 120.312 287.173 120.579L287.88 119.872ZM287.753 119.568H288.753V109.232H287.753H286.753V119.568H287.753ZM287.753 109.232H288.753C288.753 109.298 288.74 109.376 288.706 109.456C288.673 109.536 288.627 109.595 288.588 109.635L287.88 108.928L287.173 108.221C286.907 108.488 286.753 108.841 286.753 109.232H287.753ZM287.88 108.928L288.588 109.635C288.548 109.675 288.488 109.72 288.409 109.754C288.328 109.787 288.25 109.8 288.184 109.8V108.8V107.8C287.794 107.8 287.44 107.954 287.173 108.221L287.88 108.928ZM288.184 108.8V109.8H298.137V108.8V107.8H288.184V108.8ZM298.137 108.8V109.8C298.071 109.8 297.993 109.787 297.912 109.754C297.833 109.72 297.773 109.675 297.733 109.635L298.441 108.928L299.148 108.221C298.881 107.954 298.527 107.8 298.137 107.8V108.8ZM298.441 108.928L297.733 109.635C297.694 109.595 297.648 109.536 297.615 109.456C297.581 109.376 297.568 109.298 297.568 109.232H298.568H299.568C299.568 108.841 299.414 108.488 299.148 108.221L298.441 108.928ZM298.568 109.232H297.568V111.488H298.568H299.568V109.232H298.568ZM298.568 111.488H297.568C297.568 111.422 297.581 111.344 297.615 111.264C297.648 111.184 297.694 111.125 297.733 111.085L298.441 111.792L299.148 112.499C299.414 112.232 299.568 111.879 299.568 111.488H298.568ZM298.441 111.792L297.733 111.085C297.773 111.045 297.833 111 297.912 110.966C297.993 110.933 298.071 110.92 298.137 110.92V111.92V112.92C298.527 112.92 298.881 112.766 299.148 112.499L298.441 111.792ZM298.137 111.92V110.92H291.913V111.92V112.92H298.137V111.92ZM291.913 111.92H290.913V112.928H291.913H292.913V111.92H291.913ZM291.913 112.928V113.928H297.257V112.928V111.928H291.913V112.928ZM297.257 112.928V113.928C297.191 113.928 297.113 113.915 297.032 113.882C296.953 113.848 296.893 113.803 296.853 113.763L297.561 113.056L298.268 112.349C298.001 112.082 297.647 111.928 297.257 111.928V112.928ZM297.561 113.056L296.853 113.763C296.814 113.723 296.768 113.664 296.735 113.584C296.701 113.504 296.689 113.426 296.689 113.36H297.689H298.689C298.689 112.969 298.534 112.616 298.268 112.349L297.561 113.056ZM297.689 113.36H296.689V115.44H297.689H298.689V113.36H297.689ZM297.689 115.44H296.689C296.689 115.374 296.701 115.296 296.735 115.216C296.768 115.136 296.814 115.077 296.853 115.037L297.561 115.744L298.268 116.451C298.534 116.184 298.689 115.831 298.689 115.44H297.689ZM297.561 115.744L296.853 115.037C296.893 114.997 296.953 114.952 297.032 114.918C297.113 114.885 297.191 114.872 297.257 114.872V115.872V116.872C297.647 116.872 298.001 116.718 298.268 116.451L297.561 115.744ZM297.257 115.872V114.872H291.913V115.872V116.872H297.257V115.872ZM291.913 115.872H290.913V116.88H291.913H292.913V115.872H291.913ZM291.913 116.88V117.88H298.296V116.88V115.88H291.913V116.88ZM309.922 109.152L309.502 110.059L309.509 110.063L309.517 110.066L309.922 109.152ZM311.698 112.704L312.587 113.163L312.593 113.151L311.698 112.704ZM311.122 113.504L310.415 112.797V112.797L311.122 113.504ZM310.242 114.32L310.867 115.101L310.887 115.085L310.905 115.069L310.242 114.32ZM309.234 115.296L310.045 115.881L310.046 115.88L309.234 115.296ZM308.93 115.68L308.223 114.973V114.973L308.93 115.68ZM304.706 115.68L303.999 116.387L304.031 116.419L304.066 116.448L304.706 115.68ZM304.626 115.344L305.575 115.66L305.578 115.652L304.626 115.344ZM305.234 114.368L304.54 113.648L304.534 113.654L304.527 113.661L305.234 114.368ZM306.37 113.456L306.942 114.276L306.95 114.271L306.958 114.265L306.37 113.456ZM307.138 112.848L307.821 113.579L307.833 113.567L307.845 113.555L307.138 112.848ZM307.218 111.952L307.958 111.279V111.279L307.218 111.952ZM306.082 111.92L306.707 112.701L306.715 112.694L306.082 111.92ZM305.794 112.32L306.689 112.767L306.694 112.757L306.699 112.746L305.794 112.32ZM305.554 112.656L304.896 111.903L304.871 111.925L304.847 111.949L305.554 112.656ZM302.066 110.576L302.881 111.156L302.886 111.148L302.066 110.576ZM303.89 109.184L303.491 108.267L303.486 108.269L303.89 109.184ZM308.706 116.56L307.999 117.267V117.267L308.706 116.56ZM308.706 119.872L307.999 119.165V119.165L308.706 119.872ZM304.85 116.56L305.557 117.267V117.267L304.85 116.56ZM306.962 108.64V109.64C308.123 109.64 308.948 109.803 309.502 110.059L309.922 109.152L310.343 108.245C309.424 107.819 308.276 107.64 306.962 107.64V108.64ZM309.922 109.152L309.517 110.066C310.169 110.355 310.499 110.647 310.652 110.882L311.49 110.336L312.328 109.79C311.884 109.108 311.169 108.611 310.327 108.238L309.922 109.152ZM311.49 110.336L310.652 110.882C310.878 111.228 310.938 111.478 310.938 111.648H311.938H312.938C312.938 110.986 312.7 110.361 312.328 109.79L311.49 110.336ZM311.938 111.648H310.938C310.938 111.888 310.889 112.086 310.804 112.257L311.698 112.704L312.593 113.151C312.827 112.682 312.938 112.176 312.938 111.648H311.938ZM311.698 112.704L310.81 112.245C310.693 112.472 310.56 112.652 310.415 112.797L311.122 113.504L311.829 114.211C312.133 113.908 312.384 113.555 312.586 113.163L311.698 112.704ZM311.122 113.504L310.415 112.797C310.222 112.99 309.946 113.247 309.579 113.571L310.242 114.32L310.905 115.069C311.285 114.732 311.596 114.445 311.829 114.211L311.122 113.504ZM310.242 114.32L309.618 113.539C309.117 113.94 308.695 114.333 308.423 114.712L309.234 115.296L310.046 115.88C310.157 115.726 310.408 115.468 310.867 115.101L310.242 114.32ZM309.234 115.296L308.424 114.711C308.359 114.799 308.309 114.867 308.27 114.915C308.228 114.969 308.214 114.982 308.223 114.973L308.93 115.68L309.637 116.387C309.765 116.259 309.909 116.069 310.045 115.881L309.234 115.296ZM308.93 115.68L308.223 114.973C308.341 114.855 308.465 114.803 308.54 114.781C308.612 114.759 308.658 114.76 308.658 114.76V115.76V116.76C308.878 116.76 309.302 116.723 309.637 116.387L308.93 115.68ZM308.658 115.76V114.76H304.914V115.76V116.76H308.658V115.76ZM304.914 115.76V114.76C304.999 114.76 305.085 114.776 305.165 114.807C305.244 114.837 305.304 114.877 305.346 114.912L304.706 115.68L304.066 116.448C304.288 116.633 304.578 116.76 304.914 116.76V115.76ZM304.706 115.68L305.413 114.973C305.45 115.009 305.501 115.071 305.542 115.161C305.585 115.255 305.61 115.361 305.61 115.472H304.61H303.61C303.61 115.866 303.79 116.178 303.999 116.387L304.706 115.68ZM304.61 115.472H305.61C305.61 115.477 305.61 115.496 305.607 115.524C305.603 115.551 305.595 115.599 305.575 115.66L304.626 115.344L303.678 115.028C303.619 115.203 303.61 115.366 303.61 115.472H304.61ZM304.626 115.344L305.578 115.652C305.643 115.45 305.757 115.259 305.941 115.075L305.234 114.368L304.527 113.661C304.135 114.053 303.844 114.513 303.675 115.036L304.626 115.344ZM305.234 114.368L305.928 115.088C306.179 114.847 306.513 114.576 306.942 114.276L306.37 113.456L305.798 112.636C305.31 112.976 304.887 113.313 304.54 113.648L305.234 114.368ZM306.37 113.456L306.958 114.265C307.318 114.003 307.614 113.772 307.821 113.579L307.138 112.848L306.456 112.117C306.342 112.223 306.127 112.397 305.782 112.647L306.37 113.456ZM307.138 112.848L307.845 113.555C308.114 113.286 308.378 112.887 308.378 112.368H307.378H306.378C306.378 112.275 306.403 112.203 306.424 112.161C306.443 112.123 306.454 112.118 306.431 112.141L307.138 112.848ZM307.378 112.368H308.378C308.378 111.962 308.234 111.583 307.958 111.279L307.218 111.952L306.478 112.625C306.454 112.598 306.426 112.557 306.405 112.503C306.384 112.449 306.378 112.401 306.378 112.368H307.378ZM307.218 111.952L307.958 111.279C307.572 110.855 307.044 110.776 306.674 110.776V111.776V112.776C306.731 112.776 306.731 112.783 306.694 112.771C306.653 112.758 306.564 112.719 306.478 112.625L307.218 111.952ZM306.674 111.776V110.776C306.335 110.776 305.842 110.824 305.449 111.146L306.082 111.92L306.715 112.694C306.67 112.731 306.629 112.754 306.601 112.766C306.574 112.779 306.557 112.783 306.555 112.784C306.552 112.784 306.561 112.782 306.582 112.78C306.603 112.778 306.633 112.776 306.674 112.776V111.776ZM306.082 111.92L305.458 111.139C305.189 111.354 305.012 111.634 304.889 111.894L305.794 112.32L306.699 112.746C306.721 112.699 306.736 112.676 306.742 112.668C306.747 112.661 306.737 112.677 306.707 112.701L306.082 111.92ZM305.794 112.32L304.9 111.873C304.891 111.891 304.883 111.905 304.877 111.916C304.87 111.926 304.866 111.932 304.865 111.935C304.863 111.937 304.864 111.935 304.869 111.93C304.873 111.925 304.882 111.915 304.896 111.903L305.554 112.656L306.213 113.409C306.431 113.218 306.581 112.983 306.689 112.767L305.794 112.32ZM305.554 112.656L304.847 111.949C304.956 111.84 305.066 111.796 305.122 111.78C305.175 111.765 305.198 111.768 305.17 111.768V112.768V113.768C305.439 113.768 305.903 113.722 306.261 113.363L305.554 112.656ZM305.17 112.768V111.768H301.874V112.768V113.768H305.17V112.768ZM301.874 112.768V111.768C301.956 111.768 302.058 111.786 302.161 111.838C302.264 111.889 302.334 111.956 302.376 112.01L301.586 112.624L300.797 113.238C301.053 113.567 301.435 113.768 301.874 113.768V112.768ZM301.586 112.624L302.376 112.01C302.406 112.049 302.433 112.097 302.451 112.152C302.469 112.206 302.474 112.254 302.474 112.288H301.474H300.474C300.474 112.626 300.578 112.957 300.797 113.238L301.586 112.624ZM301.474 112.288H302.474V112.272H301.474H300.474V112.288H301.474ZM301.474 112.272H302.474C302.474 111.94 302.584 111.573 302.881 111.156L302.066 110.576L301.251 109.996C300.759 110.689 300.474 111.452 300.474 112.272H301.474ZM302.066 110.576L302.886 111.148C303.149 110.772 303.591 110.409 304.294 110.099L303.89 109.184L303.486 108.269C302.547 108.684 301.773 109.249 301.246 110.004L302.066 110.576ZM303.89 109.184L304.29 110.101C304.961 109.808 305.84 109.64 306.962 109.64V108.64V107.64C305.653 107.64 304.484 107.834 303.491 108.267L303.89 109.184ZM308.402 116.432V117.432C308.337 117.432 308.258 117.419 308.178 117.386C308.098 117.352 308.039 117.307 307.999 117.267L308.706 116.56L309.413 115.853C309.146 115.586 308.793 115.432 308.402 115.432V116.432ZM308.706 116.56L307.999 117.267C307.959 117.227 307.914 117.168 307.881 117.088C307.847 117.008 307.834 116.93 307.834 116.864H308.834H309.834C309.834 116.473 309.68 116.12 309.413 115.853L308.706 116.56ZM308.834 116.864H307.834V119.568H308.834H309.834V116.864H308.834ZM308.834 119.568H307.834C307.834 119.502 307.847 119.424 307.881 119.344C307.914 119.264 307.959 119.205 307.999 119.165L308.706 119.872L309.413 120.579C309.68 120.312 309.834 119.959 309.834 119.568H308.834ZM308.706 119.872L307.999 119.165C308.039 119.125 308.098 119.08 308.178 119.046C308.258 119.013 308.337 119 308.402 119V120V121C308.793 121 309.146 120.846 309.413 120.579L308.706 119.872ZM308.402 120V119H305.154V120V121H308.402V120ZM305.154 120V119C305.22 119 305.298 119.013 305.378 119.046C305.458 119.08 305.518 119.125 305.557 119.165L304.85 119.872L304.143 120.579C304.41 120.846 304.763 121 305.154 121V120ZM304.85 119.872L305.557 119.165C305.597 119.205 305.642 119.264 305.676 119.344C305.71 119.424 305.722 119.502 305.722 119.568H304.722H303.722C303.722 119.959 303.876 120.312 304.143 120.579L304.85 119.872ZM304.722 119.568H305.722V116.864H304.722H303.722V119.568H304.722ZM304.722 116.864H305.722C305.722 116.93 305.71 117.008 305.676 117.088C305.642 117.168 305.597 117.227 305.557 117.267L304.85 116.56L304.143 115.853C303.876 116.12 303.722 116.473 303.722 116.864H304.722ZM304.85 116.56L305.557 117.267C305.518 117.307 305.458 117.352 305.378 117.386C305.298 117.419 305.22 117.432 305.154 117.432V116.432V115.432C304.763 115.432 304.41 115.586 304.143 115.853L304.85 116.56ZM305.154 116.432V117.432H308.402V116.432V115.432H305.154V116.432Z" fill="black" mask="url(#path-14180-outside-3_2_177825)"/>
</g>
<g filter="url(#filter2_d_2_177825)">
<rect x="23" y="203" width="356" height="99" rx="8" fill="#4946EF" shape-rendering="crispEdges"/>
<rect x="24" y="204" width="354" height="97" rx="7" stroke="#1C1D21" stroke-width="2" shape-rendering="crispEdges"/>
<path d="M44.1398 238.331L45.5 243.5L54 240L49.5 231.5L47.1803 232.392C44.8009 233.307 43.4911 235.866 44.1398 238.331Z" fill="#1B5EA7"/>
<path d="M94 236L48.5 240.5L47.2847 236.125C46.6161 233.718 48.2927 231.294 50.7806 231.07L87.5651 227.764C89.3105 227.607 90.9547 228.604 91.622 230.225L94 236Z" fill="#1781D5"/>
<path d="M55.5 236.097C53.1 235.297 53.8333 233.764 54.5 233.097C55.0168 231.897 55.5487 231.167 55.5 231C55.5 230.5 54.5 231 51.5 231C51.5 230.5 52.5 227.597 55 227.097C57.5 226.597 59.5 228 60 230C60.5 232 58.5 237.097 55.5 236.097Z" fill="#ACB7AC"/>
<path d="M69 235.102C66.6 234.302 67.3333 232.768 68 232.102C68.5168 230.902 69.0487 230.172 69 230.005C69 229.505 68 230.005 65 230.005C65 229.505 66 226.602 68.5 226.102C71 225.602 73 227.005 73.5 229.005C74 231.005 72 236.102 69 235.102Z" fill="#ACB7AC"/>
<path d="M82 234.102C79.6 233.302 80.3333 231.768 81 231.102C81.5168 229.902 82.0487 229.172 82 229.005C82 228.505 81 229 78 229C78 228.5 79 225.602 81.5 225.102C84 224.602 86 226.005 86.5 228.005C87 230.005 85 235.102 82 234.102Z" fill="#ACB7AC"/>
<path d="M103.452 268.191L104 266L48.5 240.5L45.5 243.5L53.6159 274.682C54.3992 277.692 57.3522 279.604 60.4189 279.087L98.628 272.652C100.98 272.256 102.874 270.505 103.452 268.191Z" fill="#ABADB8"/>
<path d="M103.85 264.654L94 236L48.5 240.5L56.8205 273.32C57.2044 274.834 58.6862 275.8 60.2267 275.541L101.511 268.588C103.338 268.28 104.452 266.406 103.85 264.654Z" fill="white"/>
<path d="M55.3014 256.486C55.0109 255.346 55.7634 254.202 56.9258 254.017L59.8744 253.549C60.8205 253.399 61.7402 253.941 62.0677 254.841L62.845 256.978C63.2664 258.136 62.5495 259.396 61.3384 259.626L58.1896 260.224C57.1516 260.421 56.1393 259.776 55.8786 258.753L55.3014 256.486Z" fill="#2A2A2A"/>
<path d="M58.2372 265.365C57.9467 264.225 58.6992 263.081 59.8616 262.896L62.8102 262.428C63.7563 262.278 64.676 262.819 65.0035 263.72L65.7808 265.857C66.2022 267.015 65.4853 268.275 64.2742 268.505L61.1254 269.103C60.0873 269.3 59.0751 268.655 58.8144 267.632L58.2372 265.365Z" fill="#2A2A2A"/>
<path d="M63.5906 245.634C63.3001 244.493 64.0526 243.35 65.215 243.165L68.1636 242.697C69.1097 242.546 70.0294 243.088 70.3568 243.988L71.1342 246.125C71.5556 247.284 70.8387 248.544 69.6276 248.774L66.4788 249.372C65.4407 249.569 64.4285 248.924 64.1678 247.9L63.5906 245.634Z" fill="#2A2A2A"/>
<path d="M66.5265 254.513C66.236 253.372 66.9885 252.229 68.1509 252.044L71.0995 251.576C72.0456 251.425 72.9653 251.967 73.2928 252.867L74.0701 255.004C74.4915 256.163 73.7746 257.423 72.5635 257.653L69.4147 258.25C68.3767 258.447 67.3644 257.803 67.1037 256.779L66.5265 254.513Z" fill="#ED292A"/>
<path d="M69.4623 263.392C69.1718 262.251 69.9243 261.108 71.0867 260.923L74.0353 260.455C74.9814 260.304 75.9011 260.846 76.2285 261.746L77.0059 263.883C77.4273 265.042 76.7104 266.302 75.4993 266.532L72.3505 267.129C71.3124 267.326 70.3002 266.682 70.0395 265.658L69.4623 263.392Z" fill="#2A2A2A"/>
<path d="M80.6874 261.418C80.3969 260.278 81.1494 259.134 82.3118 258.95L85.2604 258.481C86.2065 258.331 87.1262 258.873 87.4536 259.773L88.231 261.91C88.6524 263.068 87.9355 264.329 86.7244 264.558L83.5756 265.156C82.5375 265.353 81.5253 264.709 81.2646 263.685L80.6874 261.418Z" fill="#2A2A2A"/>
<path d="M74.8157 243.66C74.5252 242.52 75.2777 241.376 76.4401 241.192L79.3887 240.723C80.3348 240.573 81.2545 241.115 81.5819 242.015L82.3593 244.152C82.7807 245.31 82.0638 246.571 80.8527 246.801L77.7039 247.398C76.6658 247.595 75.6536 246.951 75.3928 245.927L74.8157 243.66Z" fill="#2A2A2A"/>
<path d="M84.9099 241.771C84.6194 240.631 85.3719 239.487 86.5344 239.302L89.483 238.834C90.429 238.684 91.3487 239.226 91.6762 240.126L92.4535 242.263C92.8749 243.421 92.158 244.681 90.9469 244.911L87.7981 245.509C86.7601 245.706 85.7478 245.061 85.4871 244.038L84.9099 241.771Z" fill="#2A2A2A"/>
<path d="M87.8457 250.65C87.5552 249.51 88.3077 248.366 89.4702 248.181L92.4188 247.713C93.3648 247.563 94.2845 248.105 94.612 249.005L95.3893 251.142C95.8107 252.3 95.0938 253.56 93.8827 253.79L90.7339 254.388C89.6959 254.585 88.6836 253.94 88.4229 252.917L87.8457 250.65Z" fill="#2A2A2A"/>
<path d="M77.7516 252.539C77.4611 251.399 78.2136 250.255 79.376 250.071L82.3246 249.602C83.2707 249.452 84.1904 249.994 84.5179 250.894L85.2952 253.031C85.7166 254.189 84.9997 255.45 83.7886 255.679L80.6398 256.277C79.6018 256.474 78.5895 255.83 78.3288 254.806L77.7516 252.539Z" fill="#2A2A2A"/>
<path d="M81.5254 225.102L81.4273 224.611L81.4273 224.611L81.5254 225.102ZM86.4863 227.862L86.0061 228.002C86.0727 228.231 86.2926 228.382 86.5308 228.36L86.4863 227.862ZM87.5908 227.764L87.6353 228.262L87.6356 228.262L87.5908 227.764ZM91.6475 230.225L92.1098 230.034L92.1098 230.034L91.6475 230.225ZM94.0254 236L94.4982 235.838C94.495 235.828 94.4915 235.819 94.4877 235.81L94.0254 236ZM103.876 264.654L104.349 264.492L104.349 264.492L103.876 264.654ZM104.017 265.996L103.52 265.935C103.493 266.153 103.612 266.364 103.814 266.453L104.017 265.996ZM104.025 266L104.51 266.123C104.57 265.887 104.451 265.642 104.228 265.543L104.025 266ZM104.005 266.081L103.52 265.958C103.516 265.974 103.513 265.99 103.511 266.005L104.005 266.081ZM103.87 266.617L103.398 266.452C103.393 266.466 103.389 266.481 103.385 266.496L103.87 266.617ZM103.478 268.19L103.963 268.312L103.963 268.312L103.478 268.19ZM98.6533 272.652L98.5703 272.159L98.5703 272.159L98.6533 272.652ZM60.4443 279.088L60.5274 279.581L60.5274 279.581L60.4443 279.088ZM53.6416 274.682L54.1255 274.556L54.1255 274.556L53.6416 274.682ZM45.5254 243.5L46.0093 243.374L46.0089 243.373L45.5254 243.5ZM44.165 238.331L43.6815 238.458L43.6815 238.458L44.165 238.331ZM47.2061 232.393L47.3855 232.859L47.3858 232.859L47.2061 232.393ZM48.9521 231.72L49.1319 232.186C49.166 232.173 49.1986 232.156 49.2291 232.136L48.9521 231.72ZM50.8066 231.07L50.8514 231.568L50.8516 231.568L50.8066 231.07ZM51.5957 230.999L51.6407 231.497C51.9072 231.473 52.1076 231.243 52.0952 230.976C52.0828 230.709 51.862 230.498 51.5944 230.499L51.5957 230.999ZM51.5254 231L51.0254 231C51.0253 231.133 51.078 231.26 51.1718 231.354C51.2655 231.447 51.3927 231.5 51.5254 231.5V231ZM55.0254 227.097L54.9273 226.606L54.9273 226.606L55.0254 227.097ZM60.0254 230L60.5105 229.879L60.5105 229.879L60.0254 230ZM60.0703 230.237L59.5753 230.308C59.6127 230.571 59.85 230.759 60.1152 230.735L60.0703 230.237ZM65.0566 229.788L65.1015 230.286C65.3187 230.267 65.4982 230.108 65.545 229.895L65.0566 229.788ZM68.5254 226.102L68.4273 225.611L68.4273 225.611L68.5254 226.102ZM73.5254 229.005L74.0105 228.884L74.0105 228.884L73.5254 229.005ZM73.5293 229.027L73.0429 229.143C73.1005 229.385 73.3267 229.548 73.5741 229.525L73.5293 229.027ZM78.0996 228.616L78.1444 229.114C78.3505 229.096 78.5239 228.952 78.5805 228.753L78.0996 228.616ZM81.5254 225.102L81.6234 225.592C83.82 225.153 85.5239 226.338 86.0061 228.002L86.4863 227.862L86.9665 227.723C86.3334 225.54 84.1109 224.075 81.4273 224.611L81.5254 225.102ZM86.4863 227.862L86.5308 228.36L87.6353 228.262L87.5908 227.764L87.5463 227.266L86.4419 227.364L86.4863 227.862ZM87.5908 227.764L87.6356 228.262C89.1626 228.124 90.6012 228.997 91.1851 230.415L91.6475 230.225L92.1098 230.034C91.3591 228.212 89.5095 227.089 87.5461 227.266L87.5908 227.764ZM91.6475 230.225L91.1851 230.415L93.563 236.19L94.0254 236L94.4877 235.81L92.1098 230.034L91.6475 230.225ZM94.0254 236L93.5526 236.163L103.403 264.817L103.876 264.654L104.349 264.492L94.4982 235.838L94.0254 236ZM103.876 264.654L103.403 264.817C103.532 265.191 103.565 265.571 103.52 265.935L104.017 265.996L104.513 266.058C104.576 265.548 104.529 265.015 104.349 264.492L103.876 264.654ZM104.017 265.996L103.814 266.453L103.822 266.457L104.025 266L104.228 265.543L104.22 265.539L104.017 265.996ZM104.025 266L103.541 265.877L103.52 265.958L104.005 266.081L104.49 266.204L104.51 266.123L104.025 266ZM104.005 266.081L103.511 266.005C103.487 266.157 103.449 266.306 103.398 266.452L103.87 266.617L104.342 266.783C104.412 266.582 104.466 266.373 104.499 266.157L104.005 266.081ZM103.87 266.617L103.385 266.496L102.992 268.069L103.478 268.19L103.963 268.312L104.355 266.738L103.87 266.617ZM103.478 268.19L102.992 268.069C102.462 270.19 100.726 271.796 98.5703 272.159L98.6533 272.652L98.7364 273.145C101.284 272.716 103.336 270.818 103.963 268.312L103.478 268.19ZM98.6533 272.652L98.5703 272.159L60.3613 278.595L60.4443 279.088L60.5274 279.581L98.7364 273.145L98.6533 272.652ZM60.4443 279.088L60.3613 278.595C57.5504 279.068 54.8435 277.315 54.1255 274.556L53.6416 274.682L53.1577 274.808C54.0063 278.068 57.2051 280.14 60.5274 279.581L60.4443 279.088ZM53.6416 274.682L54.1255 274.556L46.0093 243.374L45.5254 243.5L45.0415 243.626L53.1577 274.808L53.6416 274.682ZM45.5254 243.5L46.0089 243.373L44.6486 238.204L44.165 238.331L43.6815 238.458L45.0419 243.627L45.5254 243.5ZM44.165 238.331L44.6486 238.204C44.065 235.985 45.2442 233.683 47.3855 232.859L47.2061 232.393L47.0266 231.926C44.4096 232.933 42.9682 235.747 43.6815 238.458L44.165 238.331ZM47.2061 232.393L47.3858 232.859L49.1319 232.186L48.9521 231.72L48.7724 231.253L47.0263 231.926L47.2061 232.393ZM48.9521 231.72L49.2291 232.136C49.6947 231.826 50.2445 231.623 50.8514 231.568L50.8066 231.07L50.7619 230.572C49.9852 230.642 49.2763 230.904 48.6752 231.303L48.9521 231.72ZM50.8066 231.07L50.8516 231.568L51.6407 231.497L51.5957 230.999L51.5507 230.501L50.7617 230.572L50.8066 231.07ZM51.5957 230.999L51.5944 230.499C51.5776 230.499 51.5612 230.499 51.5506 230.5C51.5383 230.5 51.5314 230.5 51.5254 230.5V231V231.5C51.5429 231.5 51.5595 231.5 51.5707 231.499C51.5836 231.499 51.5906 231.499 51.597 231.499L51.5957 230.999ZM51.5254 231L52.0254 231C52.0254 231 52.0288 230.948 52.0582 230.831C52.0851 230.724 52.1278 230.586 52.1884 230.427C52.3096 230.107 52.4965 229.715 52.7552 229.324C53.2765 228.536 54.0523 227.801 55.1235 227.587L55.0254 227.097L54.9273 226.606C53.4988 226.892 52.5247 227.859 51.921 228.773C51.6172 229.232 51.3978 229.691 51.2533 230.072C51.1174 230.431 51.0255 230.778 51.0254 231L51.5254 231ZM55.0254 227.097L55.1234 227.587C57.3731 227.137 59.1078 228.392 59.5403 230.121L60.0254 230L60.5105 229.879C59.9428 227.609 57.6775 226.056 54.9273 226.606L55.0254 227.097ZM60.0254 230L59.5403 230.121C59.5537 230.175 59.5651 230.236 59.5753 230.308L60.0703 230.237L60.5653 230.167C60.5519 230.072 60.5345 229.975 60.5105 229.879L60.0254 230ZM60.0703 230.237L60.1152 230.735L65.1015 230.286L65.0566 229.788L65.0118 229.29L60.0254 229.739L60.0703 230.237ZM65.0566 229.788L65.545 229.895C65.6224 229.543 65.8982 228.799 66.4182 228.097C66.9351 227.398 67.6593 226.785 68.6235 226.592L68.5254 226.102L68.4273 225.611C67.1413 225.869 66.2233 226.679 65.6144 227.502C65.0087 228.32 64.6752 229.194 64.5683 229.681L65.0566 229.788ZM68.5254 226.102L68.6234 226.592C70.8732 226.142 72.6078 227.396 73.0403 229.126L73.5254 229.005L74.0105 228.884C73.4429 226.614 71.1775 225.061 68.4273 225.611L68.5254 226.102ZM73.5254 229.005L73.0403 229.126C73.0366 229.111 73.0345 229.1 73.0334 229.093C73.0329 229.09 73.0325 229.088 73.0323 229.086C73.0322 229.085 73.0321 229.084 73.0322 229.085C73.0322 229.086 73.0326 229.088 73.0329 229.091C73.0333 229.093 73.0339 229.097 73.0347 229.102C73.0362 229.111 73.0388 229.126 73.0429 229.143L73.5293 229.027L74.0157 228.912C74.0189 228.925 74.0208 228.936 74.0217 228.942C74.0222 228.944 74.0225 228.946 74.0226 228.947C74.0227 228.948 74.0228 228.948 74.0225 228.947C74.0224 228.946 74.0212 228.937 74.0196 228.928C74.0179 228.918 74.0151 228.902 74.0105 228.884L73.5254 229.005ZM73.5293 229.027L73.5741 229.525L78.1444 229.114L78.0996 228.616L78.0548 228.118L73.4845 228.529L73.5293 229.027ZM78.0996 228.616L78.5805 228.753C78.7006 228.331 79.0011 227.619 79.5133 226.971C80.0232 226.325 80.7169 225.773 81.6235 225.592L81.5254 225.102L81.4273 224.611C80.2191 224.853 79.3352 225.583 78.7286 226.351C78.1242 227.116 77.7693 227.95 77.6187 228.48L78.0996 228.616Z" fill="black"/>
<g filter="url(#filter3_d_2_177825)">
<mask id="path-14202-outside-4_2_177825" maskUnits="userSpaceOnUse" x="122" y="244.5" width="204" height="15" fill="black">
<rect fill="white" x="122" y="244.5" width="204" height="15"/>
<path d="M128.752 246.3C130.555 246.3 131.995 246.689 133.072 247.468C134.16 248.247 134.704 249.452 134.704 251.084V252.716C134.704 254.38 134.165 255.596 133.088 256.364C132.021 257.121 130.576 257.5 128.752 257.5H123.648C123.531 257.5 123.429 257.457 123.344 257.372C123.259 257.287 123.216 257.185 123.216 257.068V246.732C123.216 246.615 123.259 246.513 123.344 246.428C123.429 246.343 123.531 246.3 123.648 246.3H128.752ZM128.832 254.38C129.333 254.38 129.728 254.263 130.016 254.028C130.315 253.783 130.464 253.441 130.464 253.004V250.796C130.464 250.359 130.315 250.023 130.016 249.788C129.728 249.543 129.333 249.42 128.832 249.42H127.376V254.38H128.832ZM140.09 256.956C139.951 257.319 139.711 257.5 139.37 257.5H136.346C136.25 257.5 136.164 257.468 136.09 257.404C136.026 257.329 135.994 257.244 135.994 257.148L136.01 257.052L139.498 246.828C139.54 246.689 139.62 246.567 139.738 246.46C139.855 246.353 140.015 246.3 140.218 246.3H144.666C144.868 246.3 145.028 246.353 145.146 246.46C145.263 246.567 145.343 246.689 145.386 246.828L148.874 257.052L148.89 257.148C148.89 257.244 148.852 257.329 148.778 257.404C148.714 257.468 148.634 257.5 148.538 257.5H145.514C145.172 257.5 144.932 257.319 144.794 256.956L144.394 255.836H140.49L140.09 256.956ZM142.442 249.388L141.306 252.716H143.578L142.442 249.388ZM158.164 254.22H161.06C161.177 254.22 161.278 254.263 161.364 254.348C161.449 254.433 161.492 254.535 161.492 254.652V257.068C161.492 257.185 161.449 257.287 161.364 257.372C161.278 257.457 161.177 257.5 161.06 257.5H150.916C150.798 257.5 150.697 257.457 150.612 257.372C150.526 257.287 150.484 257.185 150.484 257.068V254.652C150.484 254.535 150.526 254.433 150.612 254.348C150.697 254.263 150.798 254.22 150.916 254.22H153.844V249.58H150.916C150.798 249.58 150.697 249.537 150.612 249.452C150.526 249.367 150.484 249.265 150.484 249.148V246.732C150.484 246.615 150.526 246.513 150.612 246.428C150.697 246.343 150.798 246.3 150.916 246.3H161.06C161.177 246.3 161.278 246.343 161.364 246.428C161.449 246.513 161.492 246.615 161.492 246.732V249.148C161.492 249.265 161.449 249.367 161.364 249.452C161.278 249.537 161.177 249.58 161.06 249.58H158.164V254.22ZM174.797 254.22C174.915 254.22 175.016 254.263 175.101 254.348C175.187 254.433 175.229 254.535 175.229 254.652V257.068C175.229 257.185 175.187 257.287 175.101 257.372C175.016 257.457 174.915 257.5 174.797 257.5H165.453C165.336 257.5 165.235 257.457 165.149 257.372C165.064 257.287 165.021 257.185 165.021 257.068V246.732C165.021 246.615 165.064 246.513 165.149 246.428C165.235 246.343 165.336 246.3 165.453 246.3H168.909C169.027 246.3 169.128 246.343 169.213 246.428C169.299 246.513 169.341 246.615 169.341 246.732V254.22H174.797ZM189.031 246.3C189.127 246.3 189.207 246.337 189.271 246.412C189.346 246.476 189.383 246.551 189.383 246.636C189.383 246.7 189.367 246.764 189.335 246.828L185.303 253.5V257.068C185.303 257.185 185.26 257.287 185.175 257.372C185.09 257.457 184.988 257.5 184.871 257.5H181.463C181.346 257.5 181.244 257.457 181.159 257.372C181.074 257.287 181.031 257.185 181.031 257.068V253.5L177.015 246.828C176.983 246.764 176.967 246.705 176.967 246.652C176.967 246.556 176.999 246.476 177.063 246.412C177.138 246.337 177.223 246.3 177.319 246.3H180.695C180.994 246.3 181.212 246.423 181.351 246.668L183.159 249.836L185.015 246.7C185.175 246.433 185.399 246.3 185.687 246.3H189.031ZM208.891 253.18C208.891 253.617 209.035 253.953 209.323 254.188C209.621 254.423 210.021 254.54 210.523 254.54C210.971 254.54 211.301 254.465 211.515 254.316C211.728 254.167 211.909 253.943 212.059 253.644C212.197 253.367 212.384 253.228 212.619 253.228H216.075C216.171 253.228 216.251 253.265 216.315 253.34C216.389 253.404 216.427 253.484 216.427 253.58C216.427 254.231 216.208 254.871 215.771 255.5C215.333 256.119 214.667 256.636 213.771 257.052C212.885 257.457 211.803 257.66 210.523 257.66C209.381 257.66 208.363 257.489 207.467 257.148C206.581 256.796 205.877 256.263 205.355 255.548C204.832 254.823 204.571 253.921 204.571 252.844V250.956C204.571 249.879 204.832 248.983 205.355 248.268C205.877 247.543 206.581 247.009 207.467 246.668C208.363 246.316 209.381 246.14 210.523 246.14C211.803 246.14 212.885 246.348 213.771 246.764C214.667 247.169 215.333 247.687 215.771 248.316C216.208 248.935 216.427 249.569 216.427 250.22C216.427 250.316 216.389 250.401 216.315 250.476C216.251 250.54 216.171 250.572 216.075 250.572H212.619C212.384 250.572 212.197 250.433 212.059 250.156C211.909 249.857 211.728 249.633 211.515 249.484C211.301 249.335 210.971 249.26 210.523 249.26C210.021 249.26 209.621 249.377 209.323 249.612C209.035 249.847 208.891 250.183 208.891 250.62V253.18ZM229.284 246.3C229.402 246.3 229.503 246.343 229.588 246.428C229.674 246.513 229.716 246.615 229.716 246.732V257.068C229.716 257.185 229.674 257.287 229.588 257.372C229.503 257.457 229.402 257.5 229.284 257.5H225.988C225.871 257.5 225.77 257.457 225.684 257.372C225.599 257.287 225.556 257.185 225.556 257.068V253.66H222.356V257.068C222.356 257.185 222.314 257.287 222.228 257.372C222.143 257.457 222.042 257.5 221.924 257.5H218.628C218.511 257.5 218.41 257.463 218.324 257.388C218.239 257.303 218.196 257.196 218.196 257.068V246.732C218.196 246.615 218.239 246.513 218.324 246.428C218.41 246.343 218.511 246.3 218.628 246.3H221.924C222.042 246.3 222.143 246.343 222.228 246.428C222.314 246.513 222.356 246.615 222.356 246.732V250.012H225.556V246.732C225.556 246.615 225.599 246.513 225.684 246.428C225.77 246.343 225.871 246.3 225.988 246.3H229.284ZM235.246 256.956C235.107 257.319 234.867 257.5 234.526 257.5H231.502C231.406 257.5 231.321 257.468 231.246 257.404C231.182 257.329 231.15 257.244 231.15 257.148L231.166 257.052L234.654 246.828C234.697 246.689 234.777 246.567 234.894 246.46C235.011 246.353 235.171 246.3 235.374 246.3H239.822C240.025 246.3 240.185 246.353 240.302 246.46C240.419 246.567 240.499 246.689 240.542 246.828L244.03 257.052L244.046 257.148C244.046 257.244 244.009 257.329 243.934 257.404C243.87 257.468 243.79 257.5 243.694 257.5H240.67C240.329 257.5 240.089 257.319 239.95 256.956L239.55 255.836H235.646L235.246 256.956ZM237.598 249.388L236.462 252.716H238.734L237.598 249.388ZM256.36 254.22C256.477 254.22 256.578 254.263 256.664 254.348C256.749 254.433 256.792 254.535 256.792 254.652V257.068C256.792 257.185 256.749 257.287 256.664 257.372C256.578 257.457 256.477 257.5 256.36 257.5H247.016C246.898 257.5 246.797 257.457 246.712 257.372C246.626 257.287 246.584 257.185 246.584 257.068V246.732C246.584 246.615 246.626 246.513 246.712 246.428C246.797 246.343 246.898 246.3 247.016 246.3H250.472C250.589 246.3 250.69 246.343 250.776 246.428C250.861 246.513 250.904 246.615 250.904 246.732V254.22H256.36ZM269.954 254.22C270.071 254.22 270.172 254.263 270.258 254.348C270.343 254.433 270.386 254.535 270.386 254.652V257.068C270.386 257.185 270.343 257.287 270.258 257.372C270.172 257.457 270.071 257.5 269.954 257.5H260.61C260.492 257.5 260.391 257.457 260.306 257.372C260.22 257.287 260.178 257.185 260.178 257.068V246.732C260.178 246.615 260.22 246.513 260.306 246.428C260.391 246.343 260.492 246.3 260.61 246.3H264.066C264.183 246.3 264.284 246.343 264.37 246.428C264.455 246.513 264.498 246.615 264.498 246.732V254.22H269.954ZM283.515 254.38C283.633 254.38 283.734 254.423 283.819 254.508C283.905 254.593 283.947 254.695 283.947 254.812V257.068C283.947 257.185 283.905 257.287 283.819 257.372C283.734 257.457 283.633 257.5 283.515 257.5H273.403C273.286 257.5 273.185 257.457 273.099 257.372C273.014 257.287 272.971 257.185 272.971 257.068V246.732C272.971 246.615 273.014 246.513 273.099 246.428C273.185 246.343 273.286 246.3 273.403 246.3H283.355C283.473 246.3 283.574 246.343 283.659 246.428C283.745 246.513 283.787 246.615 283.787 246.732V248.988C283.787 249.105 283.745 249.207 283.659 249.292C283.574 249.377 283.473 249.42 283.355 249.42H277.131V250.428H282.475C282.593 250.428 282.694 250.471 282.779 250.556C282.865 250.641 282.907 250.743 282.907 250.86V252.94C282.907 253.057 282.865 253.159 282.779 253.244C282.694 253.329 282.593 253.372 282.475 253.372H277.131V254.38H283.515ZM296.933 246.3C297.05 246.3 297.152 246.343 297.237 246.428C297.322 246.513 297.365 246.615 297.365 246.732V257.068C297.365 257.185 297.322 257.287 297.237 257.372C297.152 257.457 297.05 257.5 296.933 257.5H294.357C294.101 257.5 293.888 257.388 293.717 257.164L290.229 252.716V257.068C290.229 257.185 290.186 257.287 290.101 257.372C290.016 257.457 289.914 257.5 289.797 257.5H286.821C286.704 257.5 286.602 257.457 286.517 257.372C286.432 257.287 286.389 257.185 286.389 257.068V246.732C286.389 246.615 286.432 246.513 286.517 246.428C286.602 246.343 286.704 246.3 286.821 246.3H289.413C289.669 246.3 289.877 246.407 290.037 246.62L293.525 251.436V246.732C293.525 246.615 293.568 246.513 293.653 246.428C293.738 246.343 293.84 246.3 293.957 246.3H296.933ZM311.279 250.748C311.396 250.748 311.497 250.791 311.583 250.876C311.668 250.961 311.711 251.063 311.711 251.18V252.876C311.711 254.497 311.156 255.703 310.047 256.492C308.948 257.271 307.492 257.66 305.679 257.66C303.865 257.66 302.404 257.271 301.295 256.492C300.196 255.703 299.647 254.487 299.647 252.844V250.956C299.647 249.868 299.913 248.967 300.447 248.252C300.98 247.527 301.7 246.993 302.607 246.652C303.513 246.311 304.537 246.14 305.679 246.14C307.044 246.14 308.169 246.364 309.055 246.812C309.94 247.26 310.58 247.767 310.975 248.332C311.38 248.897 311.583 249.356 311.583 249.708C311.583 249.804 311.545 249.889 311.471 249.964C311.407 250.028 311.327 250.06 311.231 250.06H307.615C307.401 250.06 307.247 250.001 307.151 249.884C306.82 249.468 306.329 249.26 305.679 249.26C305.188 249.26 304.777 249.372 304.447 249.596C304.127 249.82 303.967 250.108 303.967 250.46V253.18C303.967 253.607 304.127 253.943 304.447 254.188C304.767 254.423 305.177 254.54 305.679 254.54C306.34 254.54 306.825 254.428 307.135 254.204C307.455 253.969 307.62 253.697 307.631 253.388H306.639C306.521 253.388 306.42 253.345 306.335 253.26C306.249 253.175 306.207 253.073 306.207 252.956V251.18C306.207 251.063 306.249 250.961 306.335 250.876C306.42 250.791 306.521 250.748 306.639 250.748H311.279ZM324.297 254.38C324.414 254.38 324.515 254.423 324.601 254.508C324.686 254.593 324.729 254.695 324.729 254.812V257.068C324.729 257.185 324.686 257.287 324.601 257.372C324.515 257.457 324.414 257.5 324.297 257.5H314.185C314.067 257.5 313.966 257.457 313.881 257.372C313.795 257.287 313.753 257.185 313.753 257.068V246.732C313.753 246.615 313.795 246.513 313.881 246.428C313.966 246.343 314.067 246.3 314.185 246.3H324.137C324.254 246.3 324.355 246.343 324.441 246.428C324.526 246.513 324.569 246.615 324.569 246.732V248.988C324.569 249.105 324.526 249.207 324.441 249.292C324.355 249.377 324.254 249.42 324.137 249.42H317.913V250.428H323.257C323.374 250.428 323.475 250.471 323.561 250.556C323.646 250.641 323.689 250.743 323.689 250.86V252.94C323.689 253.057 323.646 253.159 323.561 253.244C323.475 253.329 323.374 253.372 323.257 253.372H317.913V254.38H324.297Z"/>
</mask>
<path d="M128.752 246.3C130.555 246.3 131.995 246.689 133.072 247.468C134.16 248.247 134.704 249.452 134.704 251.084V252.716C134.704 254.38 134.165 255.596 133.088 256.364C132.021 257.121 130.576 257.5 128.752 257.5H123.648C123.531 257.5 123.429 257.457 123.344 257.372C123.259 257.287 123.216 257.185 123.216 257.068V246.732C123.216 246.615 123.259 246.513 123.344 246.428C123.429 246.343 123.531 246.3 123.648 246.3H128.752ZM128.832 254.38C129.333 254.38 129.728 254.263 130.016 254.028C130.315 253.783 130.464 253.441 130.464 253.004V250.796C130.464 250.359 130.315 250.023 130.016 249.788C129.728 249.543 129.333 249.42 128.832 249.42H127.376V254.38H128.832ZM140.09 256.956C139.951 257.319 139.711 257.5 139.37 257.5H136.346C136.25 257.5 136.164 257.468 136.09 257.404C136.026 257.329 135.994 257.244 135.994 257.148L136.01 257.052L139.498 246.828C139.54 246.689 139.62 246.567 139.738 246.46C139.855 246.353 140.015 246.3 140.218 246.3H144.666C144.868 246.3 145.028 246.353 145.146 246.46C145.263 246.567 145.343 246.689 145.386 246.828L148.874 257.052L148.89 257.148C148.89 257.244 148.852 257.329 148.778 257.404C148.714 257.468 148.634 257.5 148.538 257.5H145.514C145.172 257.5 144.932 257.319 144.794 256.956L144.394 255.836H140.49L140.09 256.956ZM142.442 249.388L141.306 252.716H143.578L142.442 249.388ZM158.164 254.22H161.06C161.177 254.22 161.278 254.263 161.364 254.348C161.449 254.433 161.492 254.535 161.492 254.652V257.068C161.492 257.185 161.449 257.287 161.364 257.372C161.278 257.457 161.177 257.5 161.06 257.5H150.916C150.798 257.5 150.697 257.457 150.612 257.372C150.526 257.287 150.484 257.185 150.484 257.068V254.652C150.484 254.535 150.526 254.433 150.612 254.348C150.697 254.263 150.798 254.22 150.916 254.22H153.844V249.58H150.916C150.798 249.58 150.697 249.537 150.612 249.452C150.526 249.367 150.484 249.265 150.484 249.148V246.732C150.484 246.615 150.526 246.513 150.612 246.428C150.697 246.343 150.798 246.3 150.916 246.3H161.06C161.177 246.3 161.278 246.343 161.364 246.428C161.449 246.513 161.492 246.615 161.492 246.732V249.148C161.492 249.265 161.449 249.367 161.364 249.452C161.278 249.537 161.177 249.58 161.06 249.58H158.164V254.22ZM174.797 254.22C174.915 254.22 175.016 254.263 175.101 254.348C175.187 254.433 175.229 254.535 175.229 254.652V257.068C175.229 257.185 175.187 257.287 175.101 257.372C175.016 257.457 174.915 257.5 174.797 257.5H165.453C165.336 257.5 165.235 257.457 165.149 257.372C165.064 257.287 165.021 257.185 165.021 257.068V246.732C165.021 246.615 165.064 246.513 165.149 246.428C165.235 246.343 165.336 246.3 165.453 246.3H168.909C169.027 246.3 169.128 246.343 169.213 246.428C169.299 246.513 169.341 246.615 169.341 246.732V254.22H174.797ZM189.031 246.3C189.127 246.3 189.207 246.337 189.271 246.412C189.346 246.476 189.383 246.551 189.383 246.636C189.383 246.7 189.367 246.764 189.335 246.828L185.303 253.5V257.068C185.303 257.185 185.26 257.287 185.175 257.372C185.09 257.457 184.988 257.5 184.871 257.5H181.463C181.346 257.5 181.244 257.457 181.159 257.372C181.074 257.287 181.031 257.185 181.031 257.068V253.5L177.015 246.828C176.983 246.764 176.967 246.705 176.967 246.652C176.967 246.556 176.999 246.476 177.063 246.412C177.138 246.337 177.223 246.3 177.319 246.3H180.695C180.994 246.3 181.212 246.423 181.351 246.668L183.159 249.836L185.015 246.7C185.175 246.433 185.399 246.3 185.687 246.3H189.031ZM208.891 253.18C208.891 253.617 209.035 253.953 209.323 254.188C209.621 254.423 210.021 254.54 210.523 254.54C210.971 254.54 211.301 254.465 211.515 254.316C211.728 254.167 211.909 253.943 212.059 253.644C212.197 253.367 212.384 253.228 212.619 253.228H216.075C216.171 253.228 216.251 253.265 216.315 253.34C216.389 253.404 216.427 253.484 216.427 253.58C216.427 254.231 216.208 254.871 215.771 255.5C215.333 256.119 214.667 256.636 213.771 257.052C212.885 257.457 211.803 257.66 210.523 257.66C209.381 257.66 208.363 257.489 207.467 257.148C206.581 256.796 205.877 256.263 205.355 255.548C204.832 254.823 204.571 253.921 204.571 252.844V250.956C204.571 249.879 204.832 248.983 205.355 248.268C205.877 247.543 206.581 247.009 207.467 246.668C208.363 246.316 209.381 246.14 210.523 246.14C211.803 246.14 212.885 246.348 213.771 246.764C214.667 247.169 215.333 247.687 215.771 248.316C216.208 248.935 216.427 249.569 216.427 250.22C216.427 250.316 216.389 250.401 216.315 250.476C216.251 250.54 216.171 250.572 216.075 250.572H212.619C212.384 250.572 212.197 250.433 212.059 250.156C211.909 249.857 211.728 249.633 211.515 249.484C211.301 249.335 210.971 249.26 210.523 249.26C210.021 249.26 209.621 249.377 209.323 249.612C209.035 249.847 208.891 250.183 208.891 250.62V253.18ZM229.284 246.3C229.402 246.3 229.503 246.343 229.588 246.428C229.674 246.513 229.716 246.615 229.716 246.732V257.068C229.716 257.185 229.674 257.287 229.588 257.372C229.503 257.457 229.402 257.5 229.284 257.5H225.988C225.871 257.5 225.77 257.457 225.684 257.372C225.599 257.287 225.556 257.185 225.556 257.068V253.66H222.356V257.068C222.356 257.185 222.314 257.287 222.228 257.372C222.143 257.457 222.042 257.5 221.924 257.5H218.628C218.511 257.5 218.41 257.463 218.324 257.388C218.239 257.303 218.196 257.196 218.196 257.068V246.732C218.196 246.615 218.239 246.513 218.324 246.428C218.41 246.343 218.511 246.3 218.628 246.3H221.924C222.042 246.3 222.143 246.343 222.228 246.428C222.314 246.513 222.356 246.615 222.356 246.732V250.012H225.556V246.732C225.556 246.615 225.599 246.513 225.684 246.428C225.77 246.343 225.871 246.3 225.988 246.3H229.284ZM235.246 256.956C235.107 257.319 234.867 257.5 234.526 257.5H231.502C231.406 257.5 231.321 257.468 231.246 257.404C231.182 257.329 231.15 257.244 231.15 257.148L231.166 257.052L234.654 246.828C234.697 246.689 234.777 246.567 234.894 246.46C235.011 246.353 235.171 246.3 235.374 246.3H239.822C240.025 246.3 240.185 246.353 240.302 246.46C240.419 246.567 240.499 246.689 240.542 246.828L244.03 257.052L244.046 257.148C244.046 257.244 244.009 257.329 243.934 257.404C243.87 257.468 243.79 257.5 243.694 257.5H240.67C240.329 257.5 240.089 257.319 239.95 256.956L239.55 255.836H235.646L235.246 256.956ZM237.598 249.388L236.462 252.716H238.734L237.598 249.388ZM256.36 254.22C256.477 254.22 256.578 254.263 256.664 254.348C256.749 254.433 256.792 254.535 256.792 254.652V257.068C256.792 257.185 256.749 257.287 256.664 257.372C256.578 257.457 256.477 257.5 256.36 257.5H247.016C246.898 257.5 246.797 257.457 246.712 257.372C246.626 257.287 246.584 257.185 246.584 257.068V246.732C246.584 246.615 246.626 246.513 246.712 246.428C246.797 246.343 246.898 246.3 247.016 246.3H250.472C250.589 246.3 250.69 246.343 250.776 246.428C250.861 246.513 250.904 246.615 250.904 246.732V254.22H256.36ZM269.954 254.22C270.071 254.22 270.172 254.263 270.258 254.348C270.343 254.433 270.386 254.535 270.386 254.652V257.068C270.386 257.185 270.343 257.287 270.258 257.372C270.172 257.457 270.071 257.5 269.954 257.5H260.61C260.492 257.5 260.391 257.457 260.306 257.372C260.22 257.287 260.178 257.185 260.178 257.068V246.732C260.178 246.615 260.22 246.513 260.306 246.428C260.391 246.343 260.492 246.3 260.61 246.3H264.066C264.183 246.3 264.284 246.343 264.37 246.428C264.455 246.513 264.498 246.615 264.498 246.732V254.22H269.954ZM283.515 254.38C283.633 254.38 283.734 254.423 283.819 254.508C283.905 254.593 283.947 254.695 283.947 254.812V257.068C283.947 257.185 283.905 257.287 283.819 257.372C283.734 257.457 283.633 257.5 283.515 257.5H273.403C273.286 257.5 273.185 257.457 273.099 257.372C273.014 257.287 272.971 257.185 272.971 257.068V246.732C272.971 246.615 273.014 246.513 273.099 246.428C273.185 246.343 273.286 246.3 273.403 246.3H283.355C283.473 246.3 283.574 246.343 283.659 246.428C283.745 246.513 283.787 246.615 283.787 246.732V248.988C283.787 249.105 283.745 249.207 283.659 249.292C283.574 249.377 283.473 249.42 283.355 249.42H277.131V250.428H282.475C282.593 250.428 282.694 250.471 282.779 250.556C282.865 250.641 282.907 250.743 282.907 250.86V252.94C282.907 253.057 282.865 253.159 282.779 253.244C282.694 253.329 282.593 253.372 282.475 253.372H277.131V254.38H283.515ZM296.933 246.3C297.05 246.3 297.152 246.343 297.237 246.428C297.322 246.513 297.365 246.615 297.365 246.732V257.068C297.365 257.185 297.322 257.287 297.237 257.372C297.152 257.457 297.05 257.5 296.933 257.5H294.357C294.101 257.5 293.888 257.388 293.717 257.164L290.229 252.716V257.068C290.229 257.185 290.186 257.287 290.101 257.372C290.016 257.457 289.914 257.5 289.797 257.5H286.821C286.704 257.5 286.602 257.457 286.517 257.372C286.432 257.287 286.389 257.185 286.389 257.068V246.732C286.389 246.615 286.432 246.513 286.517 246.428C286.602 246.343 286.704 246.3 286.821 246.3H289.413C289.669 246.3 289.877 246.407 290.037 246.62L293.525 251.436V246.732C293.525 246.615 293.568 246.513 293.653 246.428C293.738 246.343 293.84 246.3 293.957 246.3H296.933ZM311.279 250.748C311.396 250.748 311.497 250.791 311.583 250.876C311.668 250.961 311.711 251.063 311.711 251.18V252.876C311.711 254.497 311.156 255.703 310.047 256.492C308.948 257.271 307.492 257.66 305.679 257.66C303.865 257.66 302.404 257.271 301.295 256.492C300.196 255.703 299.647 254.487 299.647 252.844V250.956C299.647 249.868 299.913 248.967 300.447 248.252C300.98 247.527 301.7 246.993 302.607 246.652C303.513 246.311 304.537 246.14 305.679 246.14C307.044 246.14 308.169 246.364 309.055 246.812C309.94 247.26 310.58 247.767 310.975 248.332C311.38 248.897 311.583 249.356 311.583 249.708C311.583 249.804 311.545 249.889 311.471 249.964C311.407 250.028 311.327 250.06 311.231 250.06H307.615C307.401 250.06 307.247 250.001 307.151 249.884C306.82 249.468 306.329 249.26 305.679 249.26C305.188 249.26 304.777 249.372 304.447 249.596C304.127 249.82 303.967 250.108 303.967 250.46V253.18C303.967 253.607 304.127 253.943 304.447 254.188C304.767 254.423 305.177 254.54 305.679 254.54C306.34 254.54 306.825 254.428 307.135 254.204C307.455 253.969 307.62 253.697 307.631 253.388H306.639C306.521 253.388 306.42 253.345 306.335 253.26C306.249 253.175 306.207 253.073 306.207 252.956V251.18C306.207 251.063 306.249 250.961 306.335 250.876C306.42 250.791 306.521 250.748 306.639 250.748H311.279ZM324.297 254.38C324.414 254.38 324.515 254.423 324.601 254.508C324.686 254.593 324.729 254.695 324.729 254.812V257.068C324.729 257.185 324.686 257.287 324.601 257.372C324.515 257.457 324.414 257.5 324.297 257.5H314.185C314.067 257.5 313.966 257.457 313.881 257.372C313.795 257.287 313.753 257.185 313.753 257.068V246.732C313.753 246.615 313.795 246.513 313.881 246.428C313.966 246.343 314.067 246.3 314.185 246.3H324.137C324.254 246.3 324.355 246.343 324.441 246.428C324.526 246.513 324.569 246.615 324.569 246.732V248.988C324.569 249.105 324.526 249.207 324.441 249.292C324.355 249.377 324.254 249.42 324.137 249.42H317.913V250.428H323.257C323.374 250.428 323.475 250.471 323.561 250.556C323.646 250.641 323.689 250.743 323.689 250.86V252.94C323.689 253.057 323.646 253.159 323.561 253.244C323.475 253.329 323.374 253.372 323.257 253.372H317.913V254.38H324.297Z" fill="white"/>
<path d="M133.072 247.468L132.486 248.278L132.49 248.281L133.072 247.468ZM133.088 256.364L133.667 257.179L133.668 257.178L133.088 256.364ZM130.016 254.028L130.648 254.803L130.651 254.801L130.016 254.028ZM130.016 249.788L129.368 250.549L129.383 250.562L129.398 250.574L130.016 249.788ZM127.376 249.42V248.42H126.376V249.42H127.376ZM127.376 254.38H126.376V255.38H127.376V254.38ZM128.752 246.3V247.3C130.418 247.3 131.631 247.66 132.486 248.278L133.072 247.468L133.658 246.658C132.359 245.719 130.691 245.3 128.752 245.3V246.3ZM133.072 247.468L132.49 248.281C133.257 248.83 133.704 249.695 133.704 251.084H134.704H135.704C135.704 249.209 135.063 247.663 133.654 246.655L133.072 247.468ZM134.704 251.084H133.704V252.716H134.704H135.704V251.084H134.704ZM134.704 252.716H133.704C133.704 254.15 133.254 255.018 132.508 255.55L133.088 256.364L133.668 257.178C135.077 256.174 135.704 254.61 135.704 252.716H134.704ZM133.088 256.364L132.509 255.549C131.666 256.147 130.448 256.5 128.752 256.5V257.5V258.5C130.704 258.5 132.376 258.096 133.667 257.179L133.088 256.364ZM128.752 257.5V256.5H123.648V257.5V258.5H128.752V257.5ZM123.648 257.5V256.5C123.714 256.5 123.792 256.513 123.872 256.546C123.952 256.58 124.011 256.625 124.051 256.665L123.344 257.372L122.637 258.079C122.904 258.346 123.257 258.5 123.648 258.5V257.5ZM123.344 257.372L124.051 256.665C124.091 256.705 124.136 256.764 124.17 256.844C124.203 256.924 124.216 257.002 124.216 257.068H123.216H122.216C122.216 257.459 122.37 257.812 122.637 258.079L123.344 257.372ZM123.216 257.068H124.216V246.732H123.216H122.216V257.068H123.216ZM123.216 246.732H124.216C124.216 246.798 124.203 246.876 124.17 246.956C124.136 247.036 124.091 247.095 124.051 247.135L123.344 246.428L122.637 245.721C122.37 245.988 122.216 246.341 122.216 246.732H123.216ZM123.344 246.428L124.051 247.135C124.011 247.175 123.952 247.22 123.872 247.254C123.792 247.287 123.714 247.3 123.648 247.3V246.3V245.3C123.257 245.3 122.904 245.454 122.637 245.721L123.344 246.428ZM123.648 246.3V247.3H128.752V246.3V245.3H123.648V246.3ZM128.832 254.38V255.38C129.483 255.38 130.128 255.227 130.648 254.803L130.016 254.028L129.384 253.253C129.328 253.298 129.184 253.38 128.832 253.38V254.38ZM130.016 254.028L130.651 254.801C131.213 254.339 131.464 253.696 131.464 253.004H130.464H129.464C129.464 253.186 129.416 253.226 129.381 253.255L130.016 254.028ZM130.464 253.004H131.464V250.796H130.464H129.464V253.004H130.464ZM130.464 250.796H131.464C131.464 250.104 131.212 249.456 130.634 249.002L130.016 249.788L129.398 250.574C129.424 250.594 129.432 250.608 129.438 250.622C129.446 250.64 129.464 250.691 129.464 250.796H130.464ZM130.016 249.788L130.664 249.027C130.144 248.583 129.493 248.42 128.832 248.42V249.42V250.42C129.174 250.42 129.312 250.502 129.368 250.549L130.016 249.788ZM128.832 249.42V248.42H127.376V249.42V250.42H128.832V249.42ZM127.376 249.42H126.376V254.38H127.376H128.376V249.42H127.376ZM127.376 254.38V255.38H128.832V254.38V253.38H127.376V254.38ZM140.09 256.956L141.024 257.313L141.028 257.303L141.031 257.292L140.09 256.956ZM136.09 257.404L135.33 258.055L135.381 258.113L135.439 258.163L136.09 257.404ZM135.994 257.148L135.007 256.984L134.994 257.065V257.148H135.994ZM136.01 257.052L135.063 256.729L135.037 256.807L135.023 256.888L136.01 257.052ZM139.498 246.828L140.444 247.151L140.449 247.137L140.454 247.122L139.498 246.828ZM139.738 246.46L139.065 245.72L139.065 245.72L139.738 246.46ZM145.146 246.46L145.818 245.72V245.72L145.146 246.46ZM145.386 246.828L144.43 247.122L144.434 247.137L144.439 247.151L145.386 246.828ZM148.874 257.052L149.86 256.888L149.847 256.807L149.82 256.729L148.874 257.052ZM148.89 257.148H149.89V257.065L149.876 256.984L148.89 257.148ZM148.778 257.404L149.485 258.111L149.485 258.111L148.778 257.404ZM144.794 256.956L143.852 257.292L143.856 257.303L143.86 257.313L144.794 256.956ZM144.394 255.836L145.335 255.5L145.098 254.836H144.394V255.836ZM140.49 255.836V254.836H139.785L139.548 255.5L140.49 255.836ZM142.442 249.388L143.388 249.065L142.442 246.292L141.495 249.065L142.442 249.388ZM141.306 252.716L140.359 252.393L139.908 253.716H141.306V252.716ZM143.578 252.716V253.716H144.976L144.524 252.393L143.578 252.716ZM140.09 256.956L139.156 256.599C139.134 256.655 139.136 256.617 139.203 256.566C139.236 256.541 139.273 256.523 139.309 256.511C139.344 256.501 139.366 256.5 139.37 256.5V257.5V258.5C139.727 258.5 140.092 258.401 140.409 258.162C140.716 257.93 140.907 257.619 141.024 257.313L140.09 256.956ZM139.37 257.5V256.5H136.346V257.5V258.5H139.37V257.5ZM136.346 257.5V256.5C136.411 256.5 136.485 256.511 136.561 256.54C136.636 256.568 136.696 256.607 136.741 256.645L136.09 257.404L135.439 258.163C135.69 258.378 136.005 258.5 136.346 258.5V257.5ZM136.09 257.404L136.849 256.753C136.887 256.798 136.926 256.858 136.954 256.933C136.982 257.008 136.994 257.083 136.994 257.148H135.994H134.994C134.994 257.489 135.115 257.804 135.33 258.055L136.09 257.404ZM135.994 257.148L136.98 257.312L136.996 257.216L136.01 257.052L135.023 256.888L135.007 256.984L135.994 257.148ZM136.01 257.052L136.956 257.375L140.444 247.151L139.498 246.828L138.551 246.505L135.063 256.729L136.01 257.052ZM139.498 246.828L140.454 247.122C140.447 247.143 140.438 247.162 140.427 247.178C140.417 247.194 140.41 247.201 140.41 247.2L139.738 246.46L139.065 245.72C138.828 245.936 138.642 246.208 138.542 246.534L139.498 246.828ZM139.738 246.46L140.41 247.2C140.36 247.246 140.305 247.274 140.262 247.289C140.222 247.302 140.203 247.3 140.218 247.3V246.3V245.3C139.838 245.3 139.413 245.403 139.065 245.72L139.738 246.46ZM140.218 246.3V247.3H144.666V246.3V245.3H140.218V246.3ZM144.666 246.3V247.3C144.681 247.3 144.662 247.302 144.622 247.289C144.578 247.274 144.524 247.246 144.473 247.2L145.146 246.46L145.818 245.72C145.47 245.403 145.046 245.3 144.666 245.3V246.3ZM145.146 246.46L144.473 247.2C144.474 247.201 144.466 247.194 144.456 247.178C144.446 247.162 144.436 247.143 144.43 247.122L145.386 246.828L146.342 246.534C146.241 246.208 146.056 245.936 145.818 245.72L145.146 246.46ZM145.386 246.828L144.439 247.151L147.927 257.375L148.874 257.052L149.82 256.729L146.332 246.505L145.386 246.828ZM148.874 257.052L147.887 257.216L147.903 257.312L148.89 257.148L149.876 256.984L149.86 256.888L148.874 257.052ZM148.89 257.148H147.89C147.89 257.062 147.907 256.971 147.946 256.883C147.983 256.797 148.032 256.736 148.071 256.697L148.778 257.404L149.485 258.111C149.726 257.869 149.89 257.537 149.89 257.148H148.89ZM148.778 257.404L148.071 256.697C148.129 256.638 148.206 256.584 148.298 256.548C148.389 256.511 148.473 256.5 148.538 256.5V257.5V258.5C148.881 258.5 149.221 258.375 149.485 258.111L148.778 257.404ZM148.538 257.5V256.5H145.514V257.5V258.5H148.538V257.5ZM145.514 257.5V256.5C145.517 256.5 145.54 256.501 145.575 256.511C145.61 256.523 145.648 256.541 145.681 256.566C145.748 256.617 145.749 256.655 145.728 256.599L144.794 256.956L143.86 257.313C143.977 257.619 144.168 257.93 144.475 258.162C144.792 258.401 145.156 258.5 145.514 258.5V257.5ZM144.794 256.956L145.735 256.62L145.335 255.5L144.394 255.836L143.452 256.172L143.852 257.292L144.794 256.956ZM144.394 255.836V254.836H140.49V255.836V256.836H144.394V255.836ZM140.49 255.836L139.548 255.5L139.148 256.62L140.09 256.956L141.031 257.292L141.431 256.172L140.49 255.836ZM142.442 249.388L141.495 249.065L140.359 252.393L141.306 252.716L142.252 253.039L143.388 249.711L142.442 249.388ZM141.306 252.716V253.716H143.578V252.716V251.716H141.306V252.716ZM143.578 252.716L144.524 252.393L143.388 249.065L142.442 249.388L141.495 249.711L142.631 253.039L143.578 252.716ZM158.164 254.22H157.164V255.22H158.164V254.22ZM153.844 254.22V255.22H154.843V254.22H153.844ZM153.844 249.58H154.843V248.58H153.844V249.58ZM150.611 249.452L149.904 250.159L149.904 250.159L150.611 249.452ZM161.364 249.452L162.071 250.159V250.159L161.364 249.452ZM158.164 249.58V248.58H157.164V249.58H158.164ZM158.164 254.22V255.22H161.06V254.22V253.22H158.164V254.22ZM161.06 254.22V255.22C160.994 255.22 160.916 255.207 160.835 255.174C160.756 255.14 160.696 255.095 160.656 255.055L161.364 254.348L162.071 253.641C161.804 253.374 161.45 253.22 161.06 253.22V254.22ZM161.364 254.348L160.656 255.055C160.617 255.015 160.571 254.956 160.538 254.876C160.504 254.796 160.492 254.718 160.492 254.652H161.492H162.492C162.492 254.261 162.337 253.908 162.071 253.641L161.364 254.348ZM161.492 254.652H160.492V257.068H161.492H162.492V254.652H161.492ZM161.492 257.068H160.492C160.492 257.002 160.504 256.924 160.538 256.844C160.571 256.764 160.617 256.705 160.656 256.665L161.364 257.372L162.071 258.079C162.337 257.812 162.492 257.459 162.492 257.068H161.492ZM161.364 257.372L160.656 256.665C160.696 256.625 160.756 256.58 160.835 256.546C160.916 256.513 160.994 256.5 161.06 256.5V257.5V258.5C161.45 258.5 161.804 258.346 162.071 258.079L161.364 257.372ZM161.06 257.5V256.5H150.916V257.5V258.5H161.06V257.5ZM150.916 257.5V256.5C150.981 256.5 151.059 256.513 151.14 256.546C151.219 256.58 151.279 256.625 151.319 256.665L150.611 257.372L149.904 258.079C150.171 258.346 150.525 258.5 150.916 258.5V257.5ZM150.611 257.372L151.319 256.665C151.358 256.705 151.404 256.764 151.437 256.844C151.471 256.924 151.483 257.002 151.483 257.068H150.483H149.483C149.483 257.459 149.638 257.812 149.904 258.079L150.611 257.372ZM150.483 257.068H151.483V254.652H150.483H149.483V257.068H150.483ZM150.483 254.652H151.483C151.483 254.718 151.471 254.796 151.437 254.876C151.404 254.956 151.358 255.015 151.319 255.055L150.611 254.348L149.904 253.641C149.638 253.908 149.483 254.261 149.483 254.652H150.483ZM150.611 254.348L151.319 255.055C151.279 255.095 151.219 255.14 151.14 255.174C151.059 255.207 150.981 255.22 150.916 255.22V254.22V253.22C150.525 253.22 150.171 253.374 149.904 253.641L150.611 254.348ZM150.916 254.22V255.22H153.844V254.22V253.22H150.916V254.22ZM153.844 254.22H154.843V249.58H153.844H152.844V254.22H153.844ZM153.844 249.58V248.58H150.916V249.58V250.58H153.844V249.58ZM150.916 249.58V248.58C150.981 248.58 151.059 248.593 151.14 248.626C151.219 248.66 151.279 248.705 151.319 248.745L150.611 249.452L149.904 250.159C150.171 250.426 150.525 250.58 150.916 250.58V249.58ZM150.611 249.452L151.319 248.745C151.358 248.785 151.404 248.844 151.437 248.924C151.471 249.004 151.483 249.082 151.483 249.148H150.483H149.483C149.483 249.539 149.638 249.892 149.904 250.159L150.611 249.452ZM150.483 249.148H151.483V246.732H150.483H149.483V249.148H150.483ZM150.483 246.732H151.483C151.483 246.798 151.471 246.876 151.437 246.956C151.404 247.036 151.358 247.095 151.319 247.135L150.611 246.428L149.904 245.721C149.638 245.988 149.483 246.341 149.483 246.732H150.483ZM150.611 246.428L151.319 247.135C151.279 247.175 151.219 247.22 151.14 247.254C151.059 247.287 150.981 247.3 150.916 247.3V246.3V245.3C150.525 245.3 150.171 245.454 149.904 245.721L150.611 246.428ZM150.916 246.3V247.3H161.06V246.3V245.3H150.916V246.3ZM161.06 246.3V247.3C160.994 247.3 160.916 247.287 160.835 247.254C160.756 247.22 160.696 247.175 160.656 247.135L161.364 246.428L162.071 245.721C161.804 245.454 161.45 245.3 161.06 245.3V246.3ZM161.364 246.428L160.656 247.135C160.617 247.095 160.571 247.036 160.538 246.956C160.504 246.876 160.492 246.798 160.492 246.732H161.492H162.492C162.492 246.341 162.337 245.988 162.071 245.721L161.364 246.428ZM161.492 246.732H160.492V249.148H161.492H162.492V246.732H161.492ZM161.492 249.148H160.492C160.492 249.082 160.504 249.004 160.538 248.924C160.571 248.844 160.617 248.785 160.656 248.745L161.364 249.452L162.071 250.159C162.337 249.892 162.492 249.539 162.492 249.148H161.492ZM161.364 249.452L160.656 248.745C160.696 248.705 160.756 248.66 160.835 248.626C160.916 248.593 160.994 248.58 161.06 248.58V249.58V250.58C161.45 250.58 161.804 250.426 162.071 250.159L161.364 249.452ZM161.06 249.58V248.58H158.164V249.58V250.58H161.06V249.58ZM158.164 249.58H157.164V254.22H158.164H159.164V249.58H158.164ZM169.213 246.428L168.506 247.135V247.135L169.213 246.428ZM169.341 254.22H168.341V255.22H169.341V254.22ZM174.797 254.22V255.22C174.732 255.22 174.653 255.207 174.573 255.174C174.493 255.14 174.434 255.095 174.394 255.055L175.101 254.348L175.808 253.641C175.541 253.374 175.188 253.22 174.797 253.22V254.22ZM175.101 254.348L174.394 255.055C174.354 255.015 174.309 254.956 174.276 254.876C174.242 254.796 174.229 254.718 174.229 254.652H175.229H176.229C176.229 254.261 176.075 253.908 175.808 253.641L175.101 254.348ZM175.229 254.652H174.229V257.068H175.229H176.229V254.652H175.229ZM175.229 257.068H174.229C174.229 257.002 174.242 256.924 174.276 256.844C174.309 256.764 174.354 256.705 174.394 256.665L175.101 257.372L175.808 258.079C176.075 257.812 176.229 257.459 176.229 257.068H175.229ZM175.101 257.372L174.394 256.665C174.434 256.625 174.493 256.58 174.573 256.546C174.653 256.513 174.732 256.5 174.797 256.5V257.5V258.5C175.188 258.5 175.541 258.346 175.808 258.079L175.101 257.372ZM174.797 257.5V256.5H165.453V257.5V258.5H174.797V257.5ZM165.453 257.5V256.5C165.519 256.5 165.597 256.513 165.677 256.546C165.757 256.58 165.817 256.625 165.856 256.665L165.149 257.372L164.442 258.079C164.709 258.346 165.062 258.5 165.453 258.5V257.5ZM165.149 257.372L165.856 256.665C165.896 256.705 165.941 256.764 165.975 256.844C166.009 256.924 166.021 257.002 166.021 257.068H165.021H164.021C164.021 257.459 164.175 257.812 164.442 258.079L165.149 257.372ZM165.021 257.068H166.021V246.732H165.021H164.021V257.068H165.021ZM165.021 246.732H166.021C166.021 246.798 166.009 246.876 165.975 246.956C165.941 247.036 165.896 247.095 165.856 247.135L165.149 246.428L164.442 245.721C164.175 245.988 164.021 246.341 164.021 246.732H165.021ZM165.149 246.428L165.856 247.135C165.817 247.175 165.757 247.22 165.677 247.254C165.597 247.287 165.519 247.3 165.453 247.3V246.3V245.3C165.062 245.3 164.709 245.454 164.442 245.721L165.149 246.428ZM165.453 246.3V247.3H168.909V246.3V245.3H165.453V246.3ZM168.909 246.3V247.3C168.844 247.3 168.765 247.287 168.685 247.254C168.605 247.22 168.546 247.175 168.506 247.135L169.213 246.428L169.92 245.721C169.653 245.454 169.3 245.3 168.909 245.3V246.3ZM169.213 246.428L168.506 247.135C168.466 247.095 168.421 247.036 168.388 246.956C168.354 246.876 168.341 246.798 168.341 246.732H169.341H170.341C170.341 246.341 170.187 245.988 169.92 245.721L169.213 246.428ZM169.341 246.732H168.341V254.22H169.341H170.341V246.732H169.341ZM169.341 254.22V255.22H174.797V254.22V253.22H169.341V254.22ZM189.271 246.412L188.512 247.063L188.562 247.121L188.62 247.171L189.271 246.412ZM189.335 246.828L190.191 247.345L190.212 247.311L190.229 247.275L189.335 246.828ZM185.303 253.5L184.447 252.983L184.303 253.221V253.5H185.303ZM185.175 257.372L184.468 256.665L184.468 256.665L185.175 257.372ZM181.159 257.372L181.866 256.665V256.665L181.159 257.372ZM181.031 253.5H182.031V253.222L181.888 252.984L181.031 253.5ZM177.015 246.828L176.121 247.275L176.138 247.31L176.158 247.344L177.015 246.828ZM177.063 246.412L177.77 247.119V247.119L177.063 246.412ZM181.351 246.668L180.48 247.16L180.482 247.164L181.351 246.668ZM183.159 249.836L182.29 250.332L183.143 251.826L184.02 250.345L183.159 249.836ZM185.015 246.7L184.157 246.185L184.154 246.191L185.015 246.7ZM189.031 246.3V247.3C188.946 247.3 188.844 247.283 188.74 247.234C188.637 247.186 188.562 247.121 188.512 247.063L189.271 246.412L190.03 245.761C189.782 245.471 189.427 245.3 189.031 245.3V246.3ZM189.271 246.412L188.62 247.171C188.574 247.132 188.511 247.064 188.461 246.963C188.408 246.859 188.383 246.745 188.383 246.636H189.383H190.383C190.383 246.213 190.181 245.875 189.922 245.653L189.271 246.412ZM189.383 246.636H188.383C188.383 246.527 188.411 246.439 188.441 246.381L189.335 246.828L190.229 247.275C190.323 247.089 190.383 246.873 190.383 246.636H189.383ZM189.335 246.828L188.479 246.311L184.447 252.983L185.303 253.5L186.159 254.017L190.191 247.345L189.335 246.828ZM185.303 253.5H184.303V257.068H185.303H186.303V253.5H185.303ZM185.303 257.068H184.303C184.303 257.002 184.316 256.924 184.349 256.844C184.383 256.764 184.428 256.705 184.468 256.665L185.175 257.372L185.882 258.079C186.149 257.812 186.303 257.459 186.303 257.068H185.303ZM185.175 257.372L184.468 256.665C184.508 256.625 184.567 256.58 184.647 256.546C184.727 256.513 184.805 256.5 184.871 256.5V257.5V258.5C185.262 258.5 185.615 258.346 185.882 258.079L185.175 257.372ZM184.871 257.5V256.5H181.463V257.5V258.5H184.871V257.5ZM181.463 257.5V256.5C181.529 256.5 181.607 256.513 181.687 256.546C181.767 256.58 181.826 256.625 181.866 256.665L181.159 257.372L180.452 258.079C180.719 258.346 181.072 258.5 181.463 258.5V257.5ZM181.159 257.372L181.866 256.665C181.906 256.705 181.951 256.764 181.985 256.844C182.018 256.924 182.031 257.002 182.031 257.068H181.031H180.031C180.031 257.459 180.185 257.812 180.452 258.079L181.159 257.372ZM181.031 257.068H182.031V253.5H181.031H180.031V257.068H181.031ZM181.031 253.5L181.888 252.984L177.872 246.312L177.015 246.828L176.158 247.344L180.174 254.016L181.031 253.5ZM177.015 246.828L177.909 246.381C177.924 246.41 177.967 246.506 177.967 246.652H176.967H175.967C175.967 246.904 176.042 247.118 176.121 247.275L177.015 246.828ZM176.967 246.652H177.967C177.967 246.717 177.956 246.801 177.919 246.891C177.883 246.983 177.829 247.06 177.77 247.119L177.063 246.412L176.356 245.705C176.092 245.969 175.967 246.309 175.967 246.652H176.967ZM177.063 246.412L177.77 247.119C177.731 247.158 177.67 247.207 177.584 247.244C177.496 247.282 177.405 247.3 177.319 247.3V246.3V245.3C176.93 245.3 176.598 245.463 176.356 245.705L177.063 246.412ZM177.319 246.3V247.3H180.695V246.3V245.3H177.319V246.3ZM180.695 246.3V247.3C180.706 247.3 180.66 247.301 180.594 247.264C180.524 247.225 180.49 247.176 180.48 247.16L181.351 246.668L182.222 246.176C181.893 245.594 181.328 245.3 180.695 245.3V246.3ZM181.351 246.668L180.482 247.164L182.29 250.332L183.159 249.836L184.028 249.34L182.22 246.172L181.351 246.668ZM183.159 249.836L184.02 250.345L185.876 247.209L185.015 246.7L184.154 246.191L182.298 249.327L183.159 249.836ZM185.015 246.7L185.872 247.214C185.884 247.196 185.87 247.226 185.814 247.259C185.788 247.275 185.761 247.286 185.735 247.293C185.71 247.299 185.693 247.3 185.687 247.3V246.3V245.3C185.015 245.3 184.481 245.647 184.158 246.186L185.015 246.7ZM185.687 246.3V247.3H189.031V246.3V245.3H185.687V246.3ZM209.323 254.188L208.691 254.963L208.698 254.969L208.705 254.974L209.323 254.188ZM211.515 254.316L210.941 253.497V253.497L211.515 254.316ZM212.059 253.644L211.164 253.197V253.197L212.059 253.644ZM216.314 253.34L215.555 253.991L215.605 254.049L215.664 254.099L216.314 253.34ZM215.771 255.5L216.587 256.077L216.592 256.071L215.771 255.5ZM213.771 257.052L214.187 257.961L214.192 257.959L213.771 257.052ZM207.466 257.148L207.097 258.077L207.104 258.08L207.111 258.082L207.466 257.148ZM205.354 255.548L204.543 256.133L204.547 256.138L205.354 255.548ZM205.354 248.268L206.162 248.858L206.166 248.853L205.354 248.268ZM207.466 246.668L207.826 247.601L207.832 247.599L207.466 246.668ZM213.771 246.764L213.345 247.669L213.352 247.672L213.358 247.675L213.771 246.764ZM215.771 248.316L214.949 248.887L214.954 248.893L215.771 248.316ZM216.314 250.476L217.022 251.183V251.183L216.314 250.476ZM212.059 250.156L211.164 250.603V250.603L212.059 250.156ZM211.515 249.484L212.088 248.665V248.665L211.515 249.484ZM209.323 249.612L208.705 248.826L208.698 248.831L208.691 248.837L209.323 249.612ZM208.891 253.18H207.891C207.891 253.859 208.127 254.504 208.691 254.963L209.323 254.188L209.954 253.413C209.933 253.396 209.925 253.383 209.918 253.366C209.908 253.344 209.891 253.289 209.891 253.18H208.891ZM209.323 254.188L208.705 254.974C209.229 255.386 209.869 255.54 210.522 255.54V254.54V253.54C210.173 253.54 210.014 253.459 209.94 253.402L209.323 254.188ZM210.522 254.54V255.54C211.044 255.54 211.624 255.46 212.088 255.135L211.515 254.316L210.941 253.497C210.968 253.478 210.961 253.492 210.886 253.509C210.812 253.525 210.695 253.54 210.522 253.54V254.54ZM211.515 254.316L212.088 255.135C212.471 254.867 212.75 254.498 212.953 254.091L212.059 253.644L211.164 253.197C211.069 253.388 210.985 253.466 210.941 253.497L211.515 254.316ZM212.059 253.644L212.953 254.091C212.975 254.048 212.966 254.085 212.899 254.135C212.864 254.161 212.818 254.186 212.764 254.204C212.71 254.222 212.66 254.228 212.618 254.228V253.228V252.228C211.881 252.228 211.408 252.708 211.164 253.197L212.059 253.644ZM212.618 253.228V254.228H216.075V253.228V252.228H212.618V253.228ZM216.075 253.228V254.228C215.989 254.228 215.887 254.211 215.784 254.162C215.681 254.114 215.605 254.049 215.555 253.991L216.314 253.34L217.074 252.689C216.825 252.399 216.471 252.228 216.075 252.228V253.228ZM216.314 253.34L215.664 254.099C215.605 254.049 215.54 253.974 215.492 253.871C215.444 253.767 215.426 253.665 215.426 253.58H216.426H217.426C217.426 253.184 217.255 252.829 216.965 252.581L216.314 253.34ZM216.426 253.58H215.426C215.426 253.992 215.291 254.437 214.949 254.929L215.771 255.5L216.592 256.071C217.124 255.304 217.426 254.469 217.426 253.58H216.426ZM215.771 255.5L214.954 254.923C214.643 255.362 214.134 255.781 213.349 256.145L213.771 257.052L214.192 257.959C215.199 257.491 216.023 256.875 216.587 256.077L215.771 255.5ZM213.771 257.052L213.354 256.143C212.634 256.473 211.702 256.66 210.522 256.66V257.66V258.66C211.903 258.66 213.137 258.442 214.187 257.961L213.771 257.052ZM210.522 257.66V256.66C209.48 256.66 208.585 256.504 207.822 256.214L207.466 257.148L207.111 258.082C208.14 258.475 209.282 258.66 210.522 258.66V257.66ZM207.466 257.148L207.836 256.219C207.112 255.931 206.565 255.509 206.162 254.958L205.354 255.548L204.547 256.138C205.19 257.017 206.051 257.661 207.097 258.077L207.466 257.148ZM205.354 255.548L206.166 254.963C205.789 254.441 205.571 253.755 205.571 252.844H204.571H203.571C203.571 254.087 203.874 255.205 204.543 256.133L205.354 255.548ZM204.571 252.844H205.571V250.956H204.571H203.571V252.844H204.571ZM204.571 250.956H205.571C205.571 250.044 205.789 249.367 206.162 248.858L205.354 248.268L204.547 247.678C203.874 248.598 203.571 249.713 203.571 250.956H204.571ZM205.354 248.268L206.166 248.853C206.568 248.295 207.11 247.877 207.826 247.601L207.466 246.668L207.107 245.735C206.052 246.142 205.186 246.791 204.543 247.683L205.354 248.268ZM207.466 246.668L207.832 247.599C208.592 247.3 209.484 247.14 210.522 247.14V246.14V245.14C209.279 245.14 208.133 245.332 207.101 245.737L207.466 246.668ZM210.522 246.14V247.14C211.699 247.14 212.627 247.332 213.345 247.669L213.771 246.764L214.196 245.859C213.143 245.364 211.906 245.14 210.522 245.14V246.14ZM213.771 246.764L213.358 247.675C214.136 248.027 214.64 248.442 214.949 248.887L215.771 248.316L216.592 247.745C216.026 246.931 215.197 246.312 214.183 245.853L213.771 246.764ZM215.771 248.316L214.954 248.893C215.292 249.372 215.426 249.809 215.426 250.22H216.426H217.426C217.426 249.33 217.124 248.498 216.587 247.739L215.771 248.316ZM216.426 250.22H215.426C215.426 250.134 215.444 250.043 215.482 249.955C215.52 249.869 215.568 249.808 215.607 249.769L216.314 250.476L217.022 251.183C217.263 250.941 217.426 250.609 217.426 250.22H216.426ZM216.314 250.476L215.607 249.769C215.666 249.71 215.743 249.656 215.835 249.62C215.926 249.583 216.01 249.572 216.075 249.572V250.572V251.572C216.418 251.572 216.758 251.447 217.022 251.183L216.314 250.476ZM216.075 250.572V249.572H212.618V250.572V251.572H216.075V250.572ZM212.618 250.572V249.572C212.66 249.572 212.71 249.578 212.764 249.596C212.818 249.614 212.864 249.639 212.899 249.665C212.966 249.715 212.975 249.752 212.953 249.709L212.059 250.156L211.164 250.603C211.408 251.092 211.881 251.572 212.618 251.572V250.572ZM212.059 250.156L212.953 249.709C212.75 249.302 212.471 248.933 212.088 248.665L211.515 249.484L210.941 250.303C210.985 250.334 211.069 250.412 211.164 250.603L212.059 250.156ZM211.515 249.484L212.088 248.665C211.624 248.34 211.044 248.26 210.522 248.26V249.26V250.26C210.695 250.26 210.812 250.275 210.886 250.291C210.961 250.308 210.968 250.322 210.941 250.303L211.515 249.484ZM210.522 249.26V248.26C209.869 248.26 209.229 248.414 208.705 248.826L209.323 249.612L209.94 250.398C210.014 250.341 210.173 250.26 210.522 250.26V249.26ZM209.323 249.612L208.691 248.837C208.127 249.296 207.891 249.941 207.891 250.62H208.891H209.891C209.891 250.511 209.908 250.456 209.918 250.434C209.925 250.417 209.933 250.404 209.954 250.387L209.323 249.612ZM208.891 250.62H207.891V253.18H208.891H209.891V250.62H208.891ZM229.588 246.428L228.881 247.135V247.135L229.588 246.428ZM229.588 257.372L228.881 256.665V256.665L229.588 257.372ZM225.684 257.372L226.391 256.665V256.665L225.684 257.372ZM225.556 253.66H226.556V252.66H225.556V253.66ZM222.356 253.66V252.66H221.356V253.66H222.356ZM222.228 257.372L221.521 256.665V256.665L222.228 257.372ZM218.324 257.388L217.617 258.095L217.641 258.119L217.666 258.141L218.324 257.388ZM218.324 246.428L219.031 247.135V247.135L218.324 246.428ZM222.228 246.428L221.521 247.135V247.135L222.228 246.428ZM222.356 250.012H221.356V251.012H222.356V250.012ZM225.556 250.012V251.012H226.556V250.012H225.556ZM225.684 246.428L226.391 247.135V247.135L225.684 246.428ZM229.284 246.3V247.3C229.219 247.3 229.14 247.287 229.06 247.254C228.98 247.22 228.921 247.175 228.881 247.135L229.588 246.428L230.295 245.721C230.028 245.454 229.675 245.3 229.284 245.3V246.3ZM229.588 246.428L228.881 247.135C228.841 247.095 228.796 247.036 228.763 246.956C228.729 246.876 228.716 246.798 228.716 246.732H229.716H230.716C230.716 246.341 230.562 245.988 230.295 245.721L229.588 246.428ZM229.716 246.732H228.716V257.068H229.716H230.716V246.732H229.716ZM229.716 257.068H228.716C228.716 257.002 228.729 256.924 228.763 256.844C228.796 256.764 228.841 256.705 228.881 256.665L229.588 257.372L230.295 258.079C230.562 257.812 230.716 257.459 230.716 257.068H229.716ZM229.588 257.372L228.881 256.665C228.921 256.625 228.98 256.58 229.06 256.546C229.14 256.513 229.219 256.5 229.284 256.5V257.5V258.5C229.675 258.5 230.028 258.346 230.295 258.079L229.588 257.372ZM229.284 257.5V256.5H225.988V257.5V258.5H229.284V257.5ZM225.988 257.5V256.5C226.054 256.5 226.132 256.513 226.212 256.546C226.292 256.58 226.352 256.625 226.391 256.665L225.684 257.372L224.977 258.079C225.244 258.346 225.597 258.5 225.988 258.5V257.5ZM225.684 257.372L226.391 256.665C226.431 256.705 226.476 256.764 226.51 256.844C226.544 256.924 226.556 257.002 226.556 257.068H225.556H224.556C224.556 257.459 224.71 257.812 224.977 258.079L225.684 257.372ZM225.556 257.068H226.556V253.66H225.556H224.556V257.068H225.556ZM225.556 253.66V252.66H222.356V253.66V254.66H225.556V253.66ZM222.356 253.66H221.356V257.068H222.356H223.356V253.66H222.356ZM222.356 257.068H221.356C221.356 257.002 221.369 256.924 221.403 256.844C221.436 256.764 221.481 256.705 221.521 256.665L222.228 257.372L222.935 258.079C223.202 257.812 223.356 257.459 223.356 257.068H222.356ZM222.228 257.372L221.521 256.665C221.561 256.625 221.62 256.58 221.7 256.546C221.78 256.513 221.859 256.5 221.924 256.5V257.5V258.5C222.315 258.5 222.668 258.346 222.935 258.079L222.228 257.372ZM221.924 257.5V256.5H218.628V257.5V258.5H221.924V257.5ZM218.628 257.5V256.5C218.677 256.5 218.741 256.508 218.81 256.534C218.88 256.559 218.938 256.596 218.983 256.635L218.324 257.388L217.666 258.141C217.94 258.381 218.278 258.5 218.628 258.5V257.5ZM218.324 257.388L219.031 256.681C219.08 256.729 219.125 256.794 219.157 256.873C219.188 256.95 219.196 257.019 219.196 257.068H218.196H217.196C217.196 257.443 217.332 257.81 217.617 258.095L218.324 257.388ZM218.196 257.068H219.196V246.732H218.196H217.196V257.068H218.196ZM218.196 246.732H219.196C219.196 246.798 219.184 246.876 219.15 246.956C219.116 247.036 219.071 247.095 219.031 247.135L218.324 246.428L217.617 245.721C217.35 245.988 217.196 246.341 217.196 246.732H218.196ZM218.324 246.428L219.031 247.135C218.992 247.175 218.932 247.22 218.852 247.254C218.772 247.287 218.694 247.3 218.628 247.3V246.3V245.3C218.237 245.3 217.884 245.454 217.617 245.721L218.324 246.428ZM218.628 246.3V247.3H221.924V246.3V245.3H218.628V246.3ZM221.924 246.3V247.3C221.859 247.3 221.78 247.287 221.7 247.254C221.62 247.22 221.561 247.175 221.521 247.135L222.228 246.428L222.935 245.721C222.668 245.454 222.315 245.3 221.924 245.3V246.3ZM222.228 246.428L221.521 247.135C221.481 247.095 221.436 247.036 221.403 246.956C221.369 246.876 221.356 246.798 221.356 246.732H222.356H223.356C223.356 246.341 223.202 245.988 222.935 245.721L222.228 246.428ZM222.356 246.732H221.356V250.012H222.356H223.356V246.732H222.356ZM222.356 250.012V251.012H225.556V250.012V249.012H222.356V250.012ZM225.556 250.012H226.556V246.732H225.556H224.556V250.012H225.556ZM225.556 246.732H226.556C226.556 246.798 226.544 246.876 226.51 246.956C226.476 247.036 226.431 247.095 226.391 247.135L225.684 246.428L224.977 245.721C224.71 245.988 224.556 246.341 224.556 246.732H225.556ZM225.684 246.428L226.391 247.135C226.352 247.175 226.292 247.22 226.212 247.254C226.132 247.287 226.054 247.3 225.988 247.3V246.3V245.3C225.597 245.3 225.244 245.454 224.977 245.721L225.684 246.428ZM225.988 246.3V247.3H229.284V246.3V245.3H225.988V246.3ZM235.246 256.956L236.18 257.313L236.184 257.303L236.188 257.292L235.246 256.956ZM231.246 257.404L230.487 258.055L230.537 258.113L230.595 258.163L231.246 257.404ZM231.15 257.148L230.164 256.984L230.15 257.065V257.148H231.15ZM231.166 257.052L230.22 256.729L230.193 256.807L230.18 256.888L231.166 257.052ZM234.654 246.828L235.6 247.151L235.605 247.137L235.61 247.122L234.654 246.828ZM234.894 246.46L234.221 245.72V245.72L234.894 246.46ZM240.302 246.46L240.975 245.72V245.72L240.302 246.46ZM240.542 246.828L239.586 247.122L239.591 247.137L239.596 247.151L240.542 246.828ZM244.03 257.052L245.016 256.888L245.003 256.807L244.976 256.729L244.03 257.052ZM244.046 257.148H245.046V257.065L245.032 256.984L244.046 257.148ZM243.934 257.404L244.641 258.111L244.641 258.111L243.934 257.404ZM239.95 256.956L239.008 257.292L239.012 257.303L239.016 257.313L239.95 256.956ZM239.55 255.836L240.492 255.5L240.255 254.836H239.55V255.836ZM235.646 255.836V254.836H234.941L234.704 255.5L235.646 255.836ZM237.598 249.388L238.544 249.065L237.598 246.292L236.652 249.065L237.598 249.388ZM236.462 252.716L235.516 252.393L235.064 253.716H236.462V252.716ZM238.734 252.716V253.716H240.132L239.68 252.393L238.734 252.716ZM235.246 256.956L234.312 256.599C234.29 256.655 234.292 256.617 234.359 256.566C234.392 256.541 234.429 256.523 234.465 256.511C234.5 256.501 234.522 256.5 234.526 256.5V257.5V258.5C234.884 258.5 235.248 258.401 235.565 258.162C235.872 257.93 236.063 257.619 236.18 257.313L235.246 256.956ZM234.526 257.5V256.5H231.502V257.5V258.5H234.526V257.5ZM231.502 257.5V256.5C231.567 256.5 231.642 256.511 231.717 256.54C231.792 256.568 231.852 256.607 231.897 256.645L231.246 257.404L230.595 258.163C230.846 258.378 231.161 258.5 231.502 258.5V257.5ZM231.246 257.404L232.005 256.753C232.043 256.798 232.082 256.858 232.11 256.933C232.139 257.008 232.15 257.083 232.15 257.148H231.15H230.15C230.15 257.489 230.272 257.804 230.487 258.055L231.246 257.404ZM231.15 257.148L232.136 257.312L232.152 257.216L231.166 257.052L230.18 256.888L230.164 256.984L231.15 257.148ZM231.166 257.052L232.112 257.375L235.6 247.151L234.654 246.828L233.708 246.505L230.22 256.729L231.166 257.052ZM234.654 246.828L235.61 247.122C235.603 247.143 235.594 247.162 235.584 247.178C235.573 247.194 235.566 247.201 235.567 247.2L234.894 246.46L234.221 245.72C233.984 245.936 233.798 246.208 233.698 246.534L234.654 246.828ZM234.894 246.46L235.567 247.2C235.516 247.246 235.462 247.274 235.418 247.289C235.378 247.302 235.359 247.3 235.374 247.3V246.3V245.3C234.994 245.3 234.57 245.403 234.221 245.72L234.894 246.46ZM235.374 246.3V247.3H239.822V246.3V245.3H235.374V246.3ZM239.822 246.3V247.3C239.837 247.3 239.818 247.302 239.778 247.289C239.734 247.274 239.68 247.246 239.629 247.2L240.302 246.46L240.975 245.72C240.626 245.403 240.202 245.3 239.822 245.3V246.3ZM240.302 246.46L239.629 247.2C239.63 247.201 239.623 247.194 239.612 247.178C239.602 247.162 239.593 247.143 239.586 247.122L240.542 246.828L241.498 246.534C241.398 246.208 241.212 245.936 240.975 245.72L240.302 246.46ZM240.542 246.828L239.596 247.151L243.084 257.375L244.03 257.052L244.976 256.729L241.488 246.505L240.542 246.828ZM244.03 257.052L243.044 257.216L243.06 257.312L244.046 257.148L245.032 256.984L245.016 256.888L244.03 257.052ZM244.046 257.148H243.046C243.046 257.062 243.063 256.971 243.102 256.883C243.139 256.797 243.188 256.736 243.227 256.697L243.934 257.404L244.641 258.111C244.883 257.869 245.046 257.537 245.046 257.148H244.046ZM243.934 257.404L243.227 256.697C243.286 256.638 243.363 256.584 243.455 256.548C243.545 256.511 243.629 256.5 243.694 256.5V257.5V258.5C244.037 258.5 244.377 258.375 244.641 258.111L243.934 257.404ZM243.694 257.5V256.5H240.67V257.5V258.5H243.694V257.5ZM240.67 257.5V256.5C240.674 256.5 240.696 256.501 240.731 256.511C240.767 256.523 240.804 256.541 240.837 256.566C240.904 256.617 240.906 256.655 240.884 256.599L239.95 256.956L239.016 257.313C239.133 257.619 239.324 257.93 239.631 258.162C239.948 258.401 240.312 258.5 240.67 258.5V257.5ZM239.95 256.956L240.892 256.62L240.492 255.5L239.55 255.836L238.608 256.172L239.008 257.292L239.95 256.956ZM239.55 255.836V254.836H235.646V255.836V256.836H239.55V255.836ZM235.646 255.836L234.704 255.5L234.304 256.62L235.246 256.956L236.188 257.292L236.588 256.172L235.646 255.836ZM237.598 249.388L236.652 249.065L235.516 252.393L236.462 252.716L237.408 253.039L238.544 249.711L237.598 249.388ZM236.462 252.716V253.716H238.734V252.716V251.716H236.462V252.716ZM238.734 252.716L239.68 252.393L238.544 249.065L237.598 249.388L236.652 249.711L237.788 253.039L238.734 252.716ZM250.776 246.428L250.069 247.135V247.135L250.776 246.428ZM250.904 254.22H249.904V255.22H250.904V254.22ZM256.36 254.22V255.22C256.294 255.22 256.216 255.207 256.136 255.174C256.056 255.14 255.996 255.095 255.957 255.055L256.664 254.348L257.371 253.641C257.104 253.374 256.751 253.22 256.36 253.22V254.22ZM256.664 254.348L255.957 255.055C255.917 255.015 255.872 254.956 255.838 254.876C255.804 254.796 255.792 254.718 255.792 254.652H256.792H257.792C257.792 254.261 257.638 253.908 257.371 253.641L256.664 254.348ZM256.792 254.652H255.792V257.068H256.792H257.792V254.652H256.792ZM256.792 257.068H255.792C255.792 257.002 255.804 256.924 255.838 256.844C255.872 256.764 255.917 256.705 255.957 256.665L256.664 257.372L257.371 258.079C257.638 257.812 257.792 257.459 257.792 257.068H256.792ZM256.664 257.372L255.957 256.665C255.996 256.625 256.056 256.58 256.136 256.546C256.216 256.513 256.294 256.5 256.36 256.5V257.5V258.5C256.751 258.5 257.104 258.346 257.371 258.079L256.664 257.372ZM256.36 257.5V256.5H247.016V257.5V258.5H256.36V257.5ZM247.016 257.5V256.5C247.081 256.5 247.16 256.513 247.24 256.546C247.32 256.58 247.379 256.625 247.419 256.665L246.712 257.372L246.005 258.079C246.272 258.346 246.625 258.5 247.016 258.5V257.5ZM246.712 257.372L247.419 256.665C247.459 256.705 247.504 256.764 247.537 256.844C247.571 256.924 247.584 257.002 247.584 257.068H246.584H245.584C245.584 257.459 245.738 257.812 246.005 258.079L246.712 257.372ZM246.584 257.068H247.584V246.732H246.584H245.584V257.068H246.584ZM246.584 246.732H247.584C247.584 246.798 247.571 246.876 247.537 246.956C247.504 247.036 247.459 247.095 247.419 247.135L246.712 246.428L246.005 245.721C245.738 245.988 245.584 246.341 245.584 246.732H246.584ZM246.712 246.428L247.419 247.135C247.379 247.175 247.32 247.22 247.24 247.254C247.16 247.287 247.081 247.3 247.016 247.3V246.3V245.3C246.625 245.3 246.272 245.454 246.005 245.721L246.712 246.428ZM247.016 246.3V247.3H250.472V246.3V245.3H247.016V246.3ZM250.472 246.3V247.3C250.406 247.3 250.328 247.287 250.248 247.254C250.168 247.22 250.108 247.175 250.069 247.135L250.776 246.428L251.483 245.721C251.216 245.454 250.863 245.3 250.472 245.3V246.3ZM250.776 246.428L250.069 247.135C250.029 247.095 249.984 247.036 249.95 246.956C249.916 246.876 249.904 246.798 249.904 246.732H250.904H251.904C251.904 246.341 251.75 245.988 251.483 245.721L250.776 246.428ZM250.904 246.732H249.904V254.22H250.904H251.904V246.732H250.904ZM250.904 254.22V255.22H256.36V254.22V253.22H250.904V254.22ZM264.37 246.428L263.662 247.135V247.135L264.37 246.428ZM264.497 254.22H263.497V255.22H264.497V254.22ZM269.954 254.22V255.22C269.888 255.22 269.81 255.207 269.729 255.174C269.65 255.14 269.59 255.095 269.55 255.055L270.258 254.348L270.965 253.641C270.698 253.374 270.344 253.22 269.954 253.22V254.22ZM270.258 254.348L269.55 255.055C269.511 255.015 269.465 254.956 269.432 254.876C269.398 254.796 269.385 254.718 269.385 254.652H270.385H271.385C271.385 254.261 271.231 253.908 270.965 253.641L270.258 254.348ZM270.385 254.652H269.385V257.068H270.385H271.385V254.652H270.385ZM270.385 257.068H269.385C269.385 257.002 269.398 256.924 269.432 256.844C269.465 256.764 269.511 256.705 269.55 256.665L270.258 257.372L270.965 258.079C271.231 257.812 271.385 257.459 271.385 257.068H270.385ZM270.258 257.372L269.55 256.665C269.59 256.625 269.65 256.58 269.729 256.546C269.81 256.513 269.888 256.5 269.954 256.5V257.5V258.5C270.344 258.5 270.698 258.346 270.965 258.079L270.258 257.372ZM269.954 257.5V256.5H260.609V257.5V258.5H269.954V257.5ZM260.609 257.5V256.5C260.675 256.5 260.753 256.513 260.834 256.546C260.913 256.58 260.973 256.625 261.013 256.665L260.305 257.372L259.598 258.079C259.865 258.346 260.219 258.5 260.609 258.5V257.5ZM260.305 257.372L261.013 256.665C261.052 256.705 261.098 256.764 261.131 256.844C261.165 256.924 261.178 257.002 261.178 257.068H260.178H259.178C259.178 257.459 259.332 257.812 259.598 258.079L260.305 257.372ZM260.178 257.068H261.178V246.732H260.178H259.178V257.068H260.178ZM260.178 246.732H261.178C261.178 246.798 261.165 246.876 261.131 246.956C261.098 247.036 261.052 247.095 261.013 247.135L260.305 246.428L259.598 245.721C259.332 245.988 259.178 246.341 259.178 246.732H260.178ZM260.305 246.428L261.013 247.135C260.973 247.175 260.913 247.22 260.834 247.254C260.753 247.287 260.675 247.3 260.609 247.3V246.3V245.3C260.219 245.3 259.865 245.454 259.598 245.721L260.305 246.428ZM260.609 246.3V247.3H264.066V246.3V245.3H260.609V246.3ZM264.066 246.3V247.3C264 247.3 263.922 247.287 263.841 247.254C263.762 247.22 263.702 247.175 263.662 247.135L264.37 246.428L265.077 245.721C264.81 245.454 264.456 245.3 264.066 245.3V246.3ZM264.37 246.428L263.662 247.135C263.623 247.095 263.577 247.036 263.544 246.956C263.51 246.876 263.497 246.798 263.497 246.732H264.497H265.497C265.497 246.341 265.343 245.988 265.077 245.721L264.37 246.428ZM264.497 246.732H263.497V254.22H264.497H265.497V246.732H264.497ZM264.497 254.22V255.22H269.954V254.22V253.22H264.497V254.22ZM283.819 254.508L283.112 255.215V255.215L283.819 254.508ZM283.819 257.372L283.112 256.665L283.112 256.665L283.819 257.372ZM283.659 246.428L282.952 247.135V247.135L283.659 246.428ZM283.659 249.292L282.952 248.585V248.585L283.659 249.292ZM277.131 249.42V248.42H276.131V249.42H277.131ZM277.131 250.428H276.131V251.428H277.131V250.428ZM282.779 250.556L282.072 251.263V251.263L282.779 250.556ZM282.779 253.244L282.072 252.537V252.537L282.779 253.244ZM277.131 253.372V252.372H276.131V253.372H277.131ZM277.131 254.38H276.131V255.38H277.131V254.38ZM283.515 254.38V255.38C283.45 255.38 283.371 255.367 283.291 255.334C283.211 255.3 283.152 255.255 283.112 255.215L283.819 254.508L284.526 253.801C284.259 253.534 283.906 253.38 283.515 253.38V254.38ZM283.819 254.508L283.112 255.215C283.072 255.175 283.027 255.116 282.994 255.036C282.96 254.956 282.947 254.878 282.947 254.812H283.947H284.947C284.947 254.421 284.793 254.068 284.526 253.801L283.819 254.508ZM283.947 254.812H282.947V257.068H283.947H284.947V254.812H283.947ZM283.947 257.068H282.947C282.947 257.002 282.96 256.924 282.994 256.844C283.027 256.764 283.072 256.705 283.112 256.665L283.819 257.372L284.526 258.079C284.793 257.812 284.947 257.459 284.947 257.068H283.947ZM283.819 257.372L283.112 256.665C283.152 256.625 283.211 256.58 283.291 256.546C283.371 256.513 283.45 256.5 283.515 256.5V257.5V258.5C283.906 258.5 284.259 258.346 284.526 258.079L283.819 257.372ZM283.515 257.5V256.5H273.403V257.5V258.5H283.515V257.5ZM273.403 257.5V256.5C273.469 256.5 273.547 256.513 273.627 256.546C273.707 256.58 273.767 256.625 273.806 256.665L273.099 257.372L272.392 258.079C272.659 258.346 273.012 258.5 273.403 258.5V257.5ZM273.099 257.372L273.806 256.665C273.846 256.705 273.891 256.764 273.925 256.844C273.959 256.924 273.971 257.002 273.971 257.068H272.971H271.971C271.971 257.459 272.125 257.812 272.392 258.079L273.099 257.372ZM272.971 257.068H273.971V246.732H272.971H271.971V257.068H272.971ZM272.971 246.732H273.971C273.971 246.798 273.959 246.876 273.925 246.956C273.891 247.036 273.846 247.095 273.806 247.135L273.099 246.428L272.392 245.721C272.125 245.988 271.971 246.341 271.971 246.732H272.971ZM273.099 246.428L273.806 247.135C273.767 247.175 273.707 247.22 273.627 247.254C273.547 247.287 273.469 247.3 273.403 247.3V246.3V245.3C273.012 245.3 272.659 245.454 272.392 245.721L273.099 246.428ZM273.403 246.3V247.3H283.355V246.3V245.3H273.403V246.3ZM283.355 246.3V247.3C283.29 247.3 283.211 247.287 283.131 247.254C283.051 247.22 282.992 247.175 282.952 247.135L283.659 246.428L284.366 245.721C284.099 245.454 283.746 245.3 283.355 245.3V246.3ZM283.659 246.428L282.952 247.135C282.912 247.095 282.867 247.036 282.834 246.956C282.8 246.876 282.787 246.798 282.787 246.732H283.787H284.787C284.787 246.341 284.633 245.988 284.366 245.721L283.659 246.428ZM283.787 246.732H282.787V248.988H283.787H284.787V246.732H283.787ZM283.787 248.988H282.787C282.787 248.922 282.8 248.844 282.834 248.764C282.867 248.684 282.912 248.625 282.952 248.585L283.659 249.292L284.366 249.999C284.633 249.732 284.787 249.379 284.787 248.988H283.787ZM283.659 249.292L282.952 248.585C282.992 248.545 283.051 248.5 283.131 248.466C283.211 248.433 283.29 248.42 283.355 248.42V249.42V250.42C283.746 250.42 284.099 250.266 284.366 249.999L283.659 249.292ZM283.355 249.42V248.42H277.131V249.42V250.42H283.355V249.42ZM277.131 249.42H276.131V250.428H277.131H278.131V249.42H277.131ZM277.131 250.428V251.428H282.475V250.428V249.428H277.131V250.428ZM282.475 250.428V251.428C282.41 251.428 282.331 251.415 282.251 251.382C282.171 251.348 282.112 251.303 282.072 251.263L282.779 250.556L283.486 249.849C283.219 249.582 282.866 249.428 282.475 249.428V250.428ZM282.779 250.556L282.072 251.263C282.032 251.223 281.987 251.164 281.954 251.084C281.92 251.004 281.907 250.926 281.907 250.86H282.907H283.907C283.907 250.469 283.753 250.116 283.486 249.849L282.779 250.556ZM282.907 250.86H281.907V252.94H282.907H283.907V250.86H282.907ZM282.907 252.94H281.907C281.907 252.874 281.92 252.796 281.954 252.716C281.987 252.636 282.032 252.577 282.072 252.537L282.779 253.244L283.486 253.951C283.753 253.684 283.907 253.331 283.907 252.94H282.907ZM282.779 253.244L282.072 252.537C282.112 252.497 282.171 252.452 282.251 252.418C282.331 252.385 282.41 252.372 282.475 252.372V253.372V254.372C282.866 254.372 283.219 254.218 283.486 253.951L282.779 253.244ZM282.475 253.372V252.372H277.131V253.372V254.372H282.475V253.372ZM277.131 253.372H276.131V254.38H277.131H278.131V253.372H277.131ZM277.131 254.38V255.38H283.515V254.38V253.38H277.131V254.38ZM293.717 257.164L294.513 256.558L294.504 256.547L293.717 257.164ZM290.229 252.716L291.016 252.099L289.229 249.82V252.716H290.229ZM290.101 257.372L290.808 258.079V258.079L290.101 257.372ZM290.037 246.62L290.847 246.033L290.842 246.027L290.837 246.02L290.037 246.62ZM293.525 251.436L292.715 252.023L294.525 254.522V251.436H293.525ZM293.653 246.428L294.36 247.135V247.135L293.653 246.428ZM296.933 246.3V247.3C296.867 247.3 296.789 247.287 296.709 247.254C296.629 247.22 296.57 247.175 296.53 247.135L297.237 246.428L297.944 245.721C297.677 245.454 297.324 245.3 296.933 245.3V246.3ZM297.237 246.428L296.53 247.135C296.49 247.095 296.445 247.036 296.411 246.956C296.378 246.876 296.365 246.798 296.365 246.732H297.365H298.365C298.365 246.341 298.211 245.988 297.944 245.721L297.237 246.428ZM297.365 246.732H296.365V257.068H297.365H298.365V246.732H297.365ZM297.365 257.068H296.365C296.365 257.002 296.378 256.924 296.411 256.844C296.445 256.764 296.49 256.705 296.53 256.665L297.237 257.372L297.944 258.079C298.211 257.812 298.365 257.459 298.365 257.068H297.365ZM297.237 257.372L296.53 256.665C296.57 256.625 296.629 256.58 296.709 256.546C296.789 256.513 296.867 256.5 296.933 256.5V257.5V258.5C297.324 258.5 297.677 258.346 297.944 258.079L297.237 257.372ZM296.933 257.5V256.5H294.357V257.5V258.5H296.933V257.5ZM294.357 257.5V256.5C294.366 256.5 294.383 256.501 294.405 256.506C294.427 256.512 294.449 256.52 294.47 256.531C294.512 256.553 294.524 256.573 294.512 256.558L293.717 257.164L292.922 257.77C293.26 258.214 293.755 258.5 294.357 258.5V257.5ZM293.717 257.164L294.504 256.547L291.016 252.099L290.229 252.716L289.442 253.333L292.93 257.781L293.717 257.164ZM290.229 252.716H289.229V257.068H290.229H291.229V252.716H290.229ZM290.229 257.068H289.229C289.229 257.002 289.242 256.924 289.275 256.844C289.309 256.764 289.354 256.705 289.394 256.665L290.101 257.372L290.808 258.079C291.075 257.812 291.229 257.459 291.229 257.068H290.229ZM290.101 257.372L289.394 256.665C289.434 256.625 289.493 256.58 289.573 256.546C289.653 256.513 289.731 256.5 289.797 256.5V257.5V258.5C290.188 258.5 290.541 258.346 290.808 258.079L290.101 257.372ZM289.797 257.5V256.5H286.821V257.5V258.5H289.797V257.5ZM286.821 257.5V256.5C286.887 256.5 286.965 256.513 287.045 256.546C287.125 256.58 287.184 256.625 287.224 256.665L286.517 257.372L285.81 258.079C286.077 258.346 286.43 258.5 286.821 258.5V257.5ZM286.517 257.372L287.224 256.665C287.264 256.705 287.309 256.764 287.343 256.844C287.376 256.924 287.389 257.002 287.389 257.068H286.389H285.389C285.389 257.459 285.543 257.812 285.81 258.079L286.517 257.372ZM286.389 257.068H287.389V246.732H286.389H285.389V257.068H286.389ZM286.389 246.732H287.389C287.389 246.798 287.376 246.876 287.343 246.956C287.309 247.036 287.264 247.095 287.224 247.135L286.517 246.428L285.81 245.721C285.543 245.988 285.389 246.341 285.389 246.732H286.389ZM286.517 246.428L287.224 247.135C287.184 247.175 287.125 247.22 287.045 247.254C286.965 247.287 286.887 247.3 286.821 247.3V246.3V245.3C286.43 245.3 286.077 245.454 285.81 245.721L286.517 246.428ZM286.821 246.3V247.3H289.413V246.3V245.3H286.821V246.3ZM289.413 246.3V247.3C289.398 247.3 289.355 247.296 289.305 247.27C289.256 247.245 289.235 247.218 289.237 247.22L290.037 246.62L290.837 246.02C290.497 245.567 289.999 245.3 289.413 245.3V246.3ZM290.037 246.62L289.227 247.207L292.715 252.023L293.525 251.436L294.335 250.849L290.847 246.033L290.037 246.62ZM293.525 251.436H294.525V246.732H293.525H292.525V251.436H293.525ZM293.525 246.732H294.525C294.525 246.798 294.512 246.876 294.479 246.956C294.445 247.036 294.4 247.095 294.36 247.135L293.653 246.428L292.946 245.721C292.679 245.988 292.525 246.341 292.525 246.732H293.525ZM293.653 246.428L294.36 247.135C294.32 247.175 294.261 247.22 294.181 247.254C294.101 247.287 294.023 247.3 293.957 247.3V246.3V245.3C293.566 245.3 293.213 245.454 292.946 245.721L293.653 246.428ZM293.957 246.3V247.3H296.933V246.3V245.3H293.957V246.3ZM311.583 250.876L310.876 251.583V251.583L311.583 250.876ZM310.047 256.492L310.625 257.308L310.627 257.307L310.047 256.492ZM301.295 256.492L300.711 257.304L300.72 257.31L301.295 256.492ZM300.447 248.252L301.248 248.85L301.252 248.844L300.447 248.252ZM302.607 246.652L302.959 247.588V247.588L302.607 246.652ZM310.975 248.332L310.155 248.904L310.162 248.915L310.975 248.332ZM311.471 249.964L312.178 250.671V250.671L311.471 249.964ZM307.151 249.884L306.368 250.506L306.377 250.517L307.151 249.884ZM304.447 249.596L303.886 248.768L303.88 248.772L303.873 248.777L304.447 249.596ZM304.447 254.188L303.838 254.982L303.847 254.988L303.855 254.994L304.447 254.188ZM307.135 254.204L307.721 255.014L307.726 255.01L307.135 254.204ZM307.631 253.388L308.63 253.422L308.666 252.388H307.631V253.388ZM306.335 250.876L305.628 250.169V250.169L306.335 250.876ZM311.279 250.748V251.748C311.213 251.748 311.135 251.735 311.055 251.702C310.975 251.668 310.915 251.623 310.876 251.583L311.583 250.876L312.29 250.169C312.023 249.902 311.67 249.748 311.279 249.748V250.748ZM311.583 250.876L310.876 251.583C310.836 251.543 310.791 251.484 310.757 251.404C310.723 251.324 310.711 251.246 310.711 251.18H311.711H312.711C312.711 250.789 312.557 250.436 312.29 250.169L311.583 250.876ZM311.711 251.18H310.711V252.876H311.711H312.711V251.18H311.711ZM311.711 252.876H310.711C310.711 254.244 310.26 255.113 309.467 255.677L310.047 256.492L310.627 257.307C312.052 256.293 312.711 254.751 312.711 252.876H311.711ZM310.047 256.492L309.469 255.676C308.589 256.3 307.356 256.66 305.679 256.66V257.66V258.66C307.629 258.66 309.308 258.242 310.625 257.308L310.047 256.492ZM305.679 257.66V256.66C304.003 256.66 302.762 256.3 301.869 255.674L301.295 256.492L300.72 257.31C302.046 258.241 303.728 258.66 305.679 258.66V257.66ZM301.295 256.492L301.878 255.68C301.098 255.12 300.647 254.243 300.647 252.844H299.647H298.647C298.647 254.731 299.294 256.286 300.711 257.304L301.295 256.492ZM299.647 252.844H300.647V250.956H299.647H298.647V252.844H299.647ZM299.647 250.956H300.647C300.647 250.035 300.87 249.357 301.248 248.85L300.447 248.252L299.645 247.654C298.957 248.577 298.647 249.701 298.647 250.956H299.647ZM300.447 248.252L301.252 248.844C301.662 248.287 302.219 247.866 302.959 247.588L302.607 246.652L302.254 245.716C301.181 246.12 300.298 246.766 299.641 247.66L300.447 248.252ZM302.607 246.652L302.959 247.588C303.735 247.296 304.637 247.14 305.679 247.14V246.14V245.14C304.438 245.14 303.292 245.326 302.254 245.716L302.607 246.652ZM305.679 246.14V247.14C306.943 247.14 307.9 247.349 308.603 247.704L309.055 246.812L309.506 245.92C308.438 245.379 307.145 245.14 305.679 245.14V246.14ZM309.055 246.812L308.603 247.704C309.402 248.108 309.887 248.521 310.155 248.904L310.975 248.332L311.795 247.76C311.273 247.012 310.478 246.412 309.506 245.92L309.055 246.812ZM310.975 248.332L310.162 248.915C310.339 249.161 310.451 249.357 310.516 249.504C310.583 249.656 310.583 249.717 310.583 249.708H311.583H312.583C312.583 249.024 312.215 248.346 311.787 247.749L310.975 248.332ZM311.583 249.708H310.583C310.583 249.622 310.6 249.531 310.639 249.443C310.676 249.357 310.725 249.296 310.764 249.257L311.471 249.964L312.178 250.671C312.419 250.429 312.583 250.097 312.583 249.708H311.583ZM311.471 249.964L310.764 249.257C310.822 249.198 310.899 249.144 310.991 249.108C311.082 249.071 311.166 249.06 311.231 249.06V250.06V251.06C311.574 251.06 311.914 250.935 312.178 250.671L311.471 249.964ZM311.231 250.06V249.06H307.615V250.06V251.06H311.231V250.06ZM307.615 250.06V249.06C307.596 249.06 307.63 249.057 307.693 249.081C307.764 249.108 307.852 249.162 307.925 249.251L307.151 249.884L306.377 250.517C306.731 250.95 307.229 251.06 307.615 251.06V250.06ZM307.151 249.884L307.934 249.262C307.371 248.554 306.559 248.26 305.679 248.26V249.26V250.26C306.1 250.26 306.27 250.382 306.368 250.506L307.151 249.884ZM305.679 249.26V248.26C305.034 248.26 304.417 248.409 303.886 248.768L304.447 249.596L305.008 250.424C305.138 250.335 305.342 250.26 305.679 250.26V249.26ZM304.447 249.596L303.873 248.777C303.32 249.164 302.967 249.742 302.967 250.46H303.967H304.967C304.967 250.448 304.968 250.446 304.967 250.451C304.966 250.455 304.963 250.461 304.961 250.466C304.955 250.477 304.962 250.456 305.02 250.415L304.447 249.596ZM303.967 250.46H302.967V253.18H303.967H304.967V250.46H303.967ZM303.967 253.18H302.967C302.967 253.897 303.255 254.535 303.838 254.982L304.447 254.188L305.055 253.394C305.01 253.36 304.996 253.336 304.99 253.322C304.982 253.307 304.967 253.266 304.967 253.18H303.967ZM304.447 254.188L303.855 254.994C304.387 255.385 305.021 255.54 305.679 255.54V254.54V253.54C305.334 253.54 305.146 253.461 305.038 253.382L304.447 254.188ZM305.679 254.54V255.54C306.413 255.54 307.156 255.423 307.721 255.014L307.135 254.204L306.548 253.394C306.495 253.433 306.267 253.54 305.679 253.54V254.54ZM307.135 254.204L307.726 255.01C308.217 254.65 308.606 254.121 308.63 253.422L307.631 253.388L306.631 253.354C306.632 253.346 306.633 253.335 306.637 253.323C306.638 253.318 306.64 253.313 306.642 253.31C306.643 253.306 306.644 253.305 306.644 253.305C306.644 253.305 306.623 253.339 306.543 253.398L307.135 254.204ZM307.631 253.388V252.388H306.639V253.388V254.388H307.631V253.388ZM306.639 253.388V252.388C306.704 252.388 306.783 252.401 306.863 252.434C306.943 252.468 307.002 252.513 307.042 252.553L306.335 253.26L305.628 253.967C305.895 254.234 306.248 254.388 306.639 254.388V253.388ZM306.335 253.26L307.042 252.553C307.082 252.593 307.127 252.652 307.16 252.732C307.194 252.812 307.207 252.89 307.207 252.956H306.207H305.207C305.207 253.347 305.361 253.7 305.628 253.967L306.335 253.26ZM306.207 252.956H307.207V251.18H306.207H305.207V252.956H306.207ZM306.207 251.18H307.207C307.207 251.246 307.194 251.324 307.16 251.404C307.127 251.484 307.082 251.543 307.042 251.583L306.335 250.876L305.628 250.169C305.361 250.436 305.207 250.789 305.207 251.18H306.207ZM306.335 250.876L307.042 251.583C307.002 251.623 306.943 251.668 306.863 251.702C306.783 251.735 306.704 251.748 306.639 251.748V250.748V249.748C306.248 249.748 305.895 249.902 305.628 250.169L306.335 250.876ZM306.639 250.748V251.748H311.279V250.748V249.748H306.639V250.748ZM324.6 254.508L323.893 255.215V255.215L324.6 254.508ZM324.6 257.372L323.893 256.665L323.893 256.665L324.6 257.372ZM324.441 246.428L323.733 247.135V247.135L324.441 246.428ZM324.441 249.292L323.733 248.585V248.585L324.441 249.292ZM317.913 249.42V248.42H316.913V249.42H317.913ZM317.913 250.428H316.913V251.428H317.913V250.428ZM323.561 250.556L322.853 251.263V251.263L323.561 250.556ZM323.561 253.244L322.853 252.537V252.537L323.561 253.244ZM317.913 253.372V252.372H316.913V253.372H317.913ZM317.913 254.38H316.913V255.38H317.913V254.38ZM324.296 254.38V255.38C324.231 255.38 324.153 255.367 324.072 255.334C323.993 255.3 323.933 255.255 323.893 255.215L324.6 254.508L325.308 253.801C325.041 253.534 324.687 253.38 324.296 253.38V254.38ZM324.6 254.508L323.893 255.215C323.854 255.175 323.808 255.116 323.775 255.036C323.741 254.956 323.729 254.878 323.729 254.812H324.729H325.729C325.729 254.421 325.574 254.068 325.308 253.801L324.6 254.508ZM324.729 254.812H323.729V257.068H324.729H325.729V254.812H324.729ZM324.729 257.068H323.729C323.729 257.002 323.741 256.924 323.775 256.844C323.808 256.764 323.854 256.705 323.893 256.665L324.6 257.372L325.308 258.079C325.574 257.812 325.729 257.459 325.729 257.068H324.729ZM324.6 257.372L323.893 256.665C323.933 256.625 323.993 256.58 324.072 256.546C324.153 256.513 324.231 256.5 324.296 256.5V257.5V258.5C324.687 258.5 325.041 258.346 325.308 258.079L324.6 257.372ZM324.296 257.5V256.5H314.184V257.5V258.5H324.296V257.5ZM314.184 257.5V256.5C314.25 256.5 314.328 256.513 314.409 256.546C314.488 256.58 314.548 256.625 314.588 256.665L313.88 257.372L313.173 258.079C313.44 258.346 313.794 258.5 314.184 258.5V257.5ZM313.88 257.372L314.588 256.665C314.627 256.705 314.673 256.764 314.706 256.844C314.74 256.924 314.753 257.002 314.753 257.068H313.753H312.753C312.753 257.459 312.907 257.812 313.173 258.079L313.88 257.372ZM313.753 257.068H314.753V246.732H313.753H312.753V257.068H313.753ZM313.753 246.732H314.753C314.753 246.798 314.74 246.876 314.706 246.956C314.673 247.036 314.627 247.095 314.588 247.135L313.88 246.428L313.173 245.721C312.907 245.988 312.753 246.341 312.753 246.732H313.753ZM313.88 246.428L314.588 247.135C314.548 247.175 314.488 247.22 314.409 247.254C314.328 247.287 314.25 247.3 314.184 247.3V246.3V245.3C313.794 245.3 313.44 245.454 313.173 245.721L313.88 246.428ZM314.184 246.3V247.3H324.137V246.3V245.3H314.184V246.3ZM324.137 246.3V247.3C324.071 247.3 323.993 247.287 323.912 247.254C323.833 247.22 323.773 247.175 323.733 247.135L324.441 246.428L325.148 245.721C324.881 245.454 324.527 245.3 324.137 245.3V246.3ZM324.441 246.428L323.733 247.135C323.694 247.095 323.648 247.036 323.615 246.956C323.581 246.876 323.568 246.798 323.568 246.732H324.568H325.568C325.568 246.341 325.414 245.988 325.148 245.721L324.441 246.428ZM324.568 246.732H323.568V248.988H324.568H325.568V246.732H324.568ZM324.568 248.988H323.568C323.568 248.922 323.581 248.844 323.615 248.764C323.648 248.684 323.694 248.625 323.733 248.585L324.441 249.292L325.148 249.999C325.414 249.732 325.568 249.379 325.568 248.988H324.568ZM324.441 249.292L323.733 248.585C323.773 248.545 323.833 248.5 323.912 248.466C323.993 248.433 324.071 248.42 324.137 248.42V249.42V250.42C324.527 250.42 324.881 250.266 325.148 249.999L324.441 249.292ZM324.137 249.42V248.42H317.913V249.42V250.42H324.137V249.42ZM317.913 249.42H316.913V250.428H317.913H318.913V249.42H317.913ZM317.913 250.428V251.428H323.257V250.428V249.428H317.913V250.428ZM323.257 250.428V251.428C323.191 251.428 323.113 251.415 323.032 251.382C322.953 251.348 322.893 251.303 322.853 251.263L323.561 250.556L324.268 249.849C324.001 249.582 323.647 249.428 323.257 249.428V250.428ZM323.561 250.556L322.853 251.263C322.814 251.223 322.768 251.164 322.735 251.084C322.701 251.004 322.689 250.926 322.689 250.86H323.689H324.689C324.689 250.469 324.534 250.116 324.268 249.849L323.561 250.556ZM323.689 250.86H322.689V252.94H323.689H324.689V250.86H323.689ZM323.689 252.94H322.689C322.689 252.874 322.701 252.796 322.735 252.716C322.768 252.636 322.814 252.577 322.853 252.537L323.561 253.244L324.268 253.951C324.534 253.684 324.689 253.331 324.689 252.94H323.689ZM323.561 253.244L322.853 252.537C322.893 252.497 322.953 252.452 323.032 252.418C323.113 252.385 323.191 252.372 323.257 252.372V253.372V254.372C323.647 254.372 324.001 254.218 324.268 253.951L323.561 253.244ZM323.257 253.372V252.372H317.913V253.372V254.372H323.257V253.372ZM317.913 253.372H316.913V254.38H317.913H318.913V253.372H317.913ZM317.913 254.38V255.38H324.296V254.38V253.38H317.913V254.38Z" fill="black" mask="url(#path-14202-outside-4_2_177825)"/>
</g>
<g filter="url(#filter4_d_2_177825)">
<path d="M343 257.086V247.914C343 247.023 344.077 246.577 344.707 247.207L349.293 251.793C349.683 252.183 349.683 252.817 349.293 253.207L344.707 257.793C344.077 258.423 343 257.977 343 257.086Z" fill="white"/>
<path d="M343 257.086V247.914C343 247.023 344.077 246.577 344.707 247.207L349.293 251.793C349.683 252.183 349.683 252.817 349.293 253.207L344.707 257.793C344.077 258.423 343 257.977 343 257.086Z" stroke="black" stroke-linejoin="round"/>
</g>
</g>
<g filter="url(#filter5_d_2_177825)">
<rect x="23" y="333" width="356" height="99" rx="8" fill="#4946EF" shape-rendering="crispEdges"/>
<rect x="24" y="334" width="354" height="97" rx="7" stroke="#1C1D21" stroke-width="2" shape-rendering="crispEdges"/>
<path d="M51.9163 384.801C52.8685 389.932 57.6928 411.716 59.2163 414.636C60.2437 416.605 61.2151 417.236 62.0551 417.471C56.6857 417.124 54.8054 414.064 54.4554 412.414L47.4728 384.008L51.9163 384.801Z" fill="#750FA6"/>
<path d="M100.953 405.59C94.9865 407.495 72.4761 414.297 62.0551 417.471L62.2316 416.382L98.8904 372.423L103.493 393.529C104.921 399.56 106.92 403.686 100.953 405.59Z" fill="#B93EF5"/>
<path d="M99.0491 372.581L62.0728 417.493C60.1685 417.493 58.6344 415.482 58.1054 414.477L51.9163 385.436L99.0491 372.581Z" fill="#B100FF"/>
<path d="M89.5273 375.597L59.6924 384.008L61.438 374.327L90.6382 365.758L89.5273 375.597Z" fill="#F8F8FA"/>
<path d="M90.6381 365.916L63.1837 373.851L61.2793 372.105L84.2903 365.44L90.6381 365.916Z" fill="#ACB7AC"/>
<path d="M71.912 371.312L70.1664 380.992L79.8469 378.612L81.2751 368.931L74.6099 368.297L66.199 370.677L71.912 371.312Z" fill="black"/>
<path d="M89.8447 366.234L88.099 375.914L95.0091 374.21C97.6189 373.567 99.2529 370.975 98.7083 368.343L98.6044 367.84C98.124 365.518 96.079 363.853 93.7081 363.853H93.355C93.0257 363.853 92.6973 363.886 92.3744 363.95L84.1316 365.599L89.8447 366.234Z" fill="black"/>
<path d="M88.099 358.934L62.3902 372.74L53.0271 367.979L79.5294 354.331L88.099 358.934Z" fill="#F8F8FA"/>
<path d="M79.5295 354.649L53.662 367.979L50.488 366.868L75.086 354.173L79.5295 354.649Z" fill="#ACB7AC"/>
<path d="M59.6924 383.849L52.3923 386.071L55.2489 375.279L62.2315 372.74L63.1837 373.375L59.6924 383.849Z" fill="black"/>
<path d="M50.0712 385.618L52.3924 386.071L56.3598 375.755L62.2316 372.74L53.9793 367.662L50.6467 366.868C49.0598 367.556 45.6954 369.185 44.9336 370.201C43.9815 371.471 43.0293 372.423 43.3467 374.803C43.4982 375.94 44.1093 378.376 44.7349 380.695C45.417 383.224 47.5007 385.116 50.0712 385.618Z" fill="black" stroke="black"/>
<path d="M57.1983 383.4L55.6452 384.165C53.5308 385.206 50.9797 384.203 50.1772 381.987C49.3657 379.746 48.4775 377.207 47.8952 375.315C46.6256 371.189 50.2757 370.395 51.7039 371.03C53.8418 371.98 56.2996 374.393 58.4327 376.68C60.3295 378.713 59.6927 382.171 57.1983 383.4Z" fill="#ACB7AC"/>
<circle cx="51.1229" cy="374.01" r="1.90436" fill="#858585"/>
<circle cx="53.9793" cy="381.945" r="1.58696" fill="#858585"/>
<path d="M61.9142 363.377L70.0077 368.614L78.736 364.012L70.6425 358.616L67.1512 358.14L57.7881 363.06L61.9142 363.377Z" fill="black"/>
<path d="M78.8947 354.807L86.8295 359.727L91.21 357.293C92.8287 356.394 93.6186 354.501 93.1193 352.718L92.4471 350.318C92.0272 348.818 90.7217 347.735 89.1701 347.601C88.4703 347.54 87.7675 347.677 87.1422 347.997L74.7686 354.331L78.8947 354.807Z" fill="black"/>
<path d="M83.2241 396.399C82.9828 397.591 82.4841 398.858 81.3211 399.214L80.3478 399.511C78.6473 400.031 76.6034 399.085 76.6542 397.307C76.6554 397.266 76.6571 397.225 76.6594 397.183C76.6956 396.452 76.8635 395.745 77.1629 395.063C77.4731 394.377 78.2413 393.103 79.4673 391.24C80.1245 390.259 80.3622 389.472 80.1806 388.878C79.999 388.284 79.6803 387.879 79.2247 387.664C78.7766 387.435 78.1961 387.429 77.483 387.647C76.716 387.881 76.1562 388.33 75.8036 388.993C75.0432 390.461 74.3292 392.176 72.7011 392.462L72.328 392.527C70.5489 392.839 68.7529 391.658 68.9511 389.863C69.0737 388.751 69.4041 387.712 69.9421 386.745C70.9788 384.88 73.0097 383.486 76.0347 382.561C78.3899 381.841 80.4416 381.752 82.1899 382.292C84.5623 383.02 86.0871 384.491 86.7641 386.706C87.0448 387.624 87.0617 388.588 86.8148 389.596C86.568 390.605 85.8495 391.965 84.6594 393.675C83.8325 394.873 83.354 395.781 83.2241 396.399ZM78.4477 405.062C77.9566 403.456 78.8609 401.755 80.4674 401.264L81.2455 401.026C82.8519 400.535 84.5523 401.439 85.0433 403.046C85.5344 404.652 84.6302 406.353 83.0237 406.844L82.2456 407.082C80.6391 407.573 78.9388 406.669 78.4477 405.062Z" fill="#FFBF38"/>
<path d="M88.3262 347.298L90.8652 347.518C91.5446 347.578 92.1168 348.052 92.3008 348.709L94.0684 355.02C94.2726 355.75 93.9487 356.525 93.2861 356.893L86.9297 360.425C86.832 360.479 86.7211 360.497 86.6143 360.481L78.9883 364.577C78.9452 364.633 78.8915 364.681 78.8271 364.715L73.7139 367.409L70.5146 369.128L84.0088 365.221L84.0967 365.203C84.1261 365.2 84.1559 365.2 84.1855 365.202L84.5791 365.23L92.4814 363.65C92.6058 363.625 92.7323 363.613 92.8584 363.613H96.4795C97.3907 363.613 98.1766 364.254 98.3613 365.146L99.7539 371.876C99.8688 372.431 99.7282 372.98 99.416 373.403L103.837 393.675L104.107 394.775C104.199 395.135 104.29 395.489 104.38 395.836C104.559 396.528 104.733 397.198 104.882 397.837C105.179 399.109 105.389 400.303 105.354 401.384C105.317 402.477 105.027 403.478 104.309 404.333C103.597 405.179 102.507 405.834 100.963 406.327C94.9933 408.232 72.607 414.78 62.2012 417.949C62.1422 417.967 62.08 417.974 62.0186 417.97C60.8751 417.885 59.0998 417.596 57.4805 416.842C55.86 416.087 54.3293 414.833 53.8281 412.794L47.2432 386.008L46.8105 385.924C45.8451 385.735 45.0619 385.024 44.791 384.073C44.0509 381.472 42.9451 377.405 42.6221 375.5L42.5684 375.148C42.3955 373.852 42.5645 372.895 42.9375 372.079C43.2924 371.303 43.8344 370.667 44.2773 370.076C44.5347 369.733 44.9629 369.391 45.4189 369.079C45.8906 368.756 46.4528 368.424 47.0303 368.108C48.1859 367.477 49.4421 366.889 50.249 366.539L50.293 366.52L50.3691 366.494C50.4154 366.482 50.4631 366.478 50.5107 366.48L57.2705 362.991C57.3101 362.946 57.3576 362.907 57.4131 362.878L66.7764 357.958L66.8477 357.928C66.9208 357.903 66.9989 357.895 67.0762 357.905L67.1162 357.91L74.3447 354.179C74.3618 354.167 74.3797 354.156 74.3984 354.146L87.4375 347.472C87.7115 347.331 88.02 347.271 88.3262 347.298Z" stroke="black" stroke-linejoin="round"/>
<g filter="url(#filter6_d_2_177825)">
<mask id="path-14224-outside-5_2_177825" maskUnits="userSpaceOnUse" x="121" y="374.5" width="178" height="15" fill="black">
<rect fill="white" x="121" y="374.5" width="178" height="15"/>
<path d="M129.68 380.364C130.853 380.492 131.792 380.7 132.496 380.988C133.211 381.276 133.728 381.655 134.048 382.124C134.368 382.593 134.528 383.18 134.528 383.884C134.528 384.652 134.277 385.324 133.776 385.9C133.285 386.465 132.603 386.903 131.728 387.212C130.853 387.511 129.856 387.66 128.736 387.66C127.488 387.66 126.432 387.505 125.568 387.196C124.704 386.887 124.059 386.476 123.632 385.964C123.205 385.441 122.992 384.871 122.992 384.252C122.992 384.145 123.024 384.06 123.088 383.996C123.163 383.932 123.253 383.9 123.36 383.9H126.64C126.864 383.9 127.045 383.969 127.184 384.108C127.365 384.279 127.568 384.396 127.792 384.46C128.016 384.513 128.331 384.54 128.736 384.54C129.749 384.54 130.256 384.385 130.256 384.076C130.256 383.948 130.187 383.841 130.048 383.756C129.92 383.66 129.685 383.58 129.344 383.516C129.013 383.441 128.523 383.367 127.872 383.292C126.411 383.121 125.291 382.759 124.512 382.204C123.733 381.639 123.344 380.844 123.344 379.82C123.344 379.095 123.563 378.455 124 377.9C124.437 377.345 125.056 376.913 125.856 376.604C126.667 376.295 127.605 376.14 128.672 376.14C129.781 376.14 130.752 376.316 131.584 376.668C132.416 377.009 133.051 377.436 133.488 377.948C133.925 378.46 134.144 378.961 134.144 379.452C134.144 379.559 134.107 379.644 134.032 379.708C133.968 379.772 133.877 379.804 133.76 379.804H130.32C130.139 379.804 129.973 379.74 129.824 379.612C129.707 379.505 129.568 379.42 129.408 379.356C129.248 379.292 129.003 379.26 128.672 379.26C127.957 379.26 127.6 379.409 127.6 379.708C127.6 379.868 127.739 379.996 128.016 380.092C128.293 380.177 128.848 380.268 129.68 380.364ZM147.914 376.3C148.031 376.3 148.132 376.343 148.218 376.428C148.303 376.513 148.346 376.615 148.346 376.732V379.308C148.346 379.425 148.303 379.527 148.218 379.612C148.132 379.697 148.031 379.74 147.914 379.74H144.474V387.068C144.474 387.185 144.431 387.287 144.346 387.372C144.26 387.457 144.159 387.5 144.042 387.5H140.746C140.628 387.5 140.527 387.457 140.442 387.372C140.356 387.287 140.314 387.185 140.314 387.068V379.74H136.874C136.756 379.74 136.655 379.697 136.57 379.612C136.484 379.527 136.442 379.425 136.442 379.308V376.732C136.442 376.615 136.484 376.513 136.57 376.428C136.655 376.343 136.756 376.3 136.874 376.3H147.914ZM153.684 386.956C153.545 387.319 153.305 387.5 152.964 387.5H149.94C149.844 387.5 149.758 387.468 149.684 387.404C149.62 387.329 149.588 387.244 149.588 387.148L149.604 387.052L153.092 376.828C153.134 376.689 153.214 376.567 153.332 376.46C153.449 376.353 153.609 376.3 153.812 376.3H158.26C158.462 376.3 158.622 376.353 158.74 376.46C158.857 376.567 158.937 376.689 158.98 376.828L162.468 387.052L162.484 387.148C162.484 387.244 162.446 387.329 162.372 387.404C162.308 387.468 162.228 387.5 162.132 387.5H159.108C158.766 387.5 158.526 387.319 158.388 386.956L157.988 385.836H154.084L153.684 386.956ZM156.036 379.388L154.9 382.716H157.172L156.036 379.388ZM174.589 376.3C174.707 376.3 174.808 376.343 174.893 376.428C174.979 376.513 175.021 376.615 175.021 376.732V387.068C175.021 387.185 174.979 387.287 174.893 387.372C174.808 387.457 174.707 387.5 174.589 387.5H172.013C171.757 387.5 171.544 387.388 171.373 387.164L167.885 382.716V387.068C167.885 387.185 167.843 387.287 167.757 387.372C167.672 387.457 167.571 387.5 167.453 387.5H164.477C164.36 387.5 164.259 387.457 164.173 387.372C164.088 387.287 164.045 387.185 164.045 387.068V376.732C164.045 376.615 164.088 376.513 164.173 376.428C164.259 376.343 164.36 376.3 164.477 376.3H167.069C167.325 376.3 167.533 376.407 167.693 376.62L171.181 381.436V376.732C171.181 376.615 171.224 376.513 171.309 376.428C171.395 376.343 171.496 376.3 171.613 376.3H174.589ZM183.127 376.3C184.93 376.3 186.37 376.689 187.447 377.468C188.535 378.247 189.079 379.452 189.079 381.084V382.716C189.079 384.38 188.54 385.596 187.463 386.364C186.396 387.121 184.951 387.5 183.127 387.5H178.023C177.906 387.5 177.804 387.457 177.719 387.372C177.634 387.287 177.591 387.185 177.591 387.068V376.732C177.591 376.615 177.634 376.513 177.719 376.428C177.804 376.343 177.906 376.3 178.023 376.3H183.127ZM183.207 384.38C183.708 384.38 184.103 384.263 184.391 384.028C184.69 383.783 184.839 383.441 184.839 383.004V380.796C184.839 380.359 184.69 380.023 184.391 379.788C184.103 379.543 183.708 379.42 183.207 379.42H181.751V384.38H183.207ZM194.465 386.956C194.326 387.319 194.086 387.5 193.745 387.5H190.721C190.625 387.5 190.539 387.468 190.465 387.404C190.401 387.329 190.369 387.244 190.369 387.148L190.385 387.052L193.873 376.828C193.915 376.689 193.995 376.567 194.113 376.46C194.23 376.353 194.39 376.3 194.593 376.3H199.041C199.243 376.3 199.403 376.353 199.521 376.46C199.638 376.567 199.718 376.689 199.761 376.828L203.249 387.052L203.265 387.148C203.265 387.244 203.227 387.329 203.153 387.404C203.089 387.468 203.009 387.5 202.913 387.5H199.889C199.547 387.5 199.307 387.319 199.169 386.956L198.769 385.836H194.865L194.465 386.956ZM196.817 379.388L195.681 382.716H197.953L196.817 379.388ZM216.715 387.004C216.736 387.047 216.747 387.095 216.747 387.148C216.747 387.244 216.709 387.329 216.635 387.404C216.571 387.468 216.491 387.5 216.395 387.5H212.763C212.613 387.5 212.475 387.463 212.347 387.388C212.229 387.313 212.144 387.217 212.091 387.1L210.683 383.932H209.339V387.068C209.339 387.185 209.296 387.287 209.211 387.372C209.125 387.457 209.024 387.5 208.907 387.5H205.451C205.333 387.5 205.232 387.457 205.147 387.372C205.061 387.287 205.019 387.185 205.019 387.068V376.732C205.019 376.615 205.061 376.513 205.147 376.428C205.232 376.343 205.333 376.3 205.451 376.3H211.675C212.635 376.3 213.472 376.455 214.187 376.764C214.912 377.073 215.467 377.521 215.851 378.108C216.235 378.695 216.427 379.383 216.427 380.172C216.427 381.623 215.867 382.673 214.747 383.324L216.715 387.004ZM211.339 380.972C211.573 380.972 211.755 380.897 211.883 380.748C212.011 380.588 212.075 380.391 212.075 380.156C212.075 379.921 212.011 379.719 211.883 379.548C211.765 379.367 211.584 379.276 211.339 379.276H209.339V380.972H211.339ZM223.908 376.3C225.711 376.3 227.151 376.689 228.228 377.468C229.316 378.247 229.86 379.452 229.86 381.084V382.716C229.86 384.38 229.322 385.596 228.244 386.364C227.178 387.121 225.732 387.5 223.908 387.5H218.804C218.687 387.5 218.586 387.457 218.5 387.372C218.415 387.287 218.372 387.185 218.372 387.068V376.732C218.372 376.615 218.415 376.513 218.5 376.428C218.586 376.343 218.687 376.3 218.804 376.3H223.908ZM223.988 384.38C224.49 384.38 224.884 384.263 225.172 384.028C225.471 383.783 225.62 383.441 225.62 383.004V380.796C225.62 380.359 225.471 380.023 225.172 379.788C224.884 379.543 224.49 379.42 223.988 379.42H222.532V384.38H223.988ZM253.24 376.732C253.4 376.444 253.629 376.3 253.928 376.3H256.856C256.973 376.3 257.074 376.343 257.16 376.428C257.245 376.513 257.288 376.615 257.288 376.732V387.068C257.288 387.185 257.245 387.287 257.16 387.372C257.074 387.457 256.973 387.5 256.856 387.5H253.96C253.842 387.5 253.741 387.457 253.656 387.372C253.57 387.287 253.528 387.185 253.528 387.068V382.108L252.36 384.412C252.328 384.487 252.253 384.572 252.136 384.668C252.018 384.764 251.869 384.812 251.688 384.812H250.6C250.418 384.812 250.269 384.764 250.152 384.668C250.034 384.572 249.96 384.487 249.928 384.412L248.76 382.108V387.068C248.76 387.185 248.717 387.287 248.632 387.372C248.546 387.457 248.445 387.5 248.328 387.5H245.432C245.314 387.5 245.213 387.457 245.128 387.372C245.042 387.287 245 387.185 245 387.068V376.732C245 376.615 245.042 376.513 245.128 376.428C245.213 376.343 245.314 376.3 245.432 376.3H248.36C248.658 376.3 248.888 376.444 249.048 376.732L251.144 380.572L253.24 376.732ZM270.69 382.876C270.69 384.508 270.146 385.713 269.058 386.492C267.98 387.271 266.54 387.66 264.738 387.66C262.935 387.66 261.49 387.271 260.402 386.492C259.324 385.713 258.786 384.497 258.786 382.844V380.956C258.786 379.868 259.042 378.967 259.554 378.252C260.076 377.527 260.786 376.993 261.682 376.652C262.578 376.311 263.596 376.14 264.738 376.14C265.879 376.14 266.892 376.311 267.778 376.652C268.674 376.993 269.383 377.521 269.906 378.236C270.428 378.951 270.69 379.847 270.69 380.924V382.876ZM263.106 383.18C263.106 383.617 263.25 383.953 263.538 384.188C263.836 384.423 264.236 384.54 264.738 384.54C265.239 384.54 265.634 384.423 265.922 384.188C266.22 383.943 266.37 383.601 266.37 383.164V380.636C266.37 380.199 266.22 379.863 265.922 379.628C265.634 379.383 265.239 379.26 264.738 379.26C264.236 379.26 263.836 379.377 263.538 379.612C263.25 379.847 263.106 380.183 263.106 380.62V383.18ZM278.283 376.3C280.086 376.3 281.526 376.689 282.603 377.468C283.691 378.247 284.235 379.452 284.235 381.084V382.716C284.235 384.38 283.697 385.596 282.619 386.364C281.553 387.121 280.107 387.5 278.283 387.5H273.179C273.062 387.5 272.961 387.457 272.875 387.372C272.79 387.287 272.747 387.185 272.747 387.068V376.732C272.747 376.615 272.79 376.513 272.875 376.428C272.961 376.343 273.062 376.3 273.179 376.3H278.283ZM278.363 384.38C278.865 384.38 279.259 384.263 279.547 384.028C279.846 383.783 279.995 383.441 279.995 383.004V380.796C279.995 380.359 279.846 380.023 279.547 379.788C279.259 379.543 278.865 379.42 278.363 379.42H276.907V384.38H278.363ZM297.109 384.38C297.226 384.38 297.328 384.423 297.413 384.508C297.498 384.593 297.541 384.695 297.541 384.812V387.068C297.541 387.185 297.498 387.287 297.413 387.372C297.328 387.457 297.226 387.5 297.109 387.5H286.997C286.88 387.5 286.778 387.457 286.693 387.372C286.608 387.287 286.565 387.185 286.565 387.068V376.732C286.565 376.615 286.608 376.513 286.693 376.428C286.778 376.343 286.88 376.3 286.997 376.3H296.949C297.066 376.3 297.168 376.343 297.253 376.428C297.338 376.513 297.381 376.615 297.381 376.732V378.988C297.381 379.105 297.338 379.207 297.253 379.292C297.168 379.377 297.066 379.42 296.949 379.42H290.725V380.428H296.069C296.186 380.428 296.288 380.471 296.373 380.556C296.458 380.641 296.501 380.743 296.501 380.86V382.94C296.501 383.057 296.458 383.159 296.373 383.244C296.288 383.329 296.186 383.372 296.069 383.372H290.725V384.38H297.109Z"/>
</mask>
<path d="M129.68 380.364C130.853 380.492 131.792 380.7 132.496 380.988C133.211 381.276 133.728 381.655 134.048 382.124C134.368 382.593 134.528 383.18 134.528 383.884C134.528 384.652 134.277 385.324 133.776 385.9C133.285 386.465 132.603 386.903 131.728 387.212C130.853 387.511 129.856 387.66 128.736 387.66C127.488 387.66 126.432 387.505 125.568 387.196C124.704 386.887 124.059 386.476 123.632 385.964C123.205 385.441 122.992 384.871 122.992 384.252C122.992 384.145 123.024 384.06 123.088 383.996C123.163 383.932 123.253 383.9 123.36 383.9H126.64C126.864 383.9 127.045 383.969 127.184 384.108C127.365 384.279 127.568 384.396 127.792 384.46C128.016 384.513 128.331 384.54 128.736 384.54C129.749 384.54 130.256 384.385 130.256 384.076C130.256 383.948 130.187 383.841 130.048 383.756C129.92 383.66 129.685 383.58 129.344 383.516C129.013 383.441 128.523 383.367 127.872 383.292C126.411 383.121 125.291 382.759 124.512 382.204C123.733 381.639 123.344 380.844 123.344 379.82C123.344 379.095 123.563 378.455 124 377.9C124.437 377.345 125.056 376.913 125.856 376.604C126.667 376.295 127.605 376.14 128.672 376.14C129.781 376.14 130.752 376.316 131.584 376.668C132.416 377.009 133.051 377.436 133.488 377.948C133.925 378.46 134.144 378.961 134.144 379.452C134.144 379.559 134.107 379.644 134.032 379.708C133.968 379.772 133.877 379.804 133.76 379.804H130.32C130.139 379.804 129.973 379.74 129.824 379.612C129.707 379.505 129.568 379.42 129.408 379.356C129.248 379.292 129.003 379.26 128.672 379.26C127.957 379.26 127.6 379.409 127.6 379.708C127.6 379.868 127.739 379.996 128.016 380.092C128.293 380.177 128.848 380.268 129.68 380.364ZM147.914 376.3C148.031 376.3 148.132 376.343 148.218 376.428C148.303 376.513 148.346 376.615 148.346 376.732V379.308C148.346 379.425 148.303 379.527 148.218 379.612C148.132 379.697 148.031 379.74 147.914 379.74H144.474V387.068C144.474 387.185 144.431 387.287 144.346 387.372C144.26 387.457 144.159 387.5 144.042 387.5H140.746C140.628 387.5 140.527 387.457 140.442 387.372C140.356 387.287 140.314 387.185 140.314 387.068V379.74H136.874C136.756 379.74 136.655 379.697 136.57 379.612C136.484 379.527 136.442 379.425 136.442 379.308V376.732C136.442 376.615 136.484 376.513 136.57 376.428C136.655 376.343 136.756 376.3 136.874 376.3H147.914ZM153.684 386.956C153.545 387.319 153.305 387.5 152.964 387.5H149.94C149.844 387.5 149.758 387.468 149.684 387.404C149.62 387.329 149.588 387.244 149.588 387.148L149.604 387.052L153.092 376.828C153.134 376.689 153.214 376.567 153.332 376.46C153.449 376.353 153.609 376.3 153.812 376.3H158.26C158.462 376.3 158.622 376.353 158.74 376.46C158.857 376.567 158.937 376.689 158.98 376.828L162.468 387.052L162.484 387.148C162.484 387.244 162.446 387.329 162.372 387.404C162.308 387.468 162.228 387.5 162.132 387.5H159.108C158.766 387.5 158.526 387.319 158.388 386.956L157.988 385.836H154.084L153.684 386.956ZM156.036 379.388L154.9 382.716H157.172L156.036 379.388ZM174.589 376.3C174.707 376.3 174.808 376.343 174.893 376.428C174.979 376.513 175.021 376.615 175.021 376.732V387.068C175.021 387.185 174.979 387.287 174.893 387.372C174.808 387.457 174.707 387.5 174.589 387.5H172.013C171.757 387.5 171.544 387.388 171.373 387.164L167.885 382.716V387.068C167.885 387.185 167.843 387.287 167.757 387.372C167.672 387.457 167.571 387.5 167.453 387.5H164.477C164.36 387.5 164.259 387.457 164.173 387.372C164.088 387.287 164.045 387.185 164.045 387.068V376.732C164.045 376.615 164.088 376.513 164.173 376.428C164.259 376.343 164.36 376.3 164.477 376.3H167.069C167.325 376.3 167.533 376.407 167.693 376.62L171.181 381.436V376.732C171.181 376.615 171.224 376.513 171.309 376.428C171.395 376.343 171.496 376.3 171.613 376.3H174.589ZM183.127 376.3C184.93 376.3 186.37 376.689 187.447 377.468C188.535 378.247 189.079 379.452 189.079 381.084V382.716C189.079 384.38 188.54 385.596 187.463 386.364C186.396 387.121 184.951 387.5 183.127 387.5H178.023C177.906 387.5 177.804 387.457 177.719 387.372C177.634 387.287 177.591 387.185 177.591 387.068V376.732C177.591 376.615 177.634 376.513 177.719 376.428C177.804 376.343 177.906 376.3 178.023 376.3H183.127ZM183.207 384.38C183.708 384.38 184.103 384.263 184.391 384.028C184.69 383.783 184.839 383.441 184.839 383.004V380.796C184.839 380.359 184.69 380.023 184.391 379.788C184.103 379.543 183.708 379.42 183.207 379.42H181.751V384.38H183.207ZM194.465 386.956C194.326 387.319 194.086 387.5 193.745 387.5H190.721C190.625 387.5 190.539 387.468 190.465 387.404C190.401 387.329 190.369 387.244 190.369 387.148L190.385 387.052L193.873 376.828C193.915 376.689 193.995 376.567 194.113 376.46C194.23 376.353 194.39 376.3 194.593 376.3H199.041C199.243 376.3 199.403 376.353 199.521 376.46C199.638 376.567 199.718 376.689 199.761 376.828L203.249 387.052L203.265 387.148C203.265 387.244 203.227 387.329 203.153 387.404C203.089 387.468 203.009 387.5 202.913 387.5H199.889C199.547 387.5 199.307 387.319 199.169 386.956L198.769 385.836H194.865L194.465 386.956ZM196.817 379.388L195.681 382.716H197.953L196.817 379.388ZM216.715 387.004C216.736 387.047 216.747 387.095 216.747 387.148C216.747 387.244 216.709 387.329 216.635 387.404C216.571 387.468 216.491 387.5 216.395 387.5H212.763C212.613 387.5 212.475 387.463 212.347 387.388C212.229 387.313 212.144 387.217 212.091 387.1L210.683 383.932H209.339V387.068C209.339 387.185 209.296 387.287 209.211 387.372C209.125 387.457 209.024 387.5 208.907 387.5H205.451C205.333 387.5 205.232 387.457 205.147 387.372C205.061 387.287 205.019 387.185 205.019 387.068V376.732C205.019 376.615 205.061 376.513 205.147 376.428C205.232 376.343 205.333 376.3 205.451 376.3H211.675C212.635 376.3 213.472 376.455 214.187 376.764C214.912 377.073 215.467 377.521 215.851 378.108C216.235 378.695 216.427 379.383 216.427 380.172C216.427 381.623 215.867 382.673 214.747 383.324L216.715 387.004ZM211.339 380.972C211.573 380.972 211.755 380.897 211.883 380.748C212.011 380.588 212.075 380.391 212.075 380.156C212.075 379.921 212.011 379.719 211.883 379.548C211.765 379.367 211.584 379.276 211.339 379.276H209.339V380.972H211.339ZM223.908 376.3C225.711 376.3 227.151 376.689 228.228 377.468C229.316 378.247 229.86 379.452 229.86 381.084V382.716C229.86 384.38 229.322 385.596 228.244 386.364C227.178 387.121 225.732 387.5 223.908 387.5H218.804C218.687 387.5 218.586 387.457 218.5 387.372C218.415 387.287 218.372 387.185 218.372 387.068V376.732C218.372 376.615 218.415 376.513 218.5 376.428C218.586 376.343 218.687 376.3 218.804 376.3H223.908ZM223.988 384.38C224.49 384.38 224.884 384.263 225.172 384.028C225.471 383.783 225.62 383.441 225.62 383.004V380.796C225.62 380.359 225.471 380.023 225.172 379.788C224.884 379.543 224.49 379.42 223.988 379.42H222.532V384.38H223.988ZM253.24 376.732C253.4 376.444 253.629 376.3 253.928 376.3H256.856C256.973 376.3 257.074 376.343 257.16 376.428C257.245 376.513 257.288 376.615 257.288 376.732V387.068C257.288 387.185 257.245 387.287 257.16 387.372C257.074 387.457 256.973 387.5 256.856 387.5H253.96C253.842 387.5 253.741 387.457 253.656 387.372C253.57 387.287 253.528 387.185 253.528 387.068V382.108L252.36 384.412C252.328 384.487 252.253 384.572 252.136 384.668C252.018 384.764 251.869 384.812 251.688 384.812H250.6C250.418 384.812 250.269 384.764 250.152 384.668C250.034 384.572 249.96 384.487 249.928 384.412L248.76 382.108V387.068C248.76 387.185 248.717 387.287 248.632 387.372C248.546 387.457 248.445 387.5 248.328 387.5H245.432C245.314 387.5 245.213 387.457 245.128 387.372C245.042 387.287 245 387.185 245 387.068V376.732C245 376.615 245.042 376.513 245.128 376.428C245.213 376.343 245.314 376.3 245.432 376.3H248.36C248.658 376.3 248.888 376.444 249.048 376.732L251.144 380.572L253.24 376.732ZM270.69 382.876C270.69 384.508 270.146 385.713 269.058 386.492C267.98 387.271 266.54 387.66 264.738 387.66C262.935 387.66 261.49 387.271 260.402 386.492C259.324 385.713 258.786 384.497 258.786 382.844V380.956C258.786 379.868 259.042 378.967 259.554 378.252C260.076 377.527 260.786 376.993 261.682 376.652C262.578 376.311 263.596 376.14 264.738 376.14C265.879 376.14 266.892 376.311 267.778 376.652C268.674 376.993 269.383 377.521 269.906 378.236C270.428 378.951 270.69 379.847 270.69 380.924V382.876ZM263.106 383.18C263.106 383.617 263.25 383.953 263.538 384.188C263.836 384.423 264.236 384.54 264.738 384.54C265.239 384.54 265.634 384.423 265.922 384.188C266.22 383.943 266.37 383.601 266.37 383.164V380.636C266.37 380.199 266.22 379.863 265.922 379.628C265.634 379.383 265.239 379.26 264.738 379.26C264.236 379.26 263.836 379.377 263.538 379.612C263.25 379.847 263.106 380.183 263.106 380.62V383.18ZM278.283 376.3C280.086 376.3 281.526 376.689 282.603 377.468C283.691 378.247 284.235 379.452 284.235 381.084V382.716C284.235 384.38 283.697 385.596 282.619 386.364C281.553 387.121 280.107 387.5 278.283 387.5H273.179C273.062 387.5 272.961 387.457 272.875 387.372C272.79 387.287 272.747 387.185 272.747 387.068V376.732C272.747 376.615 272.79 376.513 272.875 376.428C272.961 376.343 273.062 376.3 273.179 376.3H278.283ZM278.363 384.38C278.865 384.38 279.259 384.263 279.547 384.028C279.846 383.783 279.995 383.441 279.995 383.004V380.796C279.995 380.359 279.846 380.023 279.547 379.788C279.259 379.543 278.865 379.42 278.363 379.42H276.907V384.38H278.363ZM297.109 384.38C297.226 384.38 297.328 384.423 297.413 384.508C297.498 384.593 297.541 384.695 297.541 384.812V387.068C297.541 387.185 297.498 387.287 297.413 387.372C297.328 387.457 297.226 387.5 297.109 387.5H286.997C286.88 387.5 286.778 387.457 286.693 387.372C286.608 387.287 286.565 387.185 286.565 387.068V376.732C286.565 376.615 286.608 376.513 286.693 376.428C286.778 376.343 286.88 376.3 286.997 376.3H296.949C297.066 376.3 297.168 376.343 297.253 376.428C297.338 376.513 297.381 376.615 297.381 376.732V378.988C297.381 379.105 297.338 379.207 297.253 379.292C297.168 379.377 297.066 379.42 296.949 379.42H290.725V380.428H296.069C296.186 380.428 296.288 380.471 296.373 380.556C296.458 380.641 296.501 380.743 296.501 380.86V382.94C296.501 383.057 296.458 383.159 296.373 383.244C296.288 383.329 296.186 383.372 296.069 383.372H290.725V384.38H297.109Z" fill="white"/>
<path d="M129.68 380.364L129.565 381.357L129.572 381.358L129.68 380.364ZM132.496 380.988L132.117 381.914L132.122 381.916L132.496 380.988ZM134.048 382.124L133.222 382.687V382.687L134.048 382.124ZM133.776 385.9L133.022 385.243L133.021 385.245L133.776 385.9ZM131.728 387.212L132.051 388.158L132.061 388.155L131.728 387.212ZM125.568 387.196L125.231 388.137V388.137L125.568 387.196ZM123.632 385.964L122.857 386.596L122.864 386.604L123.632 385.964ZM123.088 383.996L122.437 383.237L122.408 383.262L122.381 383.289L123.088 383.996ZM127.184 384.108L126.477 384.815L126.488 384.826L126.499 384.836L127.184 384.108ZM127.792 384.46L127.517 385.422L127.539 385.428L127.56 385.433L127.792 384.46ZM130.048 383.756L129.448 384.556L129.485 384.584L129.524 384.608L130.048 383.756ZM129.344 383.516L129.124 384.491L129.142 384.495L129.16 384.499L129.344 383.516ZM127.872 383.292L127.756 384.285L127.758 384.285L127.872 383.292ZM124.512 382.204L123.924 383.013L123.932 383.018L124.512 382.204ZM124 377.9L123.215 377.281H123.215L124 377.9ZM125.856 376.604L125.499 375.67L125.495 375.671L125.856 376.604ZM131.584 376.668L131.194 377.589L131.204 377.593L131.584 376.668ZM133.488 377.948L132.728 378.597L132.728 378.597L133.488 377.948ZM134.032 379.708L133.381 378.949L133.352 378.974L133.325 379.001L134.032 379.708ZM129.824 379.612L129.151 380.352L129.162 380.362L129.173 380.371L129.824 379.612ZM129.408 379.356L129.037 380.284L129.037 380.284L129.408 379.356ZM128.016 380.092L127.689 381.037L127.705 381.043L127.722 381.048L128.016 380.092ZM129.68 380.364L129.572 381.358C130.697 381.481 131.534 381.675 132.117 381.914L132.496 380.988L132.875 380.062C132.05 379.725 131.009 379.503 129.788 379.37L129.68 380.364ZM132.496 380.988L132.122 381.916C132.717 382.155 133.047 382.43 133.222 382.687L134.048 382.124L134.874 381.561C134.409 380.879 133.704 380.397 132.87 380.06L132.496 380.988ZM134.048 382.124L133.222 382.687C133.404 382.955 133.528 383.333 133.528 383.884H134.528H135.528C135.528 383.027 135.332 382.232 134.874 381.561L134.048 382.124ZM134.528 383.884H133.528C133.528 384.412 133.364 384.851 133.022 385.243L133.776 385.9L134.53 386.557C135.191 385.797 135.528 384.892 135.528 383.884H134.528ZM133.776 385.9L133.021 385.245C132.668 385.651 132.145 386.004 131.395 386.269L131.728 387.212L132.061 388.155C133.061 387.801 133.903 387.279 134.531 386.555L133.776 385.9ZM131.728 387.212L131.405 386.266C130.654 386.522 129.769 386.66 128.736 386.66V387.66V388.66C129.943 388.66 131.053 388.499 132.051 388.158L131.728 387.212ZM128.736 387.66V386.66C127.564 386.66 126.63 386.514 125.905 386.255L125.568 387.196L125.231 388.137C126.234 388.497 127.412 388.66 128.736 388.66V387.66ZM125.568 387.196L125.905 386.255C125.148 385.984 124.677 385.656 124.4 385.324L123.632 385.964L122.864 386.604C123.44 387.296 124.26 387.79 125.231 388.137L125.568 387.196ZM123.632 385.964L124.407 385.332C124.112 384.97 123.992 384.619 123.992 384.252H122.992H121.992C121.992 385.123 122.299 385.912 122.857 386.596L123.632 385.964ZM122.992 384.252H123.992C123.992 384.299 123.985 384.372 123.952 384.459C123.919 384.549 123.865 384.633 123.795 384.703L123.088 383.996L122.381 383.289C122.096 383.574 121.992 383.931 121.992 384.252H122.992ZM123.088 383.996L123.739 384.755C123.685 384.802 123.619 384.841 123.545 384.867C123.472 384.893 123.408 384.9 123.36 384.9V383.9V382.9C123.036 382.9 122.709 383.004 122.437 383.237L123.088 383.996ZM123.36 383.9V384.9H126.64V383.9V382.9H123.36V383.9ZM126.64 383.9V384.9C126.648 384.9 126.626 384.901 126.587 384.886C126.545 384.87 126.506 384.844 126.477 384.815L127.184 384.108L127.891 383.401C127.538 383.048 127.088 382.9 126.64 382.9V383.9ZM127.184 384.108L126.499 384.836C126.788 385.109 127.129 385.311 127.517 385.422L127.792 384.46L128.067 383.498C128.007 383.481 127.943 383.449 127.869 383.38L127.184 384.108ZM127.792 384.46L127.56 385.433C127.897 385.513 128.302 385.54 128.736 385.54V384.54V383.54C128.359 383.54 128.135 383.514 128.024 383.487L127.792 384.46ZM128.736 384.54V385.54C129.269 385.54 129.769 385.502 130.168 385.38C130.5 385.279 131.256 384.946 131.256 384.076H130.256H129.256C129.256 383.973 129.278 383.864 129.327 383.761C129.374 383.66 129.435 383.588 129.486 383.542C129.576 383.459 129.638 383.451 129.584 383.468C129.476 383.501 129.217 383.54 128.736 383.54V384.54ZM130.256 384.076H131.256C131.256 383.505 130.914 383.115 130.572 382.904L130.048 383.756L129.524 384.608C129.501 384.594 129.431 384.546 129.366 384.445C129.294 384.335 129.256 384.204 129.256 384.076H130.256ZM130.048 383.756L130.648 382.956C130.321 382.71 129.884 382.6 129.528 382.533L129.344 383.516L129.16 384.499C129.3 384.525 129.395 384.551 129.453 384.571C129.467 384.575 129.477 384.579 129.485 384.582C129.488 384.583 129.491 384.585 129.493 384.585C129.494 384.586 129.494 384.586 129.495 384.586C129.495 384.586 129.495 384.587 129.495 384.587C129.495 384.587 129.495 384.587 129.495 384.587C129.495 384.587 129.495 384.587 129.495 384.587C129.495 384.587 129.495 384.586 129.495 384.586C129.494 384.586 129.493 384.586 129.493 384.585C129.491 384.584 129.488 384.583 129.484 384.58C129.476 384.576 129.464 384.568 129.448 384.556L130.048 383.756ZM129.344 383.516L129.564 382.541C129.18 382.454 128.646 382.374 127.986 382.299L127.872 383.292L127.758 384.285C128.399 384.359 128.847 384.429 129.124 384.491L129.344 383.516ZM127.872 383.292L127.988 382.299C126.612 382.138 125.679 381.808 125.092 381.39L124.512 382.204L123.932 383.018C124.902 383.71 126.21 384.105 127.756 384.285L127.872 383.292ZM124.512 382.204L125.1 381.395C124.599 381.031 124.344 380.548 124.344 379.82H123.344H122.344C122.344 381.14 122.868 382.246 123.924 383.013L124.512 382.204ZM123.344 379.82H124.344C124.344 379.313 124.491 378.892 124.785 378.519L124 377.9L123.215 377.281C122.634 378.017 122.344 378.877 122.344 379.82H123.344ZM124 377.9L124.785 378.519C125.09 378.132 125.548 377.795 126.217 377.537L125.856 376.604L125.495 375.671C124.564 376.031 123.785 376.558 123.215 377.281L124 377.9ZM125.856 376.604L126.213 377.538C126.887 377.281 127.7 377.14 128.672 377.14V376.14V375.14C127.511 375.14 126.447 375.308 125.499 375.67L125.856 376.604ZM128.672 376.14V377.14C129.677 377.14 130.51 377.3 131.194 377.589L131.584 376.668L131.974 375.747C130.994 375.332 129.886 375.14 128.672 375.14V376.14ZM131.584 376.668L131.204 377.593C131.937 377.894 132.422 378.24 132.728 378.597L133.488 377.948L134.248 377.299C133.679 376.632 132.895 376.125 131.964 375.743L131.584 376.668ZM133.488 377.948L132.728 378.597C133.068 378.996 133.144 379.275 133.144 379.452H134.144H135.144C135.144 378.647 134.783 377.924 134.248 377.299L133.488 377.948ZM134.144 379.452H133.144C133.144 379.387 133.156 379.296 133.2 379.195C133.245 379.092 133.311 379.009 133.381 378.949L134.032 379.708L134.683 380.467C134.999 380.196 135.144 379.823 135.144 379.452H134.144ZM134.032 379.708L133.325 379.001C133.499 378.826 133.694 378.804 133.76 378.804V379.804V380.804C134.061 380.804 134.437 380.718 134.739 380.415L134.032 379.708ZM133.76 379.804V378.804H130.32V379.804V380.804H133.76V379.804ZM130.32 379.804V378.804C130.35 378.804 130.386 378.81 130.421 378.823C130.455 378.837 130.473 378.851 130.475 378.853L129.824 379.612L129.173 380.371C129.487 380.64 129.879 380.804 130.32 380.804V379.804ZM129.824 379.612L130.497 378.872C130.284 378.678 130.041 378.532 129.779 378.428L129.408 379.356L129.037 380.284C129.095 380.308 129.13 380.332 129.151 380.352L129.824 379.612ZM129.408 379.356L129.779 378.428C129.437 378.291 129.035 378.26 128.672 378.26V379.26V380.26C128.807 380.26 128.906 380.267 128.975 380.276C129.047 380.285 129.06 380.294 129.037 380.284L129.408 379.356ZM128.672 379.26V378.26C128.275 378.26 127.847 378.297 127.482 378.449C127.29 378.53 127.065 378.663 126.885 378.888C126.693 379.13 126.6 379.417 126.6 379.708H127.6H128.6C128.6 379.85 128.552 380.006 128.449 380.136C128.358 380.249 128.267 380.289 128.254 380.295C128.239 380.301 128.261 380.29 128.341 380.278C128.417 380.268 128.526 380.26 128.672 380.26V379.26ZM127.6 379.708H126.6C126.6 380.581 127.372 380.927 127.689 381.037L128.016 380.092L128.343 379.147C128.27 379.122 128.31 379.122 128.382 379.189C128.424 379.227 128.481 379.292 128.527 379.388C128.575 379.488 128.6 379.598 128.6 379.708H127.6ZM128.016 380.092L127.722 381.048C128.101 381.164 128.746 381.263 129.565 381.357L129.68 380.364L129.795 379.371C128.95 379.273 128.486 379.19 128.31 379.136L128.016 380.092ZM144.474 379.74V378.74H143.474V379.74H144.474ZM144.346 387.372L145.053 388.079L145.053 388.079L144.346 387.372ZM140.442 387.372L139.735 388.079L139.735 388.079L140.442 387.372ZM140.314 379.74H141.314V378.74H140.314V379.74ZM147.914 376.3V377.3C147.848 377.3 147.77 377.287 147.69 377.254C147.61 377.22 147.55 377.175 147.511 377.135L148.218 376.428L148.925 375.721C148.658 375.454 148.305 375.3 147.914 375.3V376.3ZM148.218 376.428L147.511 377.135C147.471 377.095 147.426 377.036 147.392 376.956C147.358 376.876 147.346 376.798 147.346 376.732H148.346H149.346C149.346 376.341 149.192 375.988 148.925 375.721L148.218 376.428ZM148.346 376.732H147.346V379.308H148.346H149.346V376.732H148.346ZM148.346 379.308H147.346C147.346 379.242 147.358 379.164 147.392 379.084C147.426 379.004 147.471 378.945 147.511 378.905L148.218 379.612L148.925 380.319C149.192 380.052 149.346 379.699 149.346 379.308H148.346ZM148.218 379.612L147.511 378.905C147.55 378.865 147.61 378.82 147.69 378.786C147.77 378.753 147.848 378.74 147.914 378.74V379.74V380.74C148.305 380.74 148.658 380.586 148.925 380.319L148.218 379.612ZM147.914 379.74V378.74H144.474V379.74V380.74H147.914V379.74ZM144.474 379.74H143.474V387.068H144.474H145.474V379.74H144.474ZM144.474 387.068H143.474C143.474 387.002 143.486 386.924 143.52 386.844C143.554 386.764 143.599 386.705 143.639 386.665L144.346 387.372L145.053 388.079C145.32 387.812 145.474 387.459 145.474 387.068H144.474ZM144.346 387.372L143.639 386.665C143.678 386.625 143.738 386.58 143.818 386.546C143.898 386.513 143.976 386.5 144.042 386.5V387.5V388.5C144.433 388.5 144.786 388.346 145.053 388.079L144.346 387.372ZM144.042 387.5V386.5H140.746V387.5V388.5H144.042V387.5ZM140.746 387.5V386.5C140.811 386.5 140.89 386.513 140.97 386.546C141.05 386.58 141.109 386.625 141.149 386.665L140.442 387.372L139.735 388.079C140.002 388.346 140.355 388.5 140.746 388.5V387.5ZM140.442 387.372L141.149 386.665C141.189 386.705 141.234 386.764 141.267 386.844C141.301 386.924 141.314 387.002 141.314 387.068H140.314H139.314C139.314 387.459 139.468 387.812 139.735 388.079L140.442 387.372ZM140.314 387.068H141.314V379.74H140.314H139.314V387.068H140.314ZM140.314 379.74V378.74H136.874V379.74V380.74H140.314V379.74ZM136.874 379.74V378.74C136.939 378.74 137.018 378.753 137.098 378.786C137.178 378.82 137.237 378.865 137.277 378.905L136.57 379.612L135.863 380.319C136.13 380.586 136.483 380.74 136.874 380.74V379.74ZM136.57 379.612L137.277 378.905C137.317 378.945 137.362 379.004 137.395 379.084C137.429 379.164 137.442 379.242 137.442 379.308H136.442H135.442C135.442 379.699 135.596 380.052 135.863 380.319L136.57 379.612ZM136.442 379.308H137.442V376.732H136.442H135.442V379.308H136.442ZM136.442 376.732H137.442C137.442 376.798 137.429 376.876 137.395 376.956C137.362 377.036 137.317 377.095 137.277 377.135L136.57 376.428L135.863 375.721C135.596 375.988 135.442 376.341 135.442 376.732H136.442ZM136.57 376.428L137.277 377.135C137.237 377.175 137.178 377.22 137.098 377.254C137.018 377.287 136.939 377.3 136.874 377.3V376.3V375.3C136.483 375.3 136.13 375.454 135.863 375.721L136.57 376.428ZM136.874 376.3V377.3H147.914V376.3V375.3H136.874V376.3ZM153.684 386.956L154.618 387.313L154.622 387.303L154.625 387.292L153.684 386.956ZM149.684 387.404L148.924 388.055L148.974 388.113L149.033 388.163L149.684 387.404ZM149.587 387.148L148.601 386.984L148.587 387.065V387.148H149.587ZM149.604 387.052L148.657 386.729L148.631 386.807L148.617 386.888L149.604 387.052ZM153.091 376.828L154.038 377.151L154.043 377.137L154.047 377.122L153.091 376.828ZM153.332 376.46L152.659 375.72L152.659 375.72L153.332 376.46ZM158.74 376.46L159.412 375.72V375.72L158.74 376.46ZM158.979 376.828L158.024 377.122L158.028 377.137L158.033 377.151L158.979 376.828ZM162.467 387.052L163.454 386.888L163.44 386.807L163.414 386.729L162.467 387.052ZM162.484 387.148H163.484V387.065L163.47 386.984L162.484 387.148ZM162.372 387.404L163.079 388.111L163.079 388.111L162.372 387.404ZM158.388 386.956L157.446 387.292L157.449 387.303L157.453 387.313L158.388 386.956ZM157.987 385.836L158.929 385.5L158.692 384.836H157.987V385.836ZM154.083 385.836V384.836H153.379L153.142 385.5L154.083 385.836ZM156.035 379.388L156.982 379.065L156.035 376.292L155.089 379.065L156.035 379.388ZM154.9 382.716L153.953 382.393L153.502 383.716H154.9V382.716ZM157.172 382.716V383.716H158.569L158.118 382.393L157.172 382.716ZM153.684 386.956L152.749 386.599C152.728 386.655 152.729 386.617 152.797 386.566C152.83 386.541 152.867 386.523 152.903 386.511C152.937 386.501 152.96 386.5 152.964 386.5V387.5V388.5C153.321 388.5 153.686 388.401 154.002 388.162C154.31 387.93 154.5 387.619 154.618 387.313L153.684 386.956ZM152.964 387.5V386.5H149.94V387.5V388.5H152.964V387.5ZM149.94 387.5V386.5C150.005 386.5 150.079 386.511 150.155 386.54C150.23 386.568 150.29 386.607 150.334 386.645L149.684 387.404L149.033 388.163C149.284 388.378 149.598 388.5 149.94 388.5V387.5ZM149.684 387.404L150.443 386.753C150.481 386.798 150.52 386.858 150.548 386.933C150.576 387.008 150.587 387.083 150.587 387.148H149.587H148.587C148.587 387.489 148.709 387.804 148.924 388.055L149.684 387.404ZM149.587 387.148L150.574 387.312L150.59 387.216L149.604 387.052L148.617 386.888L148.601 386.984L149.587 387.148ZM149.604 387.052L150.55 387.375L154.038 377.151L153.091 376.828L152.145 376.505L148.657 386.729L149.604 387.052ZM153.091 376.828L154.047 377.122C154.041 377.143 154.032 377.162 154.021 377.178C154.011 377.194 154.003 377.201 154.004 377.2L153.332 376.46L152.659 375.72C152.422 375.936 152.236 376.208 152.136 376.534L153.091 376.828ZM153.332 376.46L154.004 377.2C153.953 377.246 153.899 377.274 153.856 377.289C153.816 377.302 153.797 377.3 153.812 377.3V376.3V375.3C153.432 375.3 153.007 375.403 152.659 375.72L153.332 376.46ZM153.812 376.3V377.3H158.259V376.3V375.3H153.812V376.3ZM158.259 376.3V377.3C158.274 377.3 158.255 377.302 158.215 377.289C158.172 377.274 158.118 377.246 158.067 377.2L158.74 376.46L159.412 375.72C159.064 375.403 158.639 375.3 158.259 375.3V376.3ZM158.74 376.46L158.067 377.2C158.068 377.201 158.06 377.194 158.05 377.178C158.039 377.162 158.03 377.143 158.024 377.122L158.979 376.828L159.935 376.534C159.835 376.208 159.649 375.936 159.412 375.72L158.74 376.46ZM158.979 376.828L158.033 377.151L161.521 387.375L162.467 387.052L163.414 386.729L159.926 376.505L158.979 376.828ZM162.467 387.052L161.481 387.216L161.497 387.312L162.484 387.148L163.47 386.984L163.454 386.888L162.467 387.052ZM162.484 387.148H161.484C161.484 387.062 161.501 386.971 161.539 386.883C161.577 386.797 161.625 386.736 161.664 386.697L162.372 387.404L163.079 388.111C163.32 387.869 163.484 387.537 163.484 387.148H162.484ZM162.372 387.404L161.664 386.697C161.723 386.638 161.8 386.584 161.892 386.548C161.983 386.511 162.067 386.5 162.132 386.5V387.5V388.5C162.475 388.5 162.815 388.375 163.079 388.111L162.372 387.404ZM162.132 387.5V386.5H159.107V387.5V388.5H162.132V387.5ZM159.107 387.5V386.5C159.111 386.5 159.134 386.501 159.168 386.511C159.204 386.523 159.241 386.541 159.274 386.566C159.342 386.617 159.343 386.655 159.322 386.599L158.388 386.956L157.453 387.313C157.571 387.619 157.761 387.93 158.069 388.162C158.385 388.401 158.75 388.5 159.107 388.5V387.5ZM158.388 386.956L159.329 386.62L158.929 385.5L157.987 385.836L157.046 386.172L157.446 387.292L158.388 386.956ZM157.987 385.836V384.836H154.083V385.836V386.836H157.987V385.836ZM154.083 385.836L153.142 385.5L152.742 386.62L153.684 386.956L154.625 387.292L155.025 386.172L154.083 385.836ZM156.035 379.388L155.089 379.065L153.953 382.393L154.9 382.716L155.846 383.039L156.982 379.711L156.035 379.388ZM154.9 382.716V383.716H157.172V382.716V381.716H154.9V382.716ZM157.172 382.716L158.118 382.393L156.982 379.065L156.035 379.388L155.089 379.711L156.225 383.039L157.172 382.716ZM171.373 387.164L172.169 386.558L172.16 386.547L171.373 387.164ZM167.885 382.716L168.672 382.099L166.885 379.82V382.716H167.885ZM167.757 387.372L168.464 388.079L168.464 388.079L167.757 387.372ZM167.693 376.62L168.503 376.033L168.498 376.027L168.493 376.02L167.693 376.62ZM171.181 381.436L170.371 382.023L172.181 384.522V381.436H171.181ZM171.309 376.428L172.016 377.135L172.016 377.135L171.309 376.428ZM174.589 376.3V377.3C174.524 377.3 174.445 377.287 174.365 377.254C174.285 377.22 174.226 377.175 174.186 377.135L174.893 376.428L175.6 375.721C175.333 375.454 174.98 375.3 174.589 375.3V376.3ZM174.893 376.428L174.186 377.135C174.146 377.095 174.101 377.036 174.068 376.956C174.034 376.876 174.021 376.798 174.021 376.732H175.021H176.021C176.021 376.341 175.867 375.988 175.6 375.721L174.893 376.428ZM175.021 376.732H174.021V387.068H175.021H176.021V376.732H175.021ZM175.021 387.068H174.021C174.021 387.002 174.034 386.924 174.068 386.844C174.101 386.764 174.146 386.705 174.186 386.665L174.893 387.372L175.6 388.079C175.867 387.812 176.021 387.459 176.021 387.068H175.021ZM174.893 387.372L174.186 386.665C174.226 386.625 174.285 386.58 174.365 386.546C174.445 386.513 174.524 386.5 174.589 386.5V387.5V388.5C174.98 388.5 175.333 388.346 175.6 388.079L174.893 387.372ZM174.589 387.5V386.5H172.013V387.5V388.5H174.589V387.5ZM172.013 387.5V386.5C172.023 386.5 172.04 386.501 172.061 386.506C172.083 386.512 172.106 386.52 172.126 386.531C172.169 386.553 172.18 386.573 172.169 386.558L171.373 387.164L170.578 387.77C170.916 388.214 171.411 388.5 172.013 388.5V387.5ZM171.373 387.164L172.16 386.547L168.672 382.099L167.885 382.716L167.098 383.333L170.586 387.781L171.373 387.164ZM167.885 382.716H166.885V387.068H167.885H168.885V382.716H167.885ZM167.885 387.068H166.885C166.885 387.002 166.898 386.924 166.932 386.844C166.965 386.764 167.01 386.705 167.05 386.665L167.757 387.372L168.464 388.079C168.731 387.812 168.885 387.459 168.885 387.068H167.885ZM167.757 387.372L167.05 386.665C167.09 386.625 167.149 386.58 167.229 386.546C167.309 386.513 167.388 386.5 167.453 386.5V387.5V388.5C167.844 388.5 168.197 388.346 168.464 388.079L167.757 387.372ZM167.453 387.5V386.5H164.477V387.5V388.5H167.453V387.5ZM164.477 387.5V386.5C164.543 386.5 164.621 386.513 164.701 386.546C164.781 386.58 164.841 386.625 164.88 386.665L164.173 387.372L163.466 388.079C163.733 388.346 164.086 388.5 164.477 388.5V387.5ZM164.173 387.372L164.88 386.665C164.92 386.705 164.965 386.764 164.999 386.844C165.033 386.924 165.045 387.002 165.045 387.068H164.045H163.045C163.045 387.459 163.199 387.812 163.466 388.079L164.173 387.372ZM164.045 387.068H165.045V376.732H164.045H163.045V387.068H164.045ZM164.045 376.732H165.045C165.045 376.798 165.033 376.876 164.999 376.956C164.965 377.036 164.92 377.095 164.88 377.135L164.173 376.428L163.466 375.721C163.199 375.988 163.045 376.341 163.045 376.732H164.045ZM164.173 376.428L164.88 377.135C164.841 377.175 164.781 377.22 164.701 377.254C164.621 377.287 164.543 377.3 164.477 377.3V376.3V375.3C164.086 375.3 163.733 375.454 163.466 375.721L164.173 376.428ZM164.477 376.3V377.3H167.069V376.3V375.3H164.477V376.3ZM167.069 376.3V377.3C167.054 377.3 167.011 377.296 166.961 377.27C166.912 377.245 166.891 377.218 166.893 377.22L167.693 376.62L168.493 376.02C168.154 375.567 167.655 375.3 167.069 375.3V376.3ZM167.693 376.62L166.883 377.207L170.371 382.023L171.181 381.436L171.991 380.849L168.503 376.033L167.693 376.62ZM171.181 381.436H172.181V376.732H171.181H170.181V381.436H171.181ZM171.181 376.732H172.181C172.181 376.798 172.169 376.876 172.135 376.956C172.101 377.036 172.056 377.095 172.016 377.135L171.309 376.428L170.602 375.721C170.335 375.988 170.181 376.341 170.181 376.732H171.181ZM171.309 376.428L172.016 377.135C171.977 377.175 171.917 377.22 171.837 377.254C171.757 377.287 171.679 377.3 171.613 377.3V376.3V375.3C171.222 375.3 170.869 375.454 170.602 375.721L171.309 376.428ZM171.613 376.3V377.3H174.589V376.3V375.3H171.613V376.3ZM187.447 377.468L186.861 378.278L186.865 378.281L187.447 377.468ZM187.463 386.364L188.042 387.179L188.043 387.178L187.463 386.364ZM184.391 384.028L185.023 384.803L185.026 384.801L184.391 384.028ZM184.391 379.788L183.743 380.549L183.758 380.562L183.773 380.574L184.391 379.788ZM181.751 379.42V378.42H180.751V379.42H181.751ZM181.751 384.38H180.751V385.38H181.751V384.38ZM183.127 376.3V377.3C184.793 377.3 186.006 377.66 186.861 378.278L187.447 377.468L188.033 376.658C186.734 375.719 185.066 375.3 183.127 375.3V376.3ZM187.447 377.468L186.865 378.281C187.632 378.83 188.079 379.695 188.079 381.084H189.079H190.079C190.079 379.209 189.438 377.663 188.029 376.655L187.447 377.468ZM189.079 381.084H188.079V382.716H189.079H190.079V381.084H189.079ZM189.079 382.716H188.079C188.079 384.15 187.629 385.018 186.883 385.55L187.463 386.364L188.043 387.178C189.452 386.174 190.079 384.61 190.079 382.716H189.079ZM187.463 386.364L186.884 385.549C186.041 386.147 184.823 386.5 183.127 386.5V387.5V388.5C185.079 388.5 186.751 388.096 188.042 387.179L187.463 386.364ZM183.127 387.5V386.5H178.023V387.5V388.5H183.127V387.5ZM178.023 387.5V386.5C178.089 386.5 178.167 386.513 178.247 386.546C178.327 386.58 178.386 386.625 178.426 386.665L177.719 387.372L177.012 388.079C177.279 388.346 177.632 388.5 178.023 388.5V387.5ZM177.719 387.372L178.426 386.665C178.466 386.705 178.511 386.764 178.545 386.844C178.578 386.924 178.591 387.002 178.591 387.068H177.591H176.591C176.591 387.459 176.745 387.812 177.012 388.079L177.719 387.372ZM177.591 387.068H178.591V376.732H177.591H176.591V387.068H177.591ZM177.591 376.732H178.591C178.591 376.798 178.578 376.876 178.545 376.956C178.511 377.036 178.466 377.095 178.426 377.135L177.719 376.428L177.012 375.721C176.745 375.988 176.591 376.341 176.591 376.732H177.591ZM177.719 376.428L178.426 377.135C178.386 377.175 178.327 377.22 178.247 377.254C178.167 377.287 178.089 377.3 178.023 377.3V376.3V375.3C177.632 375.3 177.279 375.454 177.012 375.721L177.719 376.428ZM178.023 376.3V377.3H183.127V376.3V375.3H178.023V376.3ZM183.207 384.38V385.38C183.858 385.38 184.503 385.227 185.023 384.803L184.391 384.028L183.759 383.253C183.703 383.298 183.559 383.38 183.207 383.38V384.38ZM184.391 384.028L185.026 384.801C185.588 384.339 185.839 383.696 185.839 383.004H184.839H183.839C183.839 383.186 183.791 383.226 183.756 383.255L184.391 384.028ZM184.839 383.004H185.839V380.796H184.839H183.839V383.004H184.839ZM184.839 380.796H185.839C185.839 380.104 185.587 379.456 185.009 379.002L184.391 379.788L183.773 380.574C183.799 380.594 183.807 380.608 183.813 380.622C183.821 380.64 183.839 380.691 183.839 380.796H184.839ZM184.391 379.788L185.039 379.027C184.519 378.583 183.868 378.42 183.207 378.42V379.42V380.42C183.549 380.42 183.687 380.502 183.743 380.549L184.391 379.788ZM183.207 379.42V378.42H181.751V379.42V380.42H183.207V379.42ZM181.751 379.42H180.751V384.38H181.751H182.751V379.42H181.751ZM181.751 384.38V385.38H183.207V384.38V383.38H181.751V384.38ZM194.465 386.956L195.399 387.313L195.403 387.303L195.406 387.292L194.465 386.956ZM190.465 387.404L189.705 388.055L189.756 388.113L189.814 388.163L190.465 387.404ZM190.369 387.148L189.382 386.984L189.369 387.065V387.148H190.369ZM190.385 387.052L189.438 386.729L189.412 386.807L189.398 386.888L190.385 387.052ZM193.873 376.828L194.819 377.151L194.824 377.137L194.829 377.122L193.873 376.828ZM194.113 376.46L193.44 375.72V375.72L194.113 376.46ZM199.521 376.46L200.193 375.72V375.72L199.521 376.46ZM199.761 376.828L198.805 377.122L198.809 377.137L198.814 377.151L199.761 376.828ZM203.249 387.052L204.235 386.888L204.222 386.807L204.195 386.729L203.249 387.052ZM203.265 387.148H204.265V387.065L204.251 386.984L203.265 387.148ZM203.153 387.404L203.86 388.111L203.86 388.111L203.153 387.404ZM199.169 386.956L198.227 387.292L198.231 387.303L198.235 387.313L199.169 386.956ZM198.769 385.836L199.71 385.5L199.473 384.836H198.769V385.836ZM194.865 385.836V384.836H194.16L193.923 385.5L194.865 385.836ZM196.817 379.388L197.763 379.065L196.817 376.292L195.87 379.065L196.817 379.388ZM195.681 382.716L194.734 382.393L194.283 383.716H195.681V382.716ZM197.953 382.716V383.716H199.351L198.899 382.393L197.953 382.716ZM194.465 386.956L193.531 386.599C193.509 386.655 193.511 386.617 193.578 386.566C193.611 386.541 193.648 386.523 193.684 386.511C193.719 386.501 193.741 386.5 193.745 386.5V387.5V388.5C194.102 388.5 194.467 388.401 194.784 388.162C195.091 387.93 195.282 387.619 195.399 387.313L194.465 386.956ZM193.745 387.5V386.5H190.721V387.5V388.5H193.745V387.5ZM190.721 387.5V386.5C190.786 386.5 190.86 386.511 190.936 386.54C191.011 386.568 191.071 386.607 191.116 386.645L190.465 387.404L189.814 388.163C190.065 388.378 190.38 388.5 190.721 388.5V387.5ZM190.465 387.404L191.224 386.753C191.262 386.798 191.301 386.858 191.329 386.933C191.357 387.008 191.369 387.083 191.369 387.148H190.369H189.369C189.369 387.489 189.49 387.804 189.705 388.055L190.465 387.404ZM190.369 387.148L191.355 387.312L191.371 387.216L190.385 387.052L189.398 386.888L189.382 386.984L190.369 387.148ZM190.385 387.052L191.331 387.375L194.819 377.151L193.873 376.828L192.926 376.505L189.438 386.729L190.385 387.052ZM193.873 376.828L194.829 377.122C194.822 377.143 194.813 377.162 194.802 377.178C194.792 377.194 194.785 377.201 194.785 377.2L194.113 376.46L193.44 375.72C193.203 375.936 193.017 376.208 192.917 376.534L193.873 376.828ZM194.113 376.46L194.785 377.2C194.735 377.246 194.68 377.274 194.637 377.289C194.597 377.302 194.578 377.3 194.593 377.3V376.3V375.3C194.213 375.3 193.788 375.403 193.44 375.72L194.113 376.46ZM194.593 376.3V377.3H199.041V376.3V375.3H194.593V376.3ZM199.041 376.3V377.3C199.056 377.3 199.037 377.302 198.997 377.289C198.953 377.274 198.899 377.246 198.848 377.2L199.521 376.46L200.193 375.72C199.845 375.403 199.421 375.3 199.041 375.3V376.3ZM199.521 376.46L198.848 377.2C198.849 377.201 198.841 377.194 198.831 377.178C198.821 377.162 198.811 377.143 198.805 377.122L199.761 376.828L200.717 376.534C200.616 376.208 200.431 375.936 200.193 375.72L199.521 376.46ZM199.761 376.828L198.814 377.151L202.302 387.375L203.249 387.052L204.195 386.729L200.707 376.505L199.761 376.828ZM203.249 387.052L202.262 387.216L202.278 387.312L203.265 387.148L204.251 386.984L204.235 386.888L203.249 387.052ZM203.265 387.148H202.265C202.265 387.062 202.282 386.971 202.321 386.883C202.358 386.797 202.407 386.736 202.446 386.697L203.153 387.404L203.86 388.111C204.101 387.869 204.265 387.537 204.265 387.148H203.265ZM203.153 387.404L202.446 386.697C202.504 386.638 202.581 386.584 202.673 386.548C202.764 386.511 202.848 386.5 202.913 386.5V387.5V388.5C203.256 388.5 203.596 388.375 203.86 388.111L203.153 387.404ZM202.913 387.5V386.5H199.889V387.5V388.5H202.913V387.5ZM199.889 387.5V386.5C199.892 386.5 199.915 386.501 199.95 386.511C199.985 386.523 200.023 386.541 200.056 386.566C200.123 386.617 200.124 386.655 200.103 386.599L199.169 386.956L198.235 387.313C198.352 387.619 198.543 387.93 198.85 388.162C199.167 388.401 199.531 388.5 199.889 388.5V387.5ZM199.169 386.956L200.11 386.62L199.71 385.5L198.769 385.836L197.827 386.172L198.227 387.292L199.169 386.956ZM198.769 385.836V384.836H194.865V385.836V386.836H198.769V385.836ZM194.865 385.836L193.923 385.5L193.523 386.62L194.465 386.956L195.406 387.292L195.806 386.172L194.865 385.836ZM196.817 379.388L195.87 379.065L194.734 382.393L195.681 382.716L196.627 383.039L197.763 379.711L196.817 379.388ZM195.681 382.716V383.716H197.953V382.716V381.716H195.681V382.716ZM197.953 382.716L198.899 382.393L197.763 379.065L196.817 379.388L195.87 379.711L197.006 383.039L197.953 382.716ZM216.715 387.004L217.609 386.557L217.603 386.545L217.596 386.532L216.715 387.004ZM216.634 387.404L215.927 386.697L215.927 386.697L216.634 387.404ZM212.346 387.388L211.81 388.232L211.826 388.242L211.843 388.252L212.346 387.388ZM212.09 387.1L211.177 387.506L211.18 387.514L212.09 387.1ZM210.683 383.932L211.596 383.526L211.332 382.932H210.683V383.932ZM209.339 383.932V382.932H208.339V383.932H209.339ZM209.211 387.372L208.503 386.665V386.665L209.211 387.372ZM214.187 376.764L213.789 377.682L213.794 377.684L214.187 376.764ZM215.851 378.108L215.014 378.656H215.014L215.851 378.108ZM214.746 383.324L214.244 382.459L213.409 382.944L213.865 383.796L214.746 383.324ZM211.882 380.748L212.642 381.399L212.653 381.386L212.663 381.373L211.882 380.748ZM211.882 379.548L211.043 380.091L211.062 380.12L211.083 380.148L211.882 379.548ZM209.339 379.276V378.276H208.339V379.276H209.339ZM209.339 380.972H208.339V381.972H209.339V380.972ZM216.715 387.004L215.82 387.451C215.764 387.339 215.746 387.231 215.746 387.148H216.746H217.746C217.746 386.958 217.708 386.754 217.609 386.557L216.715 387.004ZM216.746 387.148H215.746C215.746 387.062 215.764 386.971 215.802 386.883C215.84 386.797 215.888 386.736 215.927 386.697L216.634 387.404L217.342 388.111C217.583 387.869 217.746 387.537 217.746 387.148H216.746ZM216.634 387.404L215.927 386.697C215.986 386.638 216.063 386.584 216.155 386.548C216.246 386.511 216.33 386.5 216.395 386.5V387.5V388.5C216.738 388.5 217.078 388.375 217.342 388.111L216.634 387.404ZM216.395 387.5V386.5H212.762V387.5V388.5H216.395V387.5ZM212.762 387.5V386.5C212.772 386.5 212.788 386.501 212.806 386.506C212.825 386.511 212.84 386.518 212.85 386.524L212.346 387.388L211.843 388.252C212.125 388.416 212.438 388.5 212.762 388.5V387.5ZM212.346 387.388L212.883 386.544C212.896 386.553 212.918 386.569 212.942 386.596C212.966 386.623 212.986 386.654 213.001 386.686L212.09 387.1L211.18 387.514C211.32 387.822 211.542 388.062 211.81 388.232L212.346 387.388ZM212.09 387.1L213.004 386.694L211.596 383.526L210.683 383.932L209.769 384.338L211.177 387.506L212.09 387.1ZM210.683 383.932V382.932H209.339V383.932V384.932H210.683V383.932ZM209.339 383.932H208.339V387.068H209.339H210.339V383.932H209.339ZM209.339 387.068H208.339C208.339 387.002 208.351 386.924 208.385 386.844C208.418 386.764 208.464 386.705 208.503 386.665L209.211 387.372L209.918 388.079C210.184 387.812 210.339 387.459 210.339 387.068H209.339ZM209.211 387.372L208.503 386.665C208.543 386.625 208.603 386.58 208.682 386.546C208.763 386.513 208.841 386.5 208.907 386.5V387.5V388.5C209.297 388.5 209.651 388.346 209.918 388.079L209.211 387.372ZM208.907 387.5V386.5H205.451V387.5V388.5H208.907V387.5ZM205.451 387.5V386.5C205.516 386.5 205.594 386.513 205.675 386.546C205.754 386.58 205.814 386.625 205.854 386.665L205.146 387.372L204.439 388.079C204.706 388.346 205.06 388.5 205.451 388.5V387.5ZM205.146 387.372L205.854 386.665C205.893 386.705 205.939 386.764 205.972 386.844C206.006 386.924 206.019 387.002 206.019 387.068H205.019H204.019C204.019 387.459 204.173 387.812 204.439 388.079L205.146 387.372ZM205.019 387.068H206.019V376.732H205.019H204.019V387.068H205.019ZM205.019 376.732H206.019C206.019 376.798 206.006 376.876 205.972 376.956C205.939 377.036 205.893 377.095 205.854 377.135L205.146 376.428L204.439 375.721C204.173 375.988 204.019 376.341 204.019 376.732H205.019ZM205.146 376.428L205.854 377.135C205.814 377.175 205.754 377.22 205.675 377.254C205.594 377.287 205.516 377.3 205.451 377.3V376.3V375.3C205.06 375.3 204.706 375.454 204.439 375.721L205.146 376.428ZM205.451 376.3V377.3H211.674V376.3V375.3H205.451V376.3ZM211.674 376.3V377.3C212.529 377.3 213.226 377.438 213.789 377.682L214.187 376.764L214.584 375.846C213.718 375.472 212.74 375.3 211.674 375.3V376.3ZM214.187 376.764L213.794 377.684C214.361 377.926 214.751 378.254 215.014 378.656L215.851 378.108L216.687 377.56C216.182 376.788 215.462 376.221 214.579 375.844L214.187 376.764ZM215.851 378.108L215.014 378.656C215.278 379.06 215.426 379.552 215.426 380.172H216.426H217.426C217.426 379.213 217.191 378.33 216.687 377.56L215.851 378.108ZM216.426 380.172H215.426C215.426 381.318 215.014 382.012 214.244 382.459L214.746 383.324L215.249 384.189C216.719 383.335 217.426 381.927 217.426 380.172H216.426ZM214.746 383.324L213.865 383.796L215.833 387.476L216.715 387.004L217.596 386.532L215.628 382.852L214.746 383.324ZM211.339 380.972V381.972C211.803 381.972 212.287 381.813 212.642 381.399L211.882 380.748L211.123 380.097C211.162 380.052 211.214 380.014 211.27 379.991C211.321 379.97 211.35 379.972 211.339 379.972V380.972ZM211.882 380.748L212.663 381.373C212.953 381.01 213.075 380.583 213.075 380.156H212.075H211.075C211.075 380.182 211.071 380.185 211.075 380.171C211.077 380.165 211.081 380.157 211.086 380.148C211.091 380.138 211.096 380.13 211.102 380.123L211.882 380.748ZM212.075 380.156H213.075C213.075 379.728 212.953 379.309 212.683 378.948L211.882 379.548L211.083 380.148C211.081 380.146 211.079 380.143 211.077 380.139C211.075 380.135 211.074 380.132 211.073 380.129C211.072 380.127 211.072 380.127 211.073 380.131C211.074 380.135 211.075 380.143 211.075 380.156H212.075ZM211.882 379.548L212.722 379.005C212.393 378.496 211.869 378.276 211.339 378.276V379.276V380.276C211.338 380.276 211.286 380.276 211.211 380.238C211.132 380.199 211.075 380.14 211.043 380.091L211.882 379.548ZM211.339 379.276V378.276H209.339V379.276V380.276H211.339V379.276ZM209.339 379.276H208.339V380.972H209.339H210.339V379.276H209.339ZM209.339 380.972V381.972H211.339V380.972V379.972H209.339V380.972ZM228.228 377.468L227.642 378.278L227.646 378.281L228.228 377.468ZM228.244 386.364L228.823 387.179L228.825 387.178L228.244 386.364ZM225.172 384.028L225.804 384.803L225.807 384.801L225.172 384.028ZM225.172 379.788L224.524 380.549L224.539 380.562L224.554 380.574L225.172 379.788ZM222.532 379.42V378.42H221.532V379.42H222.532ZM222.532 384.38H221.532V385.38H222.532V384.38ZM223.908 376.3V377.3C225.574 377.3 226.787 377.66 227.642 378.278L228.228 377.468L228.814 376.658C227.515 375.719 225.848 375.3 223.908 375.3V376.3ZM228.228 377.468L227.646 378.281C228.413 378.83 228.86 379.695 228.86 381.084H229.86H230.86C230.86 379.209 230.219 377.663 228.81 376.655L228.228 377.468ZM229.86 381.084H228.86V382.716H229.86H230.86V381.084H229.86ZM229.86 382.716H228.86C228.86 384.15 228.41 385.018 227.664 385.55L228.244 386.364L228.825 387.178C230.233 386.174 230.86 384.61 230.86 382.716H229.86ZM228.244 386.364L227.665 385.549C226.823 386.147 225.604 386.5 223.908 386.5V387.5V388.5C225.86 388.5 227.532 388.096 228.823 387.179L228.244 386.364ZM223.908 387.5V386.5H218.804V387.5V388.5H223.908V387.5ZM218.804 387.5V386.5C218.87 386.5 218.948 386.513 219.028 386.546C219.108 386.58 219.168 386.625 219.207 386.665L218.5 387.372L217.793 388.079C218.06 388.346 218.413 388.5 218.804 388.5V387.5ZM218.5 387.372L219.207 386.665C219.247 386.705 219.292 386.764 219.326 386.844C219.36 386.924 219.372 387.002 219.372 387.068H218.372H217.372C217.372 387.459 217.526 387.812 217.793 388.079L218.5 387.372ZM218.372 387.068H219.372V376.732H218.372H217.372V387.068H218.372ZM218.372 376.732H219.372C219.372 376.798 219.36 376.876 219.326 376.956C219.292 377.036 219.247 377.095 219.207 377.135L218.5 376.428L217.793 375.721C217.526 375.988 217.372 376.341 217.372 376.732H218.372ZM218.5 376.428L219.207 377.135C219.168 377.175 219.108 377.22 219.028 377.254C218.948 377.287 218.87 377.3 218.804 377.3V376.3V375.3C218.413 375.3 218.06 375.454 217.793 375.721L218.5 376.428ZM218.804 376.3V377.3H223.908V376.3V375.3H218.804V376.3ZM223.988 384.38V385.38C224.639 385.38 225.284 385.227 225.804 384.803L225.172 384.028L224.541 383.253C224.485 383.298 224.34 383.38 223.988 383.38V384.38ZM225.172 384.028L225.807 384.801C226.369 384.339 226.62 383.696 226.62 383.004H225.62H224.62C224.62 383.186 224.573 383.226 224.538 383.255L225.172 384.028ZM225.62 383.004H226.62V380.796H225.62H224.62V383.004H225.62ZM225.62 380.796H226.62C226.62 380.104 226.368 379.456 225.79 379.002L225.172 379.788L224.554 380.574C224.58 380.594 224.588 380.608 224.594 380.622C224.603 380.64 224.62 380.691 224.62 380.796H225.62ZM225.172 379.788L225.821 379.027C225.3 378.583 224.649 378.42 223.988 378.42V379.42V380.42C224.33 380.42 224.468 380.502 224.524 380.549L225.172 379.788ZM223.988 379.42V378.42H222.532V379.42V380.42H223.988V379.42ZM222.532 379.42H221.532V384.38H222.532H223.532V379.42H222.532ZM222.532 384.38V385.38H223.988V384.38V383.38H222.532V384.38ZM253.24 376.732L252.366 376.246L252.362 376.253L253.24 376.732ZM257.16 376.428L257.867 375.721L257.867 375.721L257.16 376.428ZM257.16 387.372L257.867 388.079V388.079L257.16 387.372ZM253.528 382.108H254.528L252.636 381.656L253.528 382.108ZM252.36 384.412L251.468 383.96L251.453 383.989L251.441 384.018L252.36 384.412ZM252.136 384.668L252.769 385.442V385.442L252.136 384.668ZM250.152 384.668L249.519 385.442L249.519 385.442L250.152 384.668ZM249.928 384.412L250.847 384.018L250.834 383.989L250.82 383.96L249.928 384.412ZM248.76 382.108L249.652 381.656L247.76 382.108H248.76ZM248.632 387.372L247.925 386.665V386.665L248.632 387.372ZM249.048 376.732L249.926 376.253L249.922 376.246L249.048 376.732ZM251.144 380.572L250.266 381.051L251.144 382.659L252.021 381.051L251.144 380.572ZM253.24 376.732L254.114 377.218C254.13 377.189 254.119 377.22 254.064 377.255C254.037 377.272 254.008 377.284 253.98 377.292C253.953 377.299 253.934 377.3 253.928 377.3V376.3V375.3C253.222 375.3 252.68 375.681 252.366 376.246L253.24 376.732ZM253.928 376.3V377.3H256.856V376.3V375.3H253.928V376.3ZM256.856 376.3V377.3C256.79 377.3 256.712 377.287 256.632 377.254C256.552 377.22 256.492 377.175 256.453 377.135L257.16 376.428L257.867 375.721C257.6 375.454 257.247 375.3 256.856 375.3V376.3ZM257.16 376.428L256.453 377.135C256.413 377.095 256.368 377.036 256.334 376.956C256.3 376.876 256.288 376.798 256.288 376.732H257.288H258.288C258.288 376.341 258.134 375.988 257.867 375.721L257.16 376.428ZM257.288 376.732H256.288V387.068H257.288H258.288V376.732H257.288ZM257.288 387.068H256.288C256.288 387.002 256.3 386.924 256.334 386.844C256.368 386.764 256.413 386.705 256.453 386.665L257.16 387.372L257.867 388.079C258.134 387.812 258.288 387.459 258.288 387.068H257.288ZM257.16 387.372L256.453 386.665C256.492 386.625 256.552 386.58 256.632 386.546C256.712 386.513 256.79 386.5 256.856 386.5V387.5V388.5C257.247 388.5 257.6 388.346 257.867 388.079L257.16 387.372ZM256.856 387.5V386.5H253.96V387.5V388.5H256.856V387.5ZM253.96 387.5V386.5C254.025 386.5 254.104 386.513 254.184 386.546C254.264 386.58 254.323 386.625 254.363 386.665L253.656 387.372L252.949 388.079C253.216 388.346 253.569 388.5 253.96 388.5V387.5ZM253.656 387.372L254.363 386.665C254.403 386.705 254.448 386.764 254.481 386.844C254.515 386.924 254.528 387.002 254.528 387.068H253.528H252.528C252.528 387.459 252.682 387.812 252.949 388.079L253.656 387.372ZM253.528 387.068H254.528V382.108H253.528H252.528V387.068H253.528ZM253.528 382.108L252.636 381.656L251.468 383.96L252.36 384.412L253.252 384.864L254.42 382.56L253.528 382.108ZM252.36 384.412L251.441 384.018C251.461 383.972 251.481 383.937 251.496 383.915C251.51 383.893 251.522 383.879 251.527 383.873C251.536 383.863 251.532 383.87 251.503 383.894L252.136 384.668L252.769 385.442C252.921 385.318 253.15 385.107 253.279 384.806L252.36 384.412ZM252.136 384.668L251.503 383.894C251.544 383.86 251.589 383.837 251.63 383.824C251.668 383.812 251.69 383.812 251.688 383.812V384.812V385.812C252.053 385.812 252.44 385.711 252.769 385.442L252.136 384.668ZM251.688 384.812V383.812H250.6V384.812V385.812H251.688V384.812ZM250.6 384.812V383.812C250.597 383.812 250.619 383.812 250.658 383.824C250.698 383.837 250.743 383.86 250.785 383.894L250.152 384.668L249.519 385.442C249.848 385.711 250.235 385.812 250.6 385.812V384.812ZM250.152 384.668L250.785 383.894C250.756 383.87 250.751 383.863 250.76 383.873C250.765 383.879 250.777 383.893 250.792 383.915C250.806 383.937 250.827 383.972 250.847 384.018L249.928 384.412L249.009 384.806C249.138 385.107 249.367 385.318 249.519 385.442L250.152 384.668ZM249.928 384.412L250.82 383.96L249.652 381.656L248.76 382.108L247.868 382.56L249.036 384.864L249.928 384.412ZM248.76 382.108H247.76V387.068H248.76H249.76V382.108H248.76ZM248.76 387.068H247.76C247.76 387.002 247.772 386.924 247.806 386.844C247.84 386.764 247.885 386.705 247.925 386.665L248.632 387.372L249.339 388.079C249.606 387.812 249.76 387.459 249.76 387.068H248.76ZM248.632 387.372L247.925 386.665C247.964 386.625 248.024 386.58 248.104 386.546C248.184 386.513 248.262 386.5 248.328 386.5V387.5V388.5C248.719 388.5 249.072 388.346 249.339 388.079L248.632 387.372ZM248.328 387.5V386.5H245.432V387.5V388.5H248.328V387.5ZM245.432 387.5V386.5C245.497 386.5 245.576 386.513 245.656 386.546C245.736 386.58 245.795 386.625 245.835 386.665L245.128 387.372L244.421 388.079C244.688 388.346 245.041 388.5 245.432 388.5V387.5ZM245.128 387.372L245.835 386.665C245.875 386.705 245.92 386.764 245.953 386.844C245.987 386.924 246 387.002 246 387.068H245H244C244 387.459 244.154 387.812 244.421 388.079L245.128 387.372ZM245 387.068H246V376.732H245H244V387.068H245ZM245 376.732H246C246 376.798 245.987 376.876 245.953 376.956C245.92 377.036 245.875 377.095 245.835 377.135L245.128 376.428L244.421 375.721C244.154 375.988 244 376.341 244 376.732H245ZM245.128 376.428L245.835 377.135C245.795 377.175 245.736 377.22 245.656 377.254C245.576 377.287 245.497 377.3 245.432 377.3V376.3V375.3C245.041 375.3 244.688 375.454 244.421 375.721L245.128 376.428ZM245.432 376.3V377.3H248.36V376.3V375.3H245.432V376.3ZM248.36 376.3V377.3C248.354 377.3 248.335 377.299 248.308 377.292C248.28 377.284 248.251 377.272 248.224 377.255C248.168 377.22 248.158 377.189 248.174 377.218L249.048 376.732L249.922 376.246C249.608 375.681 249.065 375.3 248.36 375.3V376.3ZM249.048 376.732L248.17 377.211L250.266 381.051L251.144 380.572L252.021 380.093L249.926 376.253L249.048 376.732ZM251.144 380.572L252.021 381.051L254.118 377.211L253.24 376.732L252.362 376.253L250.266 380.093L251.144 380.572ZM269.057 386.492L268.475 385.679L268.472 385.682L269.057 386.492ZM260.402 386.492L259.816 387.302L259.82 387.305L260.402 386.492ZM259.553 378.252L258.742 377.667L258.741 377.67L259.553 378.252ZM261.682 376.652L261.326 375.718L261.682 376.652ZM267.777 376.652L267.418 377.585L267.422 377.586L267.777 376.652ZM269.906 378.236L269.098 378.826V378.826L269.906 378.236ZM263.538 384.188L262.906 384.963L262.913 384.969L262.92 384.974L263.538 384.188ZM265.921 384.188L266.553 384.963L266.556 384.961L265.921 384.188ZM265.921 379.628L265.273 380.389L265.288 380.402L265.304 380.414L265.921 379.628ZM263.538 379.612L262.92 378.826L262.913 378.831L262.906 378.837L263.538 379.612ZM270.689 382.876H269.689C269.689 384.265 269.242 385.13 268.476 385.679L269.057 386.492L269.639 387.305C271.049 386.297 271.689 384.751 271.689 382.876H270.689ZM269.057 386.492L268.472 385.682C267.616 386.3 266.403 386.66 264.738 386.66V387.66V388.66C266.677 388.66 268.344 388.241 269.643 387.302L269.057 386.492ZM264.738 387.66V386.66C263.072 386.66 261.852 386.3 260.983 385.679L260.402 386.492L259.82 387.305C261.127 388.241 262.797 388.66 264.738 388.66V387.66ZM260.402 386.492L260.987 385.682C260.234 385.137 259.786 384.264 259.786 382.844H258.786H257.786C257.786 384.731 258.415 386.29 259.816 387.302L260.402 386.492ZM258.786 382.844H259.786V380.956H258.786H257.786V382.844H258.786ZM258.786 380.956H259.786C259.786 380.027 260.002 379.342 260.366 378.834L259.553 378.252L258.741 377.67C258.081 378.591 257.786 379.709 257.786 380.956H258.786ZM259.553 378.252L260.365 378.837C260.765 378.282 261.31 377.863 262.037 377.586L261.682 376.652L261.326 375.718C260.261 376.123 259.388 376.772 258.742 377.667L259.553 378.252ZM261.682 376.652L262.037 377.586C262.8 377.296 263.695 377.14 264.738 377.14V376.14V375.14C263.497 375.14 262.355 375.325 261.326 375.718L261.682 376.652ZM264.738 376.14V377.14C265.78 377.14 266.668 377.296 267.418 377.585L267.777 376.652L268.137 375.719C267.116 375.325 265.978 375.14 264.738 375.14V376.14ZM267.777 376.652L267.422 377.586C268.153 377.865 268.699 378.28 269.098 378.826L269.906 378.236L270.713 377.646C270.067 376.762 269.194 376.122 268.133 375.718L267.777 376.652ZM269.906 378.236L269.098 378.826C269.471 379.335 269.689 380.012 269.689 380.924H270.689H271.689C271.689 379.681 271.386 378.566 270.713 377.646L269.906 378.236ZM270.689 380.924H269.689V382.876H270.689H271.689V380.924H270.689ZM263.105 383.18H262.105C262.105 383.859 262.342 384.504 262.906 384.963L263.538 384.188L264.169 383.413C264.148 383.396 264.14 383.383 264.133 383.366C264.123 383.344 264.105 383.289 264.105 383.18H263.105ZM263.538 384.188L262.92 384.974C263.444 385.386 264.084 385.54 264.738 385.54V384.54V383.54C264.388 383.54 264.229 383.459 264.155 383.402L263.538 384.188ZM264.738 384.54V385.54C265.389 385.54 266.033 385.387 266.553 384.963L265.921 384.188L265.29 383.413C265.234 383.458 265.089 383.54 264.738 383.54V384.54ZM265.921 384.188L266.556 384.961C267.118 384.499 267.37 383.856 267.37 383.164H266.37H265.37C265.37 383.346 265.322 383.386 265.287 383.415L265.921 384.188ZM266.37 383.164H267.37V380.636H266.37H265.37V383.164H266.37ZM266.37 380.636H267.37C267.37 379.944 267.118 379.296 266.539 378.842L265.921 379.628L265.304 380.414C265.329 380.434 265.337 380.448 265.344 380.462C265.352 380.48 265.37 380.531 265.37 380.636H266.37ZM265.921 379.628L266.57 378.867C266.049 378.423 265.398 378.26 264.738 378.26V379.26V380.26C265.079 380.26 265.218 380.342 265.273 380.389L265.921 379.628ZM264.738 379.26V378.26C264.084 378.26 263.444 378.414 262.92 378.826L263.538 379.612L264.155 380.398C264.229 380.341 264.388 380.26 264.738 380.26V379.26ZM263.538 379.612L262.906 378.837C262.342 379.296 262.105 379.941 262.105 380.62H263.105H264.105C264.105 380.511 264.123 380.456 264.133 380.434C264.14 380.417 264.148 380.404 264.169 380.387L263.538 379.612ZM263.105 380.62H262.105V383.18H263.105H264.105V380.62H263.105ZM282.603 377.468L282.017 378.278L282.021 378.281L282.603 377.468ZM282.619 386.364L283.198 387.179L283.2 387.178L282.619 386.364ZM279.547 384.028L280.179 384.803L280.182 384.801L279.547 384.028ZM279.547 379.788L278.899 380.549L278.914 380.562L278.929 380.574L279.547 379.788ZM276.907 379.42V378.42H275.907V379.42H276.907ZM276.907 384.38H275.907V385.38H276.907V384.38ZM278.283 376.3V377.3C279.949 377.3 281.162 377.66 282.017 378.278L282.603 377.468L283.189 376.658C281.89 375.719 280.223 375.3 278.283 375.3V376.3ZM282.603 377.468L282.021 378.281C282.788 378.83 283.235 379.695 283.235 381.084H284.235H285.235C285.235 379.209 284.594 377.663 283.185 376.655L282.603 377.468ZM284.235 381.084H283.235V382.716H284.235H285.235V381.084H284.235ZM284.235 382.716H283.235C283.235 384.15 282.785 385.018 282.039 385.55L282.619 386.364L283.2 387.178C284.608 386.174 285.235 384.61 285.235 382.716H284.235ZM282.619 386.364L282.04 385.549C281.198 386.147 279.979 386.5 278.283 386.5V387.5V388.5C280.235 388.5 281.907 388.096 283.198 387.179L282.619 386.364ZM278.283 387.5V386.5H273.179V387.5V388.5H278.283V387.5ZM273.179 387.5V386.5C273.245 386.5 273.323 386.513 273.403 386.546C273.483 386.58 273.543 386.625 273.582 386.665L272.875 387.372L272.168 388.079C272.435 388.346 272.788 388.5 273.179 388.5V387.5ZM272.875 387.372L273.582 386.665C273.622 386.705 273.667 386.764 273.701 386.844C273.735 386.924 273.747 387.002 273.747 387.068H272.747H271.747C271.747 387.459 271.901 387.812 272.168 388.079L272.875 387.372ZM272.747 387.068H273.747V376.732H272.747H271.747V387.068H272.747ZM272.747 376.732H273.747C273.747 376.798 273.735 376.876 273.701 376.956C273.667 377.036 273.622 377.095 273.582 377.135L272.875 376.428L272.168 375.721C271.901 375.988 271.747 376.341 271.747 376.732H272.747ZM272.875 376.428L273.582 377.135C273.543 377.175 273.483 377.22 273.403 377.254C273.323 377.287 273.245 377.3 273.179 377.3V376.3V375.3C272.788 375.3 272.435 375.454 272.168 375.721L272.875 376.428ZM273.179 376.3V377.3H278.283V376.3V375.3H273.179V376.3ZM278.363 384.38V385.38C279.014 385.38 279.659 385.227 280.179 384.803L279.547 384.028L278.916 383.253C278.86 383.298 278.715 383.38 278.363 383.38V384.38ZM279.547 384.028L280.182 384.801C280.744 384.339 280.995 383.696 280.995 383.004H279.995H278.995C278.995 383.186 278.948 383.226 278.913 383.255L279.547 384.028ZM279.995 383.004H280.995V380.796H279.995H278.995V383.004H279.995ZM279.995 380.796H280.995C280.995 380.104 280.743 379.456 280.165 379.002L279.547 379.788L278.929 380.574C278.955 380.594 278.963 380.608 278.969 380.622C278.978 380.64 278.995 380.691 278.995 380.796H279.995ZM279.547 379.788L280.196 379.027C279.675 378.583 279.024 378.42 278.363 378.42V379.42V380.42C278.705 380.42 278.843 380.502 278.899 380.549L279.547 379.788ZM278.363 379.42V378.42H276.907V379.42V380.42H278.363V379.42ZM276.907 379.42H275.907V384.38H276.907H277.907V379.42H276.907ZM276.907 384.38V385.38H278.363V384.38V383.38H276.907V384.38ZM297.413 384.508L296.706 385.215V385.215L297.413 384.508ZM297.413 387.372L296.706 386.665L296.706 386.665L297.413 387.372ZM297.253 376.428L296.546 377.135V377.135L297.253 376.428ZM297.253 379.292L296.546 378.585V378.585L297.253 379.292ZM290.725 379.42V378.42H289.725V379.42H290.725ZM290.725 380.428H289.725V381.428H290.725V380.428ZM296.373 380.556L295.666 381.263V381.263L296.373 380.556ZM296.373 383.244L295.666 382.537V382.537L296.373 383.244ZM290.725 383.372V382.372H289.725V383.372H290.725ZM290.725 384.38H289.725V385.38H290.725V384.38ZM297.109 384.38V385.38C297.043 385.38 296.965 385.367 296.885 385.334C296.805 385.3 296.746 385.255 296.706 385.215L297.413 384.508L298.12 383.801C297.853 383.534 297.5 383.38 297.109 383.38V384.38ZM297.413 384.508L296.706 385.215C296.666 385.175 296.621 385.116 296.587 385.036C296.554 384.956 296.541 384.878 296.541 384.812H297.541H298.541C298.541 384.421 298.387 384.068 298.12 383.801L297.413 384.508ZM297.541 384.812H296.541V387.068H297.541H298.541V384.812H297.541ZM297.541 387.068H296.541C296.541 387.002 296.554 386.924 296.587 386.844C296.621 386.764 296.666 386.705 296.706 386.665L297.413 387.372L298.12 388.079C298.387 387.812 298.541 387.459 298.541 387.068H297.541ZM297.413 387.372L296.706 386.665C296.746 386.625 296.805 386.58 296.885 386.546C296.965 386.513 297.043 386.5 297.109 386.5V387.5V388.5C297.5 388.5 297.853 388.346 298.12 388.079L297.413 387.372ZM297.109 387.5V386.5H286.997V387.5V388.5H297.109V387.5ZM286.997 387.5V386.5C287.063 386.5 287.141 386.513 287.221 386.546C287.301 386.58 287.36 386.625 287.4 386.665L286.693 387.372L285.986 388.079C286.253 388.346 286.606 388.5 286.997 388.5V387.5ZM286.693 387.372L287.4 386.665C287.44 386.705 287.485 386.764 287.519 386.844C287.552 386.924 287.565 387.002 287.565 387.068H286.565H285.565C285.565 387.459 285.719 387.812 285.986 388.079L286.693 387.372ZM286.565 387.068H287.565V376.732H286.565H285.565V387.068H286.565ZM286.565 376.732H287.565C287.565 376.798 287.552 376.876 287.519 376.956C287.485 377.036 287.44 377.095 287.4 377.135L286.693 376.428L285.986 375.721C285.719 375.988 285.565 376.341 285.565 376.732H286.565ZM286.693 376.428L287.4 377.135C287.36 377.175 287.301 377.22 287.221 377.254C287.141 377.287 287.063 377.3 286.997 377.3V376.3V375.3C286.606 375.3 286.253 375.454 285.986 375.721L286.693 376.428ZM286.997 376.3V377.3H296.949V376.3V375.3H286.997V376.3ZM296.949 376.3V377.3C296.883 377.3 296.805 377.287 296.725 377.254C296.645 377.22 296.586 377.175 296.546 377.135L297.253 376.428L297.96 375.721C297.693 375.454 297.34 375.3 296.949 375.3V376.3ZM297.253 376.428L296.546 377.135C296.506 377.095 296.461 377.036 296.427 376.956C296.394 376.876 296.381 376.798 296.381 376.732H297.381H298.381C298.381 376.341 298.227 375.988 297.96 375.721L297.253 376.428ZM297.381 376.732H296.381V378.988H297.381H298.381V376.732H297.381ZM297.381 378.988H296.381C296.381 378.922 296.394 378.844 296.427 378.764C296.461 378.684 296.506 378.625 296.546 378.585L297.253 379.292L297.96 379.999C298.227 379.732 298.381 379.379 298.381 378.988H297.381ZM297.253 379.292L296.546 378.585C296.586 378.545 296.645 378.5 296.725 378.466C296.805 378.433 296.883 378.42 296.949 378.42V379.42V380.42C297.34 380.42 297.693 380.266 297.96 379.999L297.253 379.292ZM296.949 379.42V378.42H290.725V379.42V380.42H296.949V379.42ZM290.725 379.42H289.725V380.428H290.725H291.725V379.42H290.725ZM290.725 380.428V381.428H296.069V380.428V379.428H290.725V380.428ZM296.069 380.428V381.428C296.003 381.428 295.925 381.415 295.845 381.382C295.765 381.348 295.706 381.303 295.666 381.263L296.373 380.556L297.08 379.849C296.813 379.582 296.46 379.428 296.069 379.428V380.428ZM296.373 380.556L295.666 381.263C295.626 381.223 295.581 381.164 295.547 381.084C295.514 381.004 295.501 380.926 295.501 380.86H296.501H297.501C297.501 380.469 297.347 380.116 297.08 379.849L296.373 380.556ZM296.501 380.86H295.501V382.94H296.501H297.501V380.86H296.501ZM296.501 382.94H295.501C295.501 382.874 295.514 382.796 295.547 382.716C295.581 382.636 295.626 382.577 295.666 382.537L296.373 383.244L297.08 383.951C297.347 383.684 297.501 383.331 297.501 382.94H296.501ZM296.373 383.244L295.666 382.537C295.706 382.497 295.765 382.452 295.845 382.418C295.925 382.385 296.003 382.372 296.069 382.372V383.372V384.372C296.46 384.372 296.813 384.218 297.08 383.951L296.373 383.244ZM296.069 383.372V382.372H290.725V383.372V384.372H296.069V383.372ZM290.725 383.372H289.725V384.38H290.725H291.725V383.372H290.725ZM290.725 384.38V385.38H297.109V384.38V383.38H290.725V384.38Z" fill="black" mask="url(#path-14224-outside-5_2_177825)"/>
</g>
<g filter="url(#filter7_d_2_177825)">
<path d="M343 387.086V377.914C343 377.023 344.077 376.577 344.707 377.207L349.293 381.793C349.683 382.183 349.683 382.817 349.293 383.207L344.707 387.793C344.077 388.423 343 387.977 343 387.086Z" fill="white"/>
<path d="M343 387.086V377.914C343 377.023 344.077 376.577 344.707 377.207L349.293 381.793C349.683 382.183 349.683 382.817 349.293 383.207L344.707 387.793C344.077 388.423 343 387.977 343 387.086Z" stroke="black" stroke-linejoin="round"/>
</g>
</g>
<g filter="url(#filter8_d_2_177825)">
<rect x="23" y="463" width="356" height="99" rx="8" fill="#4946EF" shape-rendering="crispEdges"/>
<rect x="24" y="464" width="354" height="97" rx="7" stroke="#1C1D21" stroke-width="2" shape-rendering="crispEdges"/>
<path d="M75.1234 483.645C75.1234 484.925 73.4964 485.824 72.785 486.179C70.651 486.713 65.7427 487.886 63.1818 488.313C59.9808 488.847 58.3802 485.112 59.4472 482.978C60.5143 480.844 62.1148 479.244 65.3159 478.71C68.5169 478.177 71.718 478.177 73.3185 478.71C74.9191 479.244 75.1234 482.045 75.1234 483.645Z" fill="#FFBF38"/>
<ellipse cx="67.9514" cy="485.795" rx="7.20699" ry="2.97483" transform="rotate(-12.2569 67.9514 485.795)" fill="#D78428"/>
<rect x="70.629" y="483.645" width="7.63548" height="5.33512" rx="2" transform="rotate(73.2547 70.629 483.645)" fill="#FFBF38"/>
<ellipse cx="73.8642" cy="515.719" rx="29.2079" ry="29.3218" transform="rotate(-3.33518 73.8642 515.719)" fill="#B12A2E"/>
<ellipse cx="75.6128" cy="514.575" rx="27.7847" ry="28.3536" transform="rotate(-3.33518 75.6128 514.575)" fill="#F462AC"/>
<ellipse cx="75.6179" cy="514.129" rx="20.7318" ry="20.9081" transform="rotate(-3.33518 75.6179 514.129)" fill="#FFD9E3"/>
<path d="M74.4011 493.256C85.8316 492.59 95.6424 501.395 96.3142 512.923C96.787 521.037 92.6051 528.338 86.1003 532.181C90.7761 528.079 93.583 521.914 93.1912 515.188C92.5194 503.661 82.7085 494.855 71.2781 495.521C67.893 495.719 64.7458 496.725 62.0095 498.343C65.3479 495.413 69.6389 493.533 74.4011 493.256Z" fill="#B12A2E"/>
<path d="M65.6448 526.872C67.0228 520.451 71.0236 506.942 76.8549 509.755C84.197 513.296 72.5366 523.357 67.2181 527.79C66.5055 528.384 65.4501 527.779 65.6448 526.872Z" fill="#B100FF"/>
<path d="M45.1345 498.471L43.6223 496.959C43.318 496.655 43.2435 496.192 43.4567 495.818C43.927 494.993 44.8793 493.441 46.3137 491.648C47.8303 489.752 49.6162 488.395 50.5228 487.769C50.8727 487.527 51.3342 487.562 51.661 487.834L53.5482 489.407C53.9725 489.761 54.0298 490.391 53.6762 490.815L51.6489 493.248L53.5198 494.745C53.9571 495.095 54.0219 495.736 53.6633 496.166L52.2764 497.83C51.9278 498.249 51.3086 498.311 50.8834 497.971L48.9813 496.449L46.4818 498.532C46.0845 498.863 45.5002 498.837 45.1345 498.471Z" fill="#FFBF38"/>
<path d="M65.3156 478.71L65.2334 478.217L65.2333 478.217L65.3156 478.71ZM73.3185 478.71L73.4766 478.236L73.4766 478.236L73.3185 478.71ZM75.1232 483.645H75.6232V483.645L75.1232 483.645ZM72.7853 486.179L72.9065 486.664C72.9419 486.655 72.9763 486.643 73.0089 486.626L72.7853 486.179ZM71.4972 486.493L71.3792 486.008C71.1257 486.069 70.9621 486.315 71.0035 486.573C71.0449 486.83 71.2774 487.013 71.5374 486.992L71.4972 486.493ZM71.9728 486.459L72.005 486.958C72.016 486.958 72.027 486.956 72.0379 486.955L71.9728 486.459ZM73.963 486.27L73.9339 485.771L73.9339 485.771L73.963 486.27ZM103.351 512.958L103.85 512.929V512.929L103.351 512.958ZM102.152 523.053L101.674 522.907C101.672 522.914 101.67 522.922 101.668 522.929L102.152 523.053ZM75.5704 544.991L75.5995 545.49H75.5995L75.5704 544.991ZM44.7062 517.418L44.207 517.447L44.207 517.447L44.7062 517.418ZM50.7111 497.832L51.1078 498.137C51.2735 497.921 51.2359 497.612 51.0233 497.442L50.7111 497.832ZM48.9816 496.45L49.2938 496.059C49.1083 495.911 48.844 495.913 48.6615 496.065L48.9816 496.45ZM46.4816 498.533L46.8015 498.917L46.8016 498.917L46.4816 498.533ZM45.1349 498.471L45.4884 498.117L45.4883 498.117L45.1349 498.471ZM43.6222 496.959L43.2686 497.313L43.2688 497.313L43.6222 496.959ZM43.4572 495.818L43.0228 495.57L43.0228 495.57L43.4572 495.818ZM46.3136 491.648L45.9232 491.335L45.9232 491.335L46.3136 491.648ZM50.5226 487.769L50.2383 487.358L50.2383 487.358L50.5226 487.769ZM51.6613 487.834L51.3412 488.218V488.218L51.6613 487.834ZM53.548 489.407L53.2279 489.791V489.791L53.548 489.407ZM53.6759 490.816L54.06 491.136L54.06 491.136L53.6759 490.816ZM51.6486 493.248L51.2645 492.928C51.1785 493.031 51.1376 493.165 51.1511 493.299C51.1646 493.432 51.2313 493.555 51.3362 493.639L51.6486 493.248ZM53.4767 494.711L53.1643 495.102C53.3616 495.26 53.6458 495.245 53.8264 495.069L53.4767 494.711ZM63.6954 488.219L63.8697 488.688C64.1126 488.597 64.2462 488.337 64.1776 488.087C64.109 487.837 63.8609 487.681 63.606 487.727L63.6954 488.219ZM63.1818 488.313L63.264 488.806L63.264 488.806L63.1818 488.313ZM59.4474 482.978L59.0002 482.754L59.0002 482.754L59.4474 482.978ZM65.3156 478.71L65.3978 479.203C66.9733 478.941 68.5463 478.81 69.9172 478.81C71.299 478.81 72.4361 478.943 73.1604 479.185L73.3185 478.71L73.4766 478.236C72.6003 477.944 71.3365 477.81 69.9172 477.81C68.487 477.81 66.8589 477.946 65.2334 478.217L65.3156 478.71ZM73.3185 478.71L73.1604 479.185C73.7028 479.365 74.0939 479.967 74.337 480.903C74.572 481.808 74.6232 482.857 74.6232 483.645L75.1232 483.645L75.6232 483.645C75.6232 482.832 75.5722 481.681 75.3049 480.652C75.0458 479.654 74.5346 478.589 73.4766 478.236L73.3185 478.71ZM75.1232 483.645H74.6232C74.6232 484.066 74.3522 484.484 73.8938 484.881C73.447 485.267 72.9082 485.559 72.5617 485.732L72.7853 486.179L73.0089 486.626C73.3738 486.444 74.0041 486.108 74.5483 485.637C75.0809 485.175 75.6232 484.504 75.6232 483.645H75.1232ZM72.7853 486.179L72.664 485.694C72.3074 485.783 71.8721 485.888 71.3792 486.008L71.4972 486.493L71.6152 486.979C72.1048 486.86 72.5456 486.754 72.9065 486.664L72.7853 486.179ZM71.4972 486.493L71.5374 486.992C71.6922 486.979 71.8479 486.968 72.005 486.958L71.9728 486.459L71.9406 485.96C71.7798 485.971 71.6185 485.982 71.457 485.995L71.4972 486.493ZM71.9728 486.459L72.0379 486.955C72.6825 486.87 73.334 486.807 73.9921 486.769L73.963 486.27L73.9339 485.771C73.2506 485.811 72.575 485.876 71.9077 485.964L71.9728 486.459ZM73.963 486.27L73.9921 486.769C89.0259 485.893 101.956 497.621 102.852 512.987L103.351 512.958L103.85 512.929C102.923 497.031 89.538 484.861 73.9339 485.771L73.963 486.27ZM103.351 512.958L102.852 512.987C103.053 516.444 102.625 519.789 101.674 522.907L102.152 523.053L102.631 523.199C103.615 519.969 104.058 516.507 103.85 512.929L103.351 512.958ZM102.152 523.053L101.668 522.929C98.6393 534.732 88.3098 543.747 75.5413 544.491L75.5704 544.991L75.5995 545.49C88.817 544.719 99.5036 535.387 102.637 523.177L102.152 523.053ZM75.5704 544.991L75.5413 544.491C59.7152 545.414 46.1317 533.282 45.2053 517.389L44.7062 517.418L44.207 517.447C45.1653 533.888 59.2184 546.444 75.5995 545.49L75.5704 544.991ZM44.7062 517.418L45.2053 517.389C44.7853 510.181 47.0403 503.439 51.1078 498.137L50.7111 497.832L50.3143 497.528C46.106 503.014 43.7725 509.991 44.207 517.447L44.7062 517.418ZM50.7111 497.832L51.0233 497.442L49.2938 496.059L48.9816 496.45L48.6693 496.84L50.3988 498.223L50.7111 497.832ZM48.9816 496.45L48.6615 496.065L46.1615 498.148L46.4816 498.533L46.8016 498.917L49.3016 496.834L48.9816 496.45ZM46.4816 498.533L46.1616 498.148C45.9632 498.314 45.6714 498.3 45.4884 498.117L45.1349 498.471L44.7814 498.825C45.3296 499.373 46.2054 499.413 46.8015 498.917L46.4816 498.533ZM45.1349 498.471L45.4883 498.117L43.9756 496.606L43.6222 496.959L43.2688 497.313L44.7814 498.825L45.1349 498.471ZM43.6222 496.959L43.9757 496.606C43.8222 496.452 43.7957 496.233 43.8915 496.065L43.4572 495.818L43.0228 495.57C42.6922 496.15 42.8134 496.858 43.2686 497.313L43.6222 496.959ZM43.4572 495.818L43.8915 496.065C44.3521 495.257 45.2897 493.728 46.704 491.96L46.3136 491.648L45.9232 491.335C44.4689 493.153 43.5028 494.728 43.0228 495.57L43.4572 495.818ZM46.3136 491.648L46.704 491.96C48.1779 490.118 49.9202 488.793 50.8068 488.18L50.5226 487.769L50.2383 487.358C49.3116 487.998 47.4821 489.387 45.9232 491.335L46.3136 491.648ZM50.5226 487.769L50.8068 488.18C50.96 488.074 51.1755 488.08 51.3412 488.218L51.6613 487.834L51.9813 487.45C51.4936 487.044 50.7849 486.98 50.2383 487.358L50.5226 487.769ZM51.6613 487.834L51.3412 488.218L53.2279 489.791L53.548 489.407L53.8681 489.022L51.9813 487.45L51.6613 487.834ZM53.548 489.407L53.2279 489.791C53.4399 489.967 53.4687 490.283 53.2918 490.496L53.6759 490.816L54.06 491.136C54.5903 490.5 54.5046 489.553 53.8681 489.022L53.548 489.407ZM53.6759 490.816L53.2918 490.496L51.2645 492.928L51.6486 493.248L52.0327 493.568L54.06 491.136L53.6759 490.816ZM51.6486 493.248L51.3362 493.639L53.1643 495.102L53.4767 494.711L53.7891 494.321L51.961 492.858L51.6486 493.248ZM53.4767 494.711L53.8264 495.069C56.659 492.296 60.0674 490.102 63.8697 488.688L63.6954 488.219L63.5212 487.75C59.5848 489.214 56.0575 491.485 53.1269 494.354L53.4767 494.711ZM63.6954 488.219L63.606 487.727C63.4144 487.762 63.2581 487.793 63.0996 487.82L63.1818 488.313L63.264 488.806C63.4303 488.778 63.6164 488.742 63.7849 488.711L63.6954 488.219ZM63.1818 488.313L63.0996 487.82C61.7411 488.046 60.7278 487.383 60.145 486.392C59.5466 485.375 59.4511 484.088 59.8946 483.201L59.4474 482.978L59.0002 482.754C58.3767 484.001 58.5478 485.649 59.2831 486.899C60.0339 488.176 61.4214 489.113 63.264 488.806L63.1818 488.313ZM59.4474 482.978L59.8946 483.201C60.4056 482.18 61.0307 481.312 61.8902 480.637C62.748 479.963 63.8669 479.459 65.3978 479.203L65.3156 478.71L65.2333 478.217C63.5635 478.495 62.2818 479.058 61.2724 479.851C60.2648 480.642 59.5562 481.642 59.0002 482.754L59.4474 482.978Z" fill="black"/>
<path d="M74.0563 528.46C82.3065 528.46 88.9946 522.011 88.9946 514.055C88.9946 506.1 82.3065 499.65 74.0563 499.65" stroke="#3892FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<g filter="url(#filter9_d_2_177825)">
<mask id="path-14240-outside-6_2_177825" maskUnits="userSpaceOnUse" x="121" y="504.5" width="123" height="15" fill="black">
<rect fill="white" x="121" y="504.5" width="123" height="15"/>
<path d="M129.68 510.364C130.853 510.492 131.792 510.7 132.496 510.988C133.211 511.276 133.728 511.655 134.048 512.124C134.368 512.593 134.528 513.18 134.528 513.884C134.528 514.652 134.277 515.324 133.776 515.9C133.285 516.465 132.603 516.903 131.728 517.212C130.853 517.511 129.856 517.66 128.736 517.66C127.488 517.66 126.432 517.505 125.568 517.196C124.704 516.887 124.059 516.476 123.632 515.964C123.205 515.441 122.992 514.871 122.992 514.252C122.992 514.145 123.024 514.06 123.088 513.996C123.163 513.932 123.253 513.9 123.36 513.9H126.64C126.864 513.9 127.045 513.969 127.184 514.108C127.365 514.279 127.568 514.396 127.792 514.46C128.016 514.513 128.331 514.54 128.736 514.54C129.749 514.54 130.256 514.385 130.256 514.076C130.256 513.948 130.187 513.841 130.048 513.756C129.92 513.66 129.685 513.58 129.344 513.516C129.013 513.441 128.523 513.367 127.872 513.292C126.411 513.121 125.291 512.759 124.512 512.204C123.733 511.639 123.344 510.844 123.344 509.82C123.344 509.095 123.563 508.455 124 507.9C124.437 507.345 125.056 506.913 125.856 506.604C126.667 506.295 127.605 506.14 128.672 506.14C129.781 506.14 130.752 506.316 131.584 506.668C132.416 507.009 133.051 507.436 133.488 507.948C133.925 508.46 134.144 508.961 134.144 509.452C134.144 509.559 134.107 509.644 134.032 509.708C133.968 509.772 133.877 509.804 133.76 509.804H130.32C130.139 509.804 129.973 509.74 129.824 509.612C129.707 509.505 129.568 509.42 129.408 509.356C129.248 509.292 129.003 509.26 128.672 509.26C127.957 509.26 127.6 509.409 127.6 509.708C127.6 509.868 127.739 509.996 128.016 510.092C128.293 510.177 128.848 510.268 129.68 510.364ZM144.026 506.3C145.028 506.3 145.903 506.471 146.65 506.812C147.396 507.153 147.967 507.617 148.362 508.204C148.756 508.791 148.954 509.447 148.954 510.172C148.954 511.367 148.58 512.305 147.834 512.988C147.087 513.66 145.818 513.996 144.026 513.996H141.914V517.068C141.914 517.185 141.871 517.287 141.786 517.372C141.7 517.457 141.599 517.5 141.482 517.5H138.042C137.924 517.5 137.823 517.457 137.738 517.372C137.652 517.287 137.61 517.185 137.61 517.068V506.732C137.61 506.615 137.652 506.513 137.738 506.428C137.823 506.343 137.924 506.3 138.042 506.3H144.026ZM143.962 511.036C144.218 511.036 144.42 510.961 144.57 510.812C144.719 510.652 144.794 510.444 144.794 510.188C144.794 509.921 144.719 509.703 144.57 509.532C144.42 509.361 144.218 509.276 143.962 509.276H141.93V511.036H143.962ZM161.172 514.38C161.289 514.38 161.39 514.423 161.476 514.508C161.561 514.593 161.604 514.695 161.604 514.812V517.068C161.604 517.185 161.561 517.287 161.476 517.372C161.39 517.457 161.289 517.5 161.172 517.5H151.06C150.942 517.5 150.841 517.457 150.756 517.372C150.67 517.287 150.628 517.185 150.628 517.068V506.732C150.628 506.615 150.67 506.513 150.756 506.428C150.841 506.343 150.942 506.3 151.06 506.3H161.012C161.129 506.3 161.23 506.343 161.316 506.428C161.401 506.513 161.444 506.615 161.444 506.732V508.988C161.444 509.105 161.401 509.207 161.316 509.292C161.23 509.377 161.129 509.42 161.012 509.42H154.788V510.428H160.132C160.249 510.428 160.35 510.471 160.436 510.556C160.521 510.641 160.564 510.743 160.564 510.86V512.94C160.564 513.057 160.521 513.159 160.436 513.244C160.35 513.329 160.249 513.372 160.132 513.372H154.788V514.38H161.172ZM174.765 514.38C174.883 514.38 174.984 514.423 175.069 514.508C175.155 514.593 175.197 514.695 175.197 514.812V517.068C175.197 517.185 175.155 517.287 175.069 517.372C174.984 517.457 174.883 517.5 174.765 517.5H164.653C164.536 517.5 164.435 517.457 164.349 517.372C164.264 517.287 164.221 517.185 164.221 517.068V506.732C164.221 506.615 164.264 506.513 164.349 506.428C164.435 506.343 164.536 506.3 164.653 506.3H174.605C174.723 506.3 174.824 506.343 174.909 506.428C174.995 506.513 175.037 506.615 175.037 506.732V508.988C175.037 509.105 174.995 509.207 174.909 509.292C174.824 509.377 174.723 509.42 174.605 509.42H168.381V510.428H173.725C173.843 510.428 173.944 510.471 174.029 510.556C174.115 510.641 174.157 510.743 174.157 510.86V512.94C174.157 513.057 174.115 513.159 174.029 513.244C173.944 513.329 173.843 513.372 173.725 513.372H168.381V514.38H174.765ZM183.127 506.3C184.93 506.3 186.37 506.689 187.447 507.468C188.535 508.247 189.079 509.452 189.079 511.084V512.716C189.079 514.38 188.54 515.596 187.463 516.364C186.396 517.121 184.951 517.5 183.127 517.5H178.023C177.906 517.5 177.804 517.457 177.719 517.372C177.634 517.287 177.591 517.185 177.591 517.068V506.732C177.591 506.615 177.634 506.513 177.719 506.428C177.804 506.343 177.906 506.3 178.023 506.3H183.127ZM183.207 514.38C183.708 514.38 184.103 514.263 184.391 514.028C184.69 513.783 184.839 513.441 184.839 513.004V510.796C184.839 510.359 184.69 510.023 184.391 509.788C184.103 509.543 183.708 509.42 183.207 509.42H181.751V514.38H183.207ZM216.715 517.004C216.736 517.047 216.747 517.095 216.747 517.148C216.747 517.244 216.709 517.329 216.635 517.404C216.571 517.468 216.491 517.5 216.395 517.5H212.763C212.613 517.5 212.475 517.463 212.347 517.388C212.229 517.313 212.144 517.217 212.091 517.1L210.683 513.932H209.339V517.068C209.339 517.185 209.296 517.287 209.211 517.372C209.125 517.457 209.024 517.5 208.907 517.5H205.451C205.333 517.5 205.232 517.457 205.147 517.372C205.061 517.287 205.019 517.185 205.019 517.068V506.732C205.019 506.615 205.061 506.513 205.147 506.428C205.232 506.343 205.333 506.3 205.451 506.3H211.675C212.635 506.3 213.472 506.455 214.187 506.764C214.912 507.073 215.467 507.521 215.851 508.108C216.235 508.695 216.427 509.383 216.427 510.172C216.427 511.623 215.867 512.673 214.747 513.324L216.715 517.004ZM211.339 510.972C211.573 510.972 211.755 510.897 211.883 510.748C212.011 510.588 212.075 510.391 212.075 510.156C212.075 509.921 212.011 509.719 211.883 509.548C211.765 509.367 211.584 509.276 211.339 509.276H209.339V510.972H211.339ZM223.956 517.66C222.164 517.66 220.74 517.271 219.684 516.492C218.639 515.713 218.116 514.497 218.116 512.844V506.732C218.116 506.615 218.159 506.513 218.244 506.428C218.33 506.343 218.431 506.3 218.548 506.3H221.892C222.01 506.3 222.111 506.343 222.196 506.428C222.282 506.513 222.324 506.615 222.324 506.732V513.1C222.324 513.537 222.468 513.873 222.756 514.108C223.055 514.343 223.455 514.46 223.956 514.46C224.458 514.46 224.852 514.343 225.14 514.108C225.439 513.873 225.588 513.537 225.588 513.1V506.732C225.588 506.615 225.631 506.513 225.716 506.428C225.802 506.343 225.903 506.3 226.02 506.3H229.364C229.482 506.3 229.583 506.343 229.668 506.428C229.754 506.513 229.796 506.615 229.796 506.732V512.844C229.796 514.497 229.268 515.713 228.212 516.492C227.167 517.271 225.748 517.66 223.956 517.66ZM242.558 506.3C242.675 506.3 242.777 506.343 242.862 506.428C242.947 506.513 242.99 506.615 242.99 506.732V517.068C242.99 517.185 242.947 517.287 242.862 517.372C242.777 517.457 242.675 517.5 242.558 517.5H239.982C239.726 517.5 239.513 517.388 239.342 517.164L235.854 512.716V517.068C235.854 517.185 235.811 517.287 235.726 517.372C235.641 517.457 235.539 517.5 235.422 517.5H232.446C232.329 517.5 232.227 517.457 232.142 517.372C232.057 517.287 232.014 517.185 232.014 517.068V506.732C232.014 506.615 232.057 506.513 232.142 506.428C232.227 506.343 232.329 506.3 232.446 506.3H235.038C235.294 506.3 235.502 506.407 235.662 506.62L239.15 511.436V506.732C239.15 506.615 239.193 506.513 239.278 506.428C239.363 506.343 239.465 506.3 239.582 506.3H242.558Z"/>
</mask>
<path d="M129.68 510.364C130.853 510.492 131.792 510.7 132.496 510.988C133.211 511.276 133.728 511.655 134.048 512.124C134.368 512.593 134.528 513.18 134.528 513.884C134.528 514.652 134.277 515.324 133.776 515.9C133.285 516.465 132.603 516.903 131.728 517.212C130.853 517.511 129.856 517.66 128.736 517.66C127.488 517.66 126.432 517.505 125.568 517.196C124.704 516.887 124.059 516.476 123.632 515.964C123.205 515.441 122.992 514.871 122.992 514.252C122.992 514.145 123.024 514.06 123.088 513.996C123.163 513.932 123.253 513.9 123.36 513.9H126.64C126.864 513.9 127.045 513.969 127.184 514.108C127.365 514.279 127.568 514.396 127.792 514.46C128.016 514.513 128.331 514.54 128.736 514.54C129.749 514.54 130.256 514.385 130.256 514.076C130.256 513.948 130.187 513.841 130.048 513.756C129.92 513.66 129.685 513.58 129.344 513.516C129.013 513.441 128.523 513.367 127.872 513.292C126.411 513.121 125.291 512.759 124.512 512.204C123.733 511.639 123.344 510.844 123.344 509.82C123.344 509.095 123.563 508.455 124 507.9C124.437 507.345 125.056 506.913 125.856 506.604C126.667 506.295 127.605 506.14 128.672 506.14C129.781 506.14 130.752 506.316 131.584 506.668C132.416 507.009 133.051 507.436 133.488 507.948C133.925 508.46 134.144 508.961 134.144 509.452C134.144 509.559 134.107 509.644 134.032 509.708C133.968 509.772 133.877 509.804 133.76 509.804H130.32C130.139 509.804 129.973 509.74 129.824 509.612C129.707 509.505 129.568 509.42 129.408 509.356C129.248 509.292 129.003 509.26 128.672 509.26C127.957 509.26 127.6 509.409 127.6 509.708C127.6 509.868 127.739 509.996 128.016 510.092C128.293 510.177 128.848 510.268 129.68 510.364ZM144.026 506.3C145.028 506.3 145.903 506.471 146.65 506.812C147.396 507.153 147.967 507.617 148.362 508.204C148.756 508.791 148.954 509.447 148.954 510.172C148.954 511.367 148.58 512.305 147.834 512.988C147.087 513.66 145.818 513.996 144.026 513.996H141.914V517.068C141.914 517.185 141.871 517.287 141.786 517.372C141.7 517.457 141.599 517.5 141.482 517.5H138.042C137.924 517.5 137.823 517.457 137.738 517.372C137.652 517.287 137.61 517.185 137.61 517.068V506.732C137.61 506.615 137.652 506.513 137.738 506.428C137.823 506.343 137.924 506.3 138.042 506.3H144.026ZM143.962 511.036C144.218 511.036 144.42 510.961 144.57 510.812C144.719 510.652 144.794 510.444 144.794 510.188C144.794 509.921 144.719 509.703 144.57 509.532C144.42 509.361 144.218 509.276 143.962 509.276H141.93V511.036H143.962ZM161.172 514.38C161.289 514.38 161.39 514.423 161.476 514.508C161.561 514.593 161.604 514.695 161.604 514.812V517.068C161.604 517.185 161.561 517.287 161.476 517.372C161.39 517.457 161.289 517.5 161.172 517.5H151.06C150.942 517.5 150.841 517.457 150.756 517.372C150.67 517.287 150.628 517.185 150.628 517.068V506.732C150.628 506.615 150.67 506.513 150.756 506.428C150.841 506.343 150.942 506.3 151.06 506.3H161.012C161.129 506.3 161.23 506.343 161.316 506.428C161.401 506.513 161.444 506.615 161.444 506.732V508.988C161.444 509.105 161.401 509.207 161.316 509.292C161.23 509.377 161.129 509.42 161.012 509.42H154.788V510.428H160.132C160.249 510.428 160.35 510.471 160.436 510.556C160.521 510.641 160.564 510.743 160.564 510.86V512.94C160.564 513.057 160.521 513.159 160.436 513.244C160.35 513.329 160.249 513.372 160.132 513.372H154.788V514.38H161.172ZM174.765 514.38C174.883 514.38 174.984 514.423 175.069 514.508C175.155 514.593 175.197 514.695 175.197 514.812V517.068C175.197 517.185 175.155 517.287 175.069 517.372C174.984 517.457 174.883 517.5 174.765 517.5H164.653C164.536 517.5 164.435 517.457 164.349 517.372C164.264 517.287 164.221 517.185 164.221 517.068V506.732C164.221 506.615 164.264 506.513 164.349 506.428C164.435 506.343 164.536 506.3 164.653 506.3H174.605C174.723 506.3 174.824 506.343 174.909 506.428C174.995 506.513 175.037 506.615 175.037 506.732V508.988C175.037 509.105 174.995 509.207 174.909 509.292C174.824 509.377 174.723 509.42 174.605 509.42H168.381V510.428H173.725C173.843 510.428 173.944 510.471 174.029 510.556C174.115 510.641 174.157 510.743 174.157 510.86V512.94C174.157 513.057 174.115 513.159 174.029 513.244C173.944 513.329 173.843 513.372 173.725 513.372H168.381V514.38H174.765ZM183.127 506.3C184.93 506.3 186.37 506.689 187.447 507.468C188.535 508.247 189.079 509.452 189.079 511.084V512.716C189.079 514.38 188.54 515.596 187.463 516.364C186.396 517.121 184.951 517.5 183.127 517.5H178.023C177.906 517.5 177.804 517.457 177.719 517.372C177.634 517.287 177.591 517.185 177.591 517.068V506.732C177.591 506.615 177.634 506.513 177.719 506.428C177.804 506.343 177.906 506.3 178.023 506.3H183.127ZM183.207 514.38C183.708 514.38 184.103 514.263 184.391 514.028C184.69 513.783 184.839 513.441 184.839 513.004V510.796C184.839 510.359 184.69 510.023 184.391 509.788C184.103 509.543 183.708 509.42 183.207 509.42H181.751V514.38H183.207ZM216.715 517.004C216.736 517.047 216.747 517.095 216.747 517.148C216.747 517.244 216.709 517.329 216.635 517.404C216.571 517.468 216.491 517.5 216.395 517.5H212.763C212.613 517.5 212.475 517.463 212.347 517.388C212.229 517.313 212.144 517.217 212.091 517.1L210.683 513.932H209.339V517.068C209.339 517.185 209.296 517.287 209.211 517.372C209.125 517.457 209.024 517.5 208.907 517.5H205.451C205.333 517.5 205.232 517.457 205.147 517.372C205.061 517.287 205.019 517.185 205.019 517.068V506.732C205.019 506.615 205.061 506.513 205.147 506.428C205.232 506.343 205.333 506.3 205.451 506.3H211.675C212.635 506.3 213.472 506.455 214.187 506.764C214.912 507.073 215.467 507.521 215.851 508.108C216.235 508.695 216.427 509.383 216.427 510.172C216.427 511.623 215.867 512.673 214.747 513.324L216.715 517.004ZM211.339 510.972C211.573 510.972 211.755 510.897 211.883 510.748C212.011 510.588 212.075 510.391 212.075 510.156C212.075 509.921 212.011 509.719 211.883 509.548C211.765 509.367 211.584 509.276 211.339 509.276H209.339V510.972H211.339ZM223.956 517.66C222.164 517.66 220.74 517.271 219.684 516.492C218.639 515.713 218.116 514.497 218.116 512.844V506.732C218.116 506.615 218.159 506.513 218.244 506.428C218.33 506.343 218.431 506.3 218.548 506.3H221.892C222.01 506.3 222.111 506.343 222.196 506.428C222.282 506.513 222.324 506.615 222.324 506.732V513.1C222.324 513.537 222.468 513.873 222.756 514.108C223.055 514.343 223.455 514.46 223.956 514.46C224.458 514.46 224.852 514.343 225.14 514.108C225.439 513.873 225.588 513.537 225.588 513.1V506.732C225.588 506.615 225.631 506.513 225.716 506.428C225.802 506.343 225.903 506.3 226.02 506.3H229.364C229.482 506.3 229.583 506.343 229.668 506.428C229.754 506.513 229.796 506.615 229.796 506.732V512.844C229.796 514.497 229.268 515.713 228.212 516.492C227.167 517.271 225.748 517.66 223.956 517.66ZM242.558 506.3C242.675 506.3 242.777 506.343 242.862 506.428C242.947 506.513 242.99 506.615 242.99 506.732V517.068C242.99 517.185 242.947 517.287 242.862 517.372C242.777 517.457 242.675 517.5 242.558 517.5H239.982C239.726 517.5 239.513 517.388 239.342 517.164L235.854 512.716V517.068C235.854 517.185 235.811 517.287 235.726 517.372C235.641 517.457 235.539 517.5 235.422 517.5H232.446C232.329 517.5 232.227 517.457 232.142 517.372C232.057 517.287 232.014 517.185 232.014 517.068V506.732C232.014 506.615 232.057 506.513 232.142 506.428C232.227 506.343 232.329 506.3 232.446 506.3H235.038C235.294 506.3 235.502 506.407 235.662 506.62L239.15 511.436V506.732C239.15 506.615 239.193 506.513 239.278 506.428C239.363 506.343 239.465 506.3 239.582 506.3H242.558Z" fill="white"/>
<path d="M129.68 510.364L129.565 511.357L129.572 511.358L129.68 510.364ZM132.496 510.988L132.117 511.914L132.122 511.916L132.496 510.988ZM134.048 512.124L133.222 512.687V512.687L134.048 512.124ZM133.776 515.9L133.022 515.243L133.021 515.245L133.776 515.9ZM131.728 517.212L132.051 518.158L132.061 518.155L131.728 517.212ZM125.568 517.196L125.231 518.137V518.137L125.568 517.196ZM123.632 515.964L122.857 516.596L122.864 516.604L123.632 515.964ZM123.088 513.996L122.437 513.237L122.408 513.262L122.381 513.289L123.088 513.996ZM127.184 514.108L126.477 514.815L126.488 514.826L126.499 514.836L127.184 514.108ZM127.792 514.46L127.517 515.422L127.539 515.428L127.56 515.433L127.792 514.46ZM130.048 513.756L129.448 514.556L129.485 514.584L129.524 514.608L130.048 513.756ZM129.344 513.516L129.124 514.491L129.142 514.495L129.16 514.499L129.344 513.516ZM127.872 513.292L127.756 514.285L127.758 514.285L127.872 513.292ZM124.512 512.204L123.924 513.013L123.932 513.018L124.512 512.204ZM124 507.9L123.215 507.281H123.215L124 507.9ZM125.856 506.604L125.499 505.67L125.495 505.671L125.856 506.604ZM131.584 506.668L131.194 507.589L131.204 507.593L131.584 506.668ZM133.488 507.948L132.728 508.597L132.728 508.597L133.488 507.948ZM134.032 509.708L133.381 508.949L133.352 508.974L133.325 509.001L134.032 509.708ZM129.824 509.612L129.151 510.352L129.162 510.362L129.173 510.371L129.824 509.612ZM129.408 509.356L129.037 510.284L129.037 510.284L129.408 509.356ZM128.016 510.092L127.689 511.037L127.705 511.043L127.722 511.048L128.016 510.092ZM129.68 510.364L129.572 511.358C130.697 511.481 131.534 511.675 132.117 511.914L132.496 510.988L132.875 510.062C132.05 509.725 131.009 509.503 129.788 509.37L129.68 510.364ZM132.496 510.988L132.122 511.916C132.717 512.155 133.047 512.43 133.222 512.687L134.048 512.124L134.874 511.561C134.409 510.879 133.704 510.397 132.87 510.06L132.496 510.988ZM134.048 512.124L133.222 512.687C133.404 512.955 133.528 513.333 133.528 513.884H134.528H135.528C135.528 513.027 135.332 512.232 134.874 511.561L134.048 512.124ZM134.528 513.884H133.528C133.528 514.412 133.364 514.851 133.022 515.243L133.776 515.9L134.53 516.557C135.191 515.797 135.528 514.892 135.528 513.884H134.528ZM133.776 515.9L133.021 515.245C132.668 515.651 132.145 516.004 131.395 516.269L131.728 517.212L132.061 518.155C133.061 517.801 133.903 517.279 134.531 516.555L133.776 515.9ZM131.728 517.212L131.405 516.266C130.654 516.522 129.769 516.66 128.736 516.66V517.66V518.66C129.943 518.66 131.053 518.499 132.051 518.158L131.728 517.212ZM128.736 517.66V516.66C127.564 516.66 126.63 516.514 125.905 516.255L125.568 517.196L125.231 518.137C126.234 518.497 127.412 518.66 128.736 518.66V517.66ZM125.568 517.196L125.905 516.255C125.148 515.984 124.677 515.656 124.4 515.324L123.632 515.964L122.864 516.604C123.44 517.296 124.26 517.79 125.231 518.137L125.568 517.196ZM123.632 515.964L124.407 515.332C124.112 514.97 123.992 514.619 123.992 514.252H122.992H121.992C121.992 515.123 122.299 515.912 122.857 516.596L123.632 515.964ZM122.992 514.252H123.992C123.992 514.299 123.985 514.372 123.952 514.459C123.919 514.549 123.865 514.633 123.795 514.703L123.088 513.996L122.381 513.289C122.096 513.574 121.992 513.931 121.992 514.252H122.992ZM123.088 513.996L123.739 514.755C123.685 514.802 123.619 514.841 123.545 514.867C123.472 514.893 123.408 514.9 123.36 514.9V513.9V512.9C123.036 512.9 122.709 513.004 122.437 513.237L123.088 513.996ZM123.36 513.9V514.9H126.64V513.9V512.9H123.36V513.9ZM126.64 513.9V514.9C126.648 514.9 126.626 514.901 126.587 514.886C126.545 514.87 126.506 514.844 126.477 514.815L127.184 514.108L127.891 513.401C127.538 513.048 127.088 512.9 126.64 512.9V513.9ZM127.184 514.108L126.499 514.836C126.788 515.109 127.129 515.311 127.517 515.422L127.792 514.46L128.067 513.498C128.007 513.481 127.943 513.449 127.869 513.38L127.184 514.108ZM127.792 514.46L127.56 515.433C127.897 515.513 128.302 515.54 128.736 515.54V514.54V513.54C128.359 513.54 128.135 513.514 128.024 513.487L127.792 514.46ZM128.736 514.54V515.54C129.269 515.54 129.769 515.502 130.168 515.38C130.5 515.279 131.256 514.946 131.256 514.076H130.256H129.256C129.256 513.973 129.278 513.864 129.327 513.761C129.374 513.66 129.435 513.588 129.486 513.542C129.576 513.459 129.638 513.451 129.584 513.468C129.476 513.501 129.217 513.54 128.736 513.54V514.54ZM130.256 514.076H131.256C131.256 513.505 130.914 513.115 130.572 512.904L130.048 513.756L129.524 514.608C129.501 514.594 129.431 514.546 129.366 514.445C129.294 514.335 129.256 514.204 129.256 514.076H130.256ZM130.048 513.756L130.648 512.956C130.321 512.71 129.884 512.6 129.528 512.533L129.344 513.516L129.16 514.499C129.3 514.525 129.395 514.551 129.453 514.571C129.467 514.575 129.477 514.579 129.485 514.582C129.488 514.583 129.491 514.585 129.493 514.585C129.494 514.586 129.494 514.586 129.495 514.586C129.495 514.586 129.495 514.587 129.495 514.587C129.495 514.587 129.495 514.587 129.495 514.587C129.495 514.587 129.495 514.587 129.495 514.587C129.495 514.587 129.495 514.586 129.495 514.586C129.494 514.586 129.493 514.586 129.493 514.585C129.491 514.584 129.488 514.583 129.484 514.58C129.476 514.576 129.464 514.568 129.448 514.556L130.048 513.756ZM129.344 513.516L129.564 512.541C129.18 512.454 128.646 512.374 127.986 512.299L127.872 513.292L127.758 514.285C128.399 514.359 128.847 514.429 129.124 514.491L129.344 513.516ZM127.872 513.292L127.988 512.299C126.612 512.138 125.679 511.808 125.092 511.39L124.512 512.204L123.932 513.018C124.902 513.71 126.21 514.105 127.756 514.285L127.872 513.292ZM124.512 512.204L125.1 511.395C124.599 511.031 124.344 510.548 124.344 509.82H123.344H122.344C122.344 511.14 122.868 512.246 123.924 513.013L124.512 512.204ZM123.344 509.82H124.344C124.344 509.313 124.491 508.892 124.785 508.519L124 507.9L123.215 507.281C122.634 508.017 122.344 508.877 122.344 509.82H123.344ZM124 507.9L124.785 508.519C125.09 508.132 125.548 507.795 126.217 507.537L125.856 506.604L125.495 505.671C124.564 506.031 123.785 506.558 123.215 507.281L124 507.9ZM125.856 506.604L126.213 507.538C126.887 507.281 127.7 507.14 128.672 507.14V506.14V505.14C127.511 505.14 126.447 505.308 125.499 505.67L125.856 506.604ZM128.672 506.14V507.14C129.677 507.14 130.51 507.3 131.194 507.589L131.584 506.668L131.974 505.747C130.994 505.332 129.886 505.14 128.672 505.14V506.14ZM131.584 506.668L131.204 507.593C131.937 507.894 132.422 508.24 132.728 508.597L133.488 507.948L134.248 507.299C133.679 506.632 132.895 506.125 131.964 505.743L131.584 506.668ZM133.488 507.948L132.728 508.597C133.068 508.996 133.144 509.275 133.144 509.452H134.144H135.144C135.144 508.647 134.783 507.924 134.248 507.299L133.488 507.948ZM134.144 509.452H133.144C133.144 509.387 133.156 509.296 133.2 509.195C133.245 509.092 133.311 509.009 133.381 508.949L134.032 509.708L134.683 510.467C134.999 510.196 135.144 509.823 135.144 509.452H134.144ZM134.032 509.708L133.325 509.001C133.499 508.826 133.694 508.804 133.76 508.804V509.804V510.804C134.061 510.804 134.437 510.718 134.739 510.415L134.032 509.708ZM133.76 509.804V508.804H130.32V509.804V510.804H133.76V509.804ZM130.32 509.804V508.804C130.35 508.804 130.386 508.81 130.421 508.823C130.455 508.837 130.473 508.851 130.475 508.853L129.824 509.612L129.173 510.371C129.487 510.64 129.879 510.804 130.32 510.804V509.804ZM129.824 509.612L130.497 508.872C130.284 508.678 130.041 508.532 129.779 508.428L129.408 509.356L129.037 510.284C129.095 510.308 129.13 510.332 129.151 510.352L129.824 509.612ZM129.408 509.356L129.779 508.428C129.437 508.291 129.035 508.26 128.672 508.26V509.26V510.26C128.807 510.26 128.906 510.267 128.975 510.276C129.047 510.285 129.06 510.294 129.037 510.284L129.408 509.356ZM128.672 509.26V508.26C128.275 508.26 127.847 508.297 127.482 508.449C127.29 508.53 127.065 508.663 126.885 508.888C126.693 509.13 126.6 509.417 126.6 509.708H127.6H128.6C128.6 509.85 128.552 510.006 128.449 510.136C128.358 510.249 128.267 510.289 128.254 510.295C128.239 510.301 128.261 510.29 128.341 510.278C128.417 510.268 128.526 510.26 128.672 510.26V509.26ZM127.6 509.708H126.6C126.6 510.581 127.372 510.927 127.689 511.037L128.016 510.092L128.343 509.147C128.27 509.122 128.31 509.122 128.382 509.189C128.424 509.227 128.481 509.292 128.527 509.388C128.575 509.488 128.6 509.598 128.6 509.708H127.6ZM128.016 510.092L127.722 511.048C128.101 511.164 128.746 511.263 129.565 511.357L129.68 510.364L129.795 509.371C128.95 509.273 128.486 509.19 128.31 509.136L128.016 510.092ZM147.834 512.988L148.503 513.731L148.509 513.726L147.834 512.988ZM141.914 513.996V512.996H140.914V513.996H141.914ZM141.786 517.372L142.493 518.079L142.493 518.079L141.786 517.372ZM144.57 510.812L145.277 511.519L145.289 511.507L145.301 511.494L144.57 510.812ZM144.57 509.532L145.322 508.873V508.873L144.57 509.532ZM141.93 509.276V508.276H140.93V509.276H141.93ZM141.93 511.036H140.93V512.036H141.93V511.036ZM144.026 506.3V507.3C144.916 507.3 145.643 507.451 146.234 507.721L146.65 506.812L147.066 505.903C146.163 505.49 145.141 505.3 144.026 505.3V506.3ZM146.65 506.812L146.234 507.721C146.84 507.999 147.256 508.352 147.532 508.762L148.362 508.204L149.191 507.646C148.678 506.883 147.952 506.308 147.066 505.903L146.65 506.812ZM148.362 508.204L147.532 508.762C147.813 509.179 147.954 509.64 147.954 510.172H148.954H149.954C149.954 509.253 149.7 508.402 149.191 507.646L148.362 508.204ZM148.954 510.172H147.954C147.954 511.141 147.661 511.791 147.159 512.25L147.834 512.988L148.509 513.726C149.5 512.819 149.954 511.592 149.954 510.172H148.954ZM147.834 512.988L147.165 512.245C146.7 512.663 145.746 512.996 144.026 512.996V513.996V514.996C145.89 514.996 147.474 514.657 148.503 513.731L147.834 512.988ZM144.026 513.996V512.996H141.914V513.996V514.996H144.026V513.996ZM141.914 513.996H140.914V517.068H141.914H142.914V513.996H141.914ZM141.914 517.068H140.914C140.914 517.002 140.926 516.924 140.96 516.844C140.994 516.764 141.039 516.705 141.079 516.665L141.786 517.372L142.493 518.079C142.76 517.812 142.914 517.459 142.914 517.068H141.914ZM141.786 517.372L141.079 516.665C141.118 516.625 141.178 516.58 141.258 516.546C141.338 516.513 141.416 516.5 141.482 516.5V517.5V518.5C141.873 518.5 142.226 518.346 142.493 518.079L141.786 517.372ZM141.482 517.5V516.5H138.042V517.5V518.5H141.482V517.5ZM138.042 517.5V516.5C138.107 516.5 138.186 516.513 138.266 516.546C138.346 516.58 138.405 516.625 138.445 516.665L137.738 517.372L137.031 518.079C137.298 518.346 137.651 518.5 138.042 518.5V517.5ZM137.738 517.372L138.445 516.665C138.485 516.705 138.53 516.764 138.563 516.844C138.597 516.924 138.61 517.002 138.61 517.068H137.61H136.61C136.61 517.459 136.764 517.812 137.031 518.079L137.738 517.372ZM137.61 517.068H138.61V506.732H137.61H136.61V517.068H137.61ZM137.61 506.732H138.61C138.61 506.798 138.597 506.876 138.563 506.956C138.53 507.036 138.485 507.095 138.445 507.135L137.738 506.428L137.031 505.721C136.764 505.988 136.61 506.341 136.61 506.732H137.61ZM137.738 506.428L138.445 507.135C138.405 507.175 138.346 507.22 138.266 507.254C138.186 507.287 138.107 507.3 138.042 507.3V506.3V505.3C137.651 505.3 137.298 505.454 137.031 505.721L137.738 506.428ZM138.042 506.3V507.3H144.026V506.3V505.3H138.042V506.3ZM143.962 511.036V512.036C144.423 512.036 144.901 511.895 145.277 511.519L144.57 510.812L143.863 510.105C143.876 510.091 143.893 510.078 143.911 510.066C143.929 510.055 143.946 510.047 143.96 510.042C143.988 510.031 143.993 510.036 143.962 510.036V511.036ZM144.57 510.812L145.301 511.494C145.652 511.118 145.794 510.651 145.794 510.188H144.794H143.794C143.794 510.219 143.789 510.218 143.797 510.198C143.8 510.188 143.806 510.176 143.814 510.163C143.822 510.15 143.83 510.139 143.839 510.13L144.57 510.812ZM144.794 510.188H145.794C145.794 509.724 145.658 509.258 145.322 508.873L144.57 509.532L143.817 510.191C143.812 510.184 143.806 510.176 143.801 510.168C143.796 510.159 143.793 510.152 143.791 510.147C143.788 510.138 143.794 510.148 143.794 510.188H144.794ZM144.57 509.532L145.322 508.873C144.957 508.456 144.465 508.276 143.962 508.276V509.276V510.276C143.978 510.276 143.958 510.278 143.918 510.262C143.875 510.244 143.839 510.216 143.817 510.191L144.57 509.532ZM143.962 509.276V508.276H141.93V509.276V510.276H143.962V509.276ZM141.93 509.276H140.93V511.036H141.93H142.93V509.276H141.93ZM141.93 511.036V512.036H143.962V511.036V510.036H141.93V511.036ZM161.476 514.508L160.768 515.215L160.768 515.215L161.476 514.508ZM161.476 517.372L160.768 516.665L160.768 516.665L161.476 517.372ZM161.315 506.428L160.608 507.135L160.608 507.135L161.315 506.428ZM161.315 509.292L160.608 508.585L160.608 508.585L161.315 509.292ZM154.787 509.42V508.42H153.788V509.42H154.787ZM154.787 510.428H153.788V511.428H154.787V510.428ZM160.436 510.556L159.728 511.263L159.728 511.263L160.436 510.556ZM160.436 513.244L159.728 512.537V512.537L160.436 513.244ZM154.787 513.372V512.372H153.788V513.372H154.787ZM154.787 514.38H153.788V515.38H154.787V514.38ZM161.172 514.38V515.38C161.106 515.38 161.028 515.367 160.947 515.334C160.868 515.3 160.808 515.255 160.768 515.215L161.476 514.508L162.183 513.801C161.916 513.534 161.562 513.38 161.172 513.38V514.38ZM161.476 514.508L160.768 515.215C160.729 515.175 160.683 515.116 160.65 515.036C160.616 514.956 160.604 514.878 160.604 514.812H161.604H162.604C162.604 514.421 162.449 514.068 162.183 513.801L161.476 514.508ZM161.604 514.812H160.604V517.068H161.604H162.604V514.812H161.604ZM161.604 517.068H160.604C160.604 517.002 160.616 516.924 160.65 516.844C160.683 516.764 160.729 516.705 160.768 516.665L161.476 517.372L162.183 518.079C162.449 517.812 162.604 517.459 162.604 517.068H161.604ZM161.476 517.372L160.768 516.665C160.808 516.625 160.868 516.58 160.947 516.546C161.028 516.513 161.106 516.5 161.172 516.5V517.5V518.5C161.562 518.5 161.916 518.346 162.183 518.079L161.476 517.372ZM161.172 517.5V516.5H151.059V517.5V518.5H161.172V517.5ZM151.059 517.5V516.5C151.125 516.5 151.203 516.513 151.284 516.546C151.363 516.58 151.423 516.625 151.463 516.665L150.756 517.372L150.048 518.079C150.315 518.346 150.669 518.5 151.059 518.5V517.5ZM150.756 517.372L151.463 516.665C151.502 516.705 151.548 516.764 151.581 516.844C151.615 516.924 151.628 517.002 151.628 517.068H150.628H149.628C149.628 517.459 149.782 517.812 150.048 518.079L150.756 517.372ZM150.628 517.068H151.628V506.732H150.628H149.628V517.068H150.628ZM150.628 506.732H151.628C151.628 506.798 151.615 506.876 151.581 506.956C151.548 507.036 151.502 507.095 151.463 507.135L150.756 506.428L150.048 505.721C149.782 505.988 149.628 506.341 149.628 506.732H150.628ZM150.756 506.428L151.463 507.135C151.423 507.175 151.363 507.22 151.284 507.254C151.203 507.287 151.125 507.3 151.059 507.3V506.3V505.3C150.669 505.3 150.315 505.454 150.048 505.721L150.756 506.428ZM151.059 506.3V507.3H161.012V506.3V505.3H151.059V506.3ZM161.012 506.3V507.3C160.946 507.3 160.868 507.287 160.787 507.254C160.708 507.22 160.648 507.175 160.608 507.135L161.315 506.428L162.023 505.721C161.756 505.454 161.402 505.3 161.012 505.3V506.3ZM161.315 506.428L160.608 507.135C160.569 507.095 160.523 507.036 160.49 506.956C160.456 506.876 160.444 506.798 160.444 506.732H161.444H162.444C162.444 506.341 162.289 505.988 162.023 505.721L161.315 506.428ZM161.444 506.732H160.444V508.988H161.444H162.444V506.732H161.444ZM161.444 508.988H160.444C160.444 508.922 160.456 508.844 160.49 508.764C160.523 508.684 160.569 508.625 160.608 508.585L161.315 509.292L162.023 509.999C162.289 509.732 162.444 509.379 162.444 508.988H161.444ZM161.315 509.292L160.608 508.585C160.648 508.545 160.708 508.5 160.787 508.466C160.868 508.433 160.946 508.42 161.012 508.42V509.42V510.42C161.402 510.42 161.756 510.266 162.023 509.999L161.315 509.292ZM161.012 509.42V508.42H154.787V509.42V510.42H161.012V509.42ZM154.787 509.42H153.788V510.428H154.787H155.787V509.42H154.787ZM154.787 510.428V511.428H160.132V510.428V509.428H154.787V510.428ZM160.132 510.428V511.428C160.066 511.428 159.988 511.415 159.907 511.382C159.828 511.348 159.768 511.303 159.728 511.263L160.436 510.556L161.143 509.849C160.876 509.582 160.522 509.428 160.132 509.428V510.428ZM160.436 510.556L159.728 511.263C159.689 511.223 159.643 511.164 159.61 511.084C159.576 511.004 159.563 510.926 159.563 510.86H160.563H161.563C161.563 510.469 161.409 510.116 161.143 509.849L160.436 510.556ZM160.563 510.86H159.563V512.94H160.563H161.563V510.86H160.563ZM160.563 512.94H159.563C159.563 512.874 159.576 512.796 159.61 512.716C159.643 512.636 159.689 512.577 159.728 512.537L160.436 513.244L161.143 513.951C161.409 513.684 161.563 513.331 161.563 512.94H160.563ZM160.436 513.244L159.728 512.537C159.768 512.497 159.828 512.452 159.907 512.418C159.988 512.385 160.066 512.372 160.132 512.372V513.372V514.372C160.522 514.372 160.876 514.218 161.143 513.951L160.436 513.244ZM160.132 513.372V512.372H154.787V513.372V514.372H160.132V513.372ZM154.787 513.372H153.788V514.38H154.787H155.787V513.372H154.787ZM154.787 514.38V515.38H161.172V514.38V513.38H154.787V514.38ZM175.069 514.508L174.362 515.215L174.362 515.215L175.069 514.508ZM175.069 517.372L174.362 516.665L174.362 516.665L175.069 517.372ZM174.909 506.428L174.202 507.135L174.202 507.135L174.909 506.428ZM174.909 509.292L174.202 508.585L174.202 508.585L174.909 509.292ZM168.381 509.42V508.42H167.381V509.42H168.381ZM168.381 510.428H167.381V511.428H168.381V510.428ZM174.029 510.556L173.322 511.263L173.322 511.263L174.029 510.556ZM174.029 513.244L173.322 512.537V512.537L174.029 513.244ZM168.381 513.372V512.372H167.381V513.372H168.381ZM168.381 514.38H167.381V515.38H168.381V514.38ZM174.765 514.38V515.38C174.7 515.38 174.621 515.367 174.541 515.334C174.461 515.3 174.402 515.255 174.362 515.215L175.069 514.508L175.776 513.801C175.509 513.534 175.156 513.38 174.765 513.38V514.38ZM175.069 514.508L174.362 515.215C174.322 515.175 174.277 515.116 174.244 515.036C174.21 514.956 174.197 514.878 174.197 514.812H175.197H176.197C176.197 514.421 176.043 514.068 175.776 513.801L175.069 514.508ZM175.197 514.812H174.197V517.068H175.197H176.197V514.812H175.197ZM175.197 517.068H174.197C174.197 517.002 174.21 516.924 174.244 516.844C174.277 516.764 174.322 516.705 174.362 516.665L175.069 517.372L175.776 518.079C176.043 517.812 176.197 517.459 176.197 517.068H175.197ZM175.069 517.372L174.362 516.665C174.402 516.625 174.461 516.58 174.541 516.546C174.621 516.513 174.7 516.5 174.765 516.5V517.5V518.5C175.156 518.5 175.509 518.346 175.776 518.079L175.069 517.372ZM174.765 517.5V516.5H164.653V517.5V518.5H174.765V517.5ZM164.653 517.5V516.5C164.719 516.5 164.797 516.513 164.877 516.546C164.957 516.58 165.017 516.625 165.056 516.665L164.349 517.372L163.642 518.079C163.909 518.346 164.262 518.5 164.653 518.5V517.5ZM164.349 517.372L165.056 516.665C165.096 516.705 165.141 516.764 165.175 516.844C165.209 516.924 165.221 517.002 165.221 517.068H164.221H163.221C163.221 517.459 163.375 517.812 163.642 518.079L164.349 517.372ZM164.221 517.068H165.221V506.732H164.221H163.221V517.068H164.221ZM164.221 506.732H165.221C165.221 506.798 165.209 506.876 165.175 506.956C165.141 507.036 165.096 507.095 165.056 507.135L164.349 506.428L163.642 505.721C163.375 505.988 163.221 506.341 163.221 506.732H164.221ZM164.349 506.428L165.056 507.135C165.017 507.175 164.957 507.22 164.877 507.254C164.797 507.287 164.719 507.3 164.653 507.3V506.3V505.3C164.262 505.3 163.909 505.454 163.642 505.721L164.349 506.428ZM164.653 506.3V507.3H174.605V506.3V505.3H164.653V506.3ZM174.605 506.3V507.3C174.54 507.3 174.461 507.287 174.381 507.254C174.301 507.22 174.242 507.175 174.202 507.135L174.909 506.428L175.616 505.721C175.349 505.454 174.996 505.3 174.605 505.3V506.3ZM174.909 506.428L174.202 507.135C174.162 507.095 174.117 507.036 174.084 506.956C174.05 506.876 174.037 506.798 174.037 506.732H175.037H176.037C176.037 506.341 175.883 505.988 175.616 505.721L174.909 506.428ZM175.037 506.732H174.037V508.988H175.037H176.037V506.732H175.037ZM175.037 508.988H174.037C174.037 508.922 174.05 508.844 174.084 508.764C174.117 508.684 174.162 508.625 174.202 508.585L174.909 509.292L175.616 509.999C175.883 509.732 176.037 509.379 176.037 508.988H175.037ZM174.909 509.292L174.202 508.585C174.242 508.545 174.301 508.5 174.381 508.466C174.461 508.433 174.54 508.42 174.605 508.42V509.42V510.42C174.996 510.42 175.349 510.266 175.616 509.999L174.909 509.292ZM174.605 509.42V508.42H168.381V509.42V510.42H174.605V509.42ZM168.381 509.42H167.381V510.428H168.381H169.381V509.42H168.381ZM168.381 510.428V511.428H173.725V510.428V509.428H168.381V510.428ZM173.725 510.428V511.428C173.66 511.428 173.581 511.415 173.501 511.382C173.421 511.348 173.362 511.303 173.322 511.263L174.029 510.556L174.736 509.849C174.469 509.582 174.116 509.428 173.725 509.428V510.428ZM174.029 510.556L173.322 511.263C173.282 511.223 173.237 511.164 173.204 511.084C173.17 511.004 173.157 510.926 173.157 510.86H174.157H175.157C175.157 510.469 175.003 510.116 174.736 509.849L174.029 510.556ZM174.157 510.86H173.157V512.94H174.157H175.157V510.86H174.157ZM174.157 512.94H173.157C173.157 512.874 173.17 512.796 173.204 512.716C173.237 512.636 173.282 512.577 173.322 512.537L174.029 513.244L174.736 513.951C175.003 513.684 175.157 513.331 175.157 512.94H174.157ZM174.029 513.244L173.322 512.537C173.362 512.497 173.421 512.452 173.501 512.418C173.581 512.385 173.66 512.372 173.725 512.372V513.372V514.372C174.116 514.372 174.469 514.218 174.736 513.951L174.029 513.244ZM173.725 513.372V512.372H168.381V513.372V514.372H173.725V513.372ZM168.381 513.372H167.381V514.38H168.381H169.381V513.372H168.381ZM168.381 514.38V515.38H174.765V514.38V513.38H168.381V514.38ZM187.447 507.468L186.861 508.278L186.865 508.281L187.447 507.468ZM187.463 516.364L188.042 517.179L188.043 517.178L187.463 516.364ZM184.391 514.028L185.023 514.803L185.026 514.801L184.391 514.028ZM184.391 509.788L183.743 510.549L183.758 510.562L183.773 510.574L184.391 509.788ZM181.751 509.42V508.42H180.751V509.42H181.751ZM181.751 514.38H180.751V515.38H181.751V514.38ZM183.127 506.3V507.3C184.793 507.3 186.006 507.66 186.861 508.278L187.447 507.468L188.033 506.658C186.734 505.719 185.066 505.3 183.127 505.3V506.3ZM187.447 507.468L186.865 508.281C187.632 508.83 188.079 509.695 188.079 511.084H189.079H190.079C190.079 509.209 189.438 507.663 188.029 506.655L187.447 507.468ZM189.079 511.084H188.079V512.716H189.079H190.079V511.084H189.079ZM189.079 512.716H188.079C188.079 514.15 187.629 515.018 186.883 515.55L187.463 516.364L188.043 517.178C189.452 516.174 190.079 514.61 190.079 512.716H189.079ZM187.463 516.364L186.884 515.549C186.041 516.147 184.823 516.5 183.127 516.5V517.5V518.5C185.079 518.5 186.751 518.096 188.042 517.179L187.463 516.364ZM183.127 517.5V516.5H178.023V517.5V518.5H183.127V517.5ZM178.023 517.5V516.5C178.089 516.5 178.167 516.513 178.247 516.546C178.327 516.58 178.386 516.625 178.426 516.665L177.719 517.372L177.012 518.079C177.279 518.346 177.632 518.5 178.023 518.5V517.5ZM177.719 517.372L178.426 516.665C178.466 516.705 178.511 516.764 178.545 516.844C178.578 516.924 178.591 517.002 178.591 517.068H177.591H176.591C176.591 517.459 176.745 517.812 177.012 518.079L177.719 517.372ZM177.591 517.068H178.591V506.732H177.591H176.591V517.068H177.591ZM177.591 506.732H178.591C178.591 506.798 178.578 506.876 178.545 506.956C178.511 507.036 178.466 507.095 178.426 507.135L177.719 506.428L177.012 505.721C176.745 505.988 176.591 506.341 176.591 506.732H177.591ZM177.719 506.428L178.426 507.135C178.386 507.175 178.327 507.22 178.247 507.254C178.167 507.287 178.089 507.3 178.023 507.3V506.3V505.3C177.632 505.3 177.279 505.454 177.012 505.721L177.719 506.428ZM178.023 506.3V507.3H183.127V506.3V505.3H178.023V506.3ZM183.207 514.38V515.38C183.858 515.38 184.503 515.227 185.023 514.803L184.391 514.028L183.759 513.253C183.703 513.298 183.559 513.38 183.207 513.38V514.38ZM184.391 514.028L185.026 514.801C185.588 514.339 185.839 513.696 185.839 513.004H184.839H183.839C183.839 513.186 183.791 513.226 183.756 513.255L184.391 514.028ZM184.839 513.004H185.839V510.796H184.839H183.839V513.004H184.839ZM184.839 510.796H185.839C185.839 510.104 185.587 509.456 185.009 509.002L184.391 509.788L183.773 510.574C183.799 510.594 183.807 510.608 183.813 510.622C183.821 510.64 183.839 510.691 183.839 510.796H184.839ZM184.391 509.788L185.039 509.027C184.519 508.583 183.868 508.42 183.207 508.42V509.42V510.42C183.549 510.42 183.687 510.502 183.743 510.549L184.391 509.788ZM183.207 509.42V508.42H181.751V509.42V510.42H183.207V509.42ZM181.751 509.42H180.751V514.38H181.751H182.751V509.42H181.751ZM181.751 514.38V515.38H183.207V514.38V513.38H181.751V514.38ZM216.715 517.004L217.609 516.557L217.603 516.545L217.596 516.532L216.715 517.004ZM216.634 517.404L215.927 516.697L215.927 516.697L216.634 517.404ZM212.346 517.388L211.81 518.232L211.826 518.242L211.843 518.252L212.346 517.388ZM212.09 517.1L211.177 517.506L211.18 517.514L212.09 517.1ZM210.683 513.932L211.596 513.526L211.332 512.932H210.683V513.932ZM209.339 513.932V512.932H208.339V513.932H209.339ZM209.211 517.372L208.503 516.665V516.665L209.211 517.372ZM214.187 506.764L213.789 507.682L213.794 507.684L214.187 506.764ZM215.851 508.108L215.014 508.656H215.014L215.851 508.108ZM214.746 513.324L214.244 512.459L213.409 512.944L213.865 513.796L214.746 513.324ZM211.882 510.748L212.642 511.399L212.653 511.386L212.663 511.373L211.882 510.748ZM211.882 509.548L211.043 510.091L211.062 510.12L211.083 510.148L211.882 509.548ZM209.339 509.276V508.276H208.339V509.276H209.339ZM209.339 510.972H208.339V511.972H209.339V510.972ZM216.715 517.004L215.82 517.451C215.764 517.339 215.746 517.231 215.746 517.148H216.746H217.746C217.746 516.958 217.708 516.754 217.609 516.557L216.715 517.004ZM216.746 517.148H215.746C215.746 517.062 215.764 516.971 215.802 516.883C215.84 516.797 215.888 516.736 215.927 516.697L216.634 517.404L217.342 518.111C217.583 517.869 217.746 517.537 217.746 517.148H216.746ZM216.634 517.404L215.927 516.697C215.986 516.638 216.063 516.584 216.155 516.548C216.246 516.511 216.33 516.5 216.395 516.5V517.5V518.5C216.738 518.5 217.078 518.375 217.342 518.111L216.634 517.404ZM216.395 517.5V516.5H212.762V517.5V518.5H216.395V517.5ZM212.762 517.5V516.5C212.772 516.5 212.788 516.501 212.806 516.506C212.825 516.511 212.84 516.518 212.85 516.524L212.346 517.388L211.843 518.252C212.125 518.416 212.438 518.5 212.762 518.5V517.5ZM212.346 517.388L212.883 516.544C212.896 516.553 212.918 516.569 212.942 516.596C212.966 516.623 212.986 516.654 213.001 516.686L212.09 517.1L211.18 517.514C211.32 517.822 211.542 518.062 211.81 518.232L212.346 517.388ZM212.09 517.1L213.004 516.694L211.596 513.526L210.683 513.932L209.769 514.338L211.177 517.506L212.09 517.1ZM210.683 513.932V512.932H209.339V513.932V514.932H210.683V513.932ZM209.339 513.932H208.339V517.068H209.339H210.339V513.932H209.339ZM209.339 517.068H208.339C208.339 517.002 208.351 516.924 208.385 516.844C208.418 516.764 208.464 516.705 208.503 516.665L209.211 517.372L209.918 518.079C210.184 517.812 210.339 517.459 210.339 517.068H209.339ZM209.211 517.372L208.503 516.665C208.543 516.625 208.603 516.58 208.682 516.546C208.763 516.513 208.841 516.5 208.907 516.5V517.5V518.5C209.297 518.5 209.651 518.346 209.918 518.079L209.211 517.372ZM208.907 517.5V516.5H205.451V517.5V518.5H208.907V517.5ZM205.451 517.5V516.5C205.516 516.5 205.594 516.513 205.675 516.546C205.754 516.58 205.814 516.625 205.854 516.665L205.146 517.372L204.439 518.079C204.706 518.346 205.06 518.5 205.451 518.5V517.5ZM205.146 517.372L205.854 516.665C205.893 516.705 205.939 516.764 205.972 516.844C206.006 516.924 206.019 517.002 206.019 517.068H205.019H204.019C204.019 517.459 204.173 517.812 204.439 518.079L205.146 517.372ZM205.019 517.068H206.019V506.732H205.019H204.019V517.068H205.019ZM205.019 506.732H206.019C206.019 506.798 206.006 506.876 205.972 506.956C205.939 507.036 205.893 507.095 205.854 507.135L205.146 506.428L204.439 505.721C204.173 505.988 204.019 506.341 204.019 506.732H205.019ZM205.146 506.428L205.854 507.135C205.814 507.175 205.754 507.22 205.675 507.254C205.594 507.287 205.516 507.3 205.451 507.3V506.3V505.3C205.06 505.3 204.706 505.454 204.439 505.721L205.146 506.428ZM205.451 506.3V507.3H211.674V506.3V505.3H205.451V506.3ZM211.674 506.3V507.3C212.529 507.3 213.226 507.438 213.789 507.682L214.187 506.764L214.584 505.846C213.718 505.472 212.74 505.3 211.674 505.3V506.3ZM214.187 506.764L213.794 507.684C214.361 507.926 214.751 508.254 215.014 508.656L215.851 508.108L216.687 507.56C216.182 506.788 215.462 506.221 214.579 505.844L214.187 506.764ZM215.851 508.108L215.014 508.656C215.278 509.06 215.426 509.552 215.426 510.172H216.426H217.426C217.426 509.213 217.191 508.33 216.687 507.56L215.851 508.108ZM216.426 510.172H215.426C215.426 511.318 215.014 512.012 214.244 512.459L214.746 513.324L215.249 514.189C216.719 513.335 217.426 511.927 217.426 510.172H216.426ZM214.746 513.324L213.865 513.796L215.833 517.476L216.715 517.004L217.596 516.532L215.628 512.852L214.746 513.324ZM211.339 510.972V511.972C211.803 511.972 212.287 511.813 212.642 511.399L211.882 510.748L211.123 510.097C211.162 510.052 211.214 510.014 211.27 509.991C211.321 509.97 211.35 509.972 211.339 509.972V510.972ZM211.882 510.748L212.663 511.373C212.953 511.01 213.075 510.583 213.075 510.156H212.075H211.075C211.075 510.182 211.071 510.185 211.075 510.171C211.077 510.165 211.081 510.157 211.086 510.148C211.091 510.138 211.096 510.13 211.102 510.123L211.882 510.748ZM212.075 510.156H213.075C213.075 509.728 212.953 509.309 212.683 508.948L211.882 509.548L211.083 510.148C211.081 510.146 211.079 510.143 211.077 510.139C211.075 510.135 211.074 510.132 211.073 510.129C211.072 510.127 211.072 510.127 211.073 510.131C211.074 510.135 211.075 510.143 211.075 510.156H212.075ZM211.882 509.548L212.722 509.005C212.393 508.496 211.869 508.276 211.339 508.276V509.276V510.276C211.338 510.276 211.286 510.276 211.211 510.238C211.132 510.199 211.075 510.14 211.043 510.091L211.882 509.548ZM211.339 509.276V508.276H209.339V509.276V510.276H211.339V509.276ZM209.339 509.276H208.339V510.972H209.339H210.339V509.276H209.339ZM209.339 510.972V511.972H211.339V510.972V509.972H209.339V510.972ZM219.684 516.492L219.087 517.294L219.091 517.297L219.684 516.492ZM222.196 506.428L222.903 505.721V505.721L222.196 506.428ZM222.756 514.108L222.125 514.883L222.131 514.889L222.138 514.894L222.756 514.108ZM225.14 514.108L224.522 513.322L224.515 513.327L224.509 513.333L225.14 514.108ZM229.668 506.428L230.375 505.721V505.721L229.668 506.428ZM228.212 516.492L227.619 515.687L227.615 515.69L228.212 516.492ZM223.956 517.66V516.66C222.301 516.66 221.109 516.3 220.278 515.687L219.684 516.492L219.091 517.297C220.372 518.241 222.027 518.66 223.956 518.66V517.66ZM219.684 516.492L220.282 515.69C219.556 515.15 219.116 514.275 219.116 512.844H218.116H217.116C217.116 514.72 217.721 516.277 219.087 517.294L219.684 516.492ZM218.116 512.844H219.116V506.732H218.116H217.116V512.844H218.116ZM218.116 506.732H219.116C219.116 506.798 219.104 506.876 219.07 506.956C219.036 507.036 218.991 507.095 218.951 507.135L218.244 506.428L217.537 505.721C217.27 505.988 217.116 506.341 217.116 506.732H218.116ZM218.244 506.428L218.951 507.135C218.912 507.175 218.852 507.22 218.772 507.254C218.692 507.287 218.614 507.3 218.548 507.3V506.3V505.3C218.157 505.3 217.804 505.454 217.537 505.721L218.244 506.428ZM218.548 506.3V507.3H221.892V506.3V505.3H218.548V506.3ZM221.892 506.3V507.3C221.827 507.3 221.748 507.287 221.668 507.254C221.588 507.22 221.529 507.175 221.489 507.135L222.196 506.428L222.903 505.721C222.636 505.454 222.283 505.3 221.892 505.3V506.3ZM222.196 506.428L221.489 507.135C221.449 507.095 221.404 507.036 221.371 506.956C221.337 506.876 221.324 506.798 221.324 506.732H222.324H223.324C223.324 506.341 223.17 505.988 222.903 505.721L222.196 506.428ZM222.324 506.732H221.324V513.1H222.324H223.324V506.732H222.324ZM222.324 513.1H221.324C221.324 513.779 221.561 514.424 222.125 514.883L222.756 514.108L223.388 513.333C223.367 513.316 223.359 513.303 223.351 513.286C223.342 513.264 223.324 513.209 223.324 513.1H222.324ZM222.756 514.108L222.138 514.894C222.662 515.306 223.303 515.46 223.956 515.46V514.46V513.46C223.607 513.46 223.447 513.379 223.374 513.322L222.756 514.108ZM223.956 514.46V515.46C224.607 515.46 225.252 515.307 225.772 514.883L225.14 514.108L224.509 513.333C224.453 513.378 224.308 513.46 223.956 513.46V514.46ZM225.14 514.108L225.758 514.894C226.336 514.44 226.588 513.792 226.588 513.1H225.588H224.588C224.588 513.205 224.571 513.256 224.562 513.274C224.556 513.288 224.548 513.302 224.522 513.322L225.14 514.108ZM225.588 513.1H226.588V506.732H225.588H224.588V513.1H225.588ZM225.588 506.732H226.588C226.588 506.798 226.576 506.876 226.542 506.956C226.508 507.036 226.463 507.095 226.423 507.135L225.716 506.428L225.009 505.721C224.742 505.988 224.588 506.341 224.588 506.732H225.588ZM225.716 506.428L226.423 507.135C226.384 507.175 226.324 507.22 226.244 507.254C226.164 507.287 226.086 507.3 226.02 507.3V506.3V505.3C225.629 505.3 225.276 505.454 225.009 505.721L225.716 506.428ZM226.02 506.3V507.3H229.364V506.3V505.3H226.02V506.3ZM229.364 506.3V507.3C229.299 507.3 229.22 507.287 229.14 507.254C229.06 507.22 229.001 507.175 228.961 507.135L229.668 506.428L230.375 505.721C230.108 505.454 229.755 505.3 229.364 505.3V506.3ZM229.668 506.428L228.961 507.135C228.921 507.095 228.876 507.036 228.843 506.956C228.809 506.876 228.796 506.798 228.796 506.732H229.796H230.796C230.796 506.341 230.642 505.988 230.375 505.721L229.668 506.428ZM229.796 506.732H228.796V512.844H229.796H230.796V506.732H229.796ZM229.796 512.844H228.796C228.796 514.271 228.353 515.145 227.619 515.687L228.212 516.492L228.806 517.297C230.183 516.281 230.796 514.723 230.796 512.844H229.796ZM228.212 516.492L227.615 515.69C226.796 516.3 225.612 516.66 223.956 516.66V517.66V518.66C225.884 518.66 227.537 518.242 228.81 517.294L228.212 516.492ZM239.342 517.164L240.138 516.558L240.129 516.547L239.342 517.164ZM235.854 512.716L236.641 512.099L234.854 509.82V512.716H235.854ZM235.726 517.372L236.433 518.079V518.079L235.726 517.372ZM235.662 506.62L236.472 506.033L236.467 506.027L236.462 506.02L235.662 506.62ZM239.15 511.436L238.34 512.023L240.15 514.522V511.436H239.15ZM239.278 506.428L239.985 507.135V507.135L239.278 506.428ZM242.558 506.3V507.3C242.492 507.3 242.414 507.287 242.334 507.254C242.254 507.22 242.195 507.175 242.155 507.135L242.862 506.428L243.569 505.721C243.302 505.454 242.949 505.3 242.558 505.3V506.3ZM242.862 506.428L242.155 507.135C242.115 507.095 242.07 507.036 242.036 506.956C242.003 506.876 241.99 506.798 241.99 506.732H242.99H243.99C243.99 506.341 243.836 505.988 243.569 505.721L242.862 506.428ZM242.99 506.732H241.99V517.068H242.99H243.99V506.732H242.99ZM242.99 517.068H241.99C241.99 517.002 242.003 516.924 242.036 516.844C242.07 516.764 242.115 516.705 242.155 516.665L242.862 517.372L243.569 518.079C243.836 517.812 243.99 517.459 243.99 517.068H242.99ZM242.862 517.372L242.155 516.665C242.195 516.625 242.254 516.58 242.334 516.546C242.414 516.513 242.492 516.5 242.558 516.5V517.5V518.5C242.949 518.5 243.302 518.346 243.569 518.079L242.862 517.372ZM242.558 517.5V516.5H239.982V517.5V518.5H242.558V517.5ZM239.982 517.5V516.5C239.991 516.5 240.008 516.501 240.03 516.506C240.052 516.512 240.074 516.52 240.095 516.531C240.137 516.553 240.149 516.573 240.137 516.558L239.342 517.164L238.547 517.77C238.885 518.214 239.38 518.5 239.982 518.5V517.5ZM239.342 517.164L240.129 516.547L236.641 512.099L235.854 512.716L235.067 513.333L238.555 517.781L239.342 517.164ZM235.854 512.716H234.854V517.068H235.854H236.854V512.716H235.854ZM235.854 517.068H234.854C234.854 517.002 234.867 516.924 234.9 516.844C234.934 516.764 234.979 516.705 235.019 516.665L235.726 517.372L236.433 518.079C236.7 517.812 236.854 517.459 236.854 517.068H235.854ZM235.726 517.372L235.019 516.665C235.059 516.625 235.118 516.58 235.198 516.546C235.278 516.513 235.356 516.5 235.422 516.5V517.5V518.5C235.813 518.5 236.166 518.346 236.433 518.079L235.726 517.372ZM235.422 517.5V516.5H232.446V517.5V518.5H235.422V517.5ZM232.446 517.5V516.5C232.512 516.5 232.59 516.513 232.67 516.546C232.75 516.58 232.809 516.625 232.849 516.665L232.142 517.372L231.435 518.079C231.702 518.346 232.055 518.5 232.446 518.5V517.5ZM232.142 517.372L232.849 516.665C232.889 516.705 232.934 516.764 232.968 516.844C233.001 516.924 233.014 517.002 233.014 517.068H232.014H231.014C231.014 517.459 231.168 517.812 231.435 518.079L232.142 517.372ZM232.014 517.068H233.014V506.732H232.014H231.014V517.068H232.014ZM232.014 506.732H233.014C233.014 506.798 233.001 506.876 232.968 506.956C232.934 507.036 232.889 507.095 232.849 507.135L232.142 506.428L231.435 505.721C231.168 505.988 231.014 506.341 231.014 506.732H232.014ZM232.142 506.428L232.849 507.135C232.809 507.175 232.75 507.22 232.67 507.254C232.59 507.287 232.512 507.3 232.446 507.3V506.3V505.3C232.055 505.3 231.702 505.454 231.435 505.721L232.142 506.428ZM232.446 506.3V507.3H235.038V506.3V505.3H232.446V506.3ZM235.038 506.3V507.3C235.023 507.3 234.98 507.296 234.93 507.27C234.881 507.245 234.86 507.218 234.862 507.22L235.662 506.62L236.462 506.02C236.122 505.567 235.624 505.3 235.038 505.3V506.3ZM235.662 506.62L234.852 507.207L238.34 512.023L239.15 511.436L239.96 510.849L236.472 506.033L235.662 506.62ZM239.15 511.436H240.15V506.732H239.15H238.15V511.436H239.15ZM239.15 506.732H240.15C240.15 506.798 240.137 506.876 240.104 506.956C240.07 507.036 240.025 507.095 239.985 507.135L239.278 506.428L238.571 505.721C238.304 505.988 238.15 506.341 238.15 506.732H239.15ZM239.278 506.428L239.985 507.135C239.945 507.175 239.886 507.22 239.806 507.254C239.726 507.287 239.648 507.3 239.582 507.3V506.3V505.3C239.191 505.3 238.838 505.454 238.571 505.721L239.278 506.428ZM239.582 506.3V507.3H242.558V506.3V505.3H239.582V506.3Z" fill="black" mask="url(#path-14240-outside-6_2_177825)"/>
</g>
<g filter="url(#filter10_d_2_177825)">
<path d="M343 517.086V507.914C343 507.023 344.077 506.577 344.707 507.207L349.293 511.793C349.683 512.183 349.683 512.817 349.293 513.207L344.707 517.793C344.077 518.423 343 517.977 343 517.086Z" fill="white"/>
<path d="M343 517.086V507.914C343 507.023 344.077 506.577 344.707 507.207L349.293 511.793C349.683 512.183 349.683 512.817 349.293 513.207L344.707 517.793C344.077 518.423 343 517.977 343 517.086Z" stroke="black" stroke-linejoin="round"/>
</g>
</g>
</g>
<defs>
<filter id="filter0_d_2_177825" x="121.024" y="74.96" width="160.886" height="21.28" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<filter id="filter1_d_2_177825" x="95.3199" y="107.64" width="217.618" height="15.52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<filter id="filter2_d_2_177825" x="23" y="203" width="356" height="103" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<filter id="filter3_d_2_177825" x="122.216" y="245.14" width="203.513" height="15.52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<filter id="filter4_d_2_177825" x="342.5" y="246.411" width="7.58582" height="14.1776" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<filter id="filter5_d_2_177825" x="23" y="333" width="356" height="103" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<filter id="filter6_d_2_177825" x="121.992" y="375.14" width="176.549" height="15.52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<filter id="filter7_d_2_177825" x="342.5" y="376.411" width="7.58582" height="14.1776" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<filter id="filter8_d_2_177825" x="23" y="463" width="356" height="103" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<filter id="filter9_d_2_177825" x="121.992" y="505.14" width="121.998" height="15.52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<filter id="filter10_d_2_177825" x="342.5" y="506.411" width="7.58582" height="14.1776" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_177825"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_177825" result="shape"/>
</filter>
<clipPath id="clip0_2_177825">
<rect width="402" height="874" fill="white"/>
</clipPath>
<clipPath id="clip1_2_177825">
<rect width="402" height="874" fill="white"/>
</clipPath>
</defs>
`;

const MODE_CARD_HITS = [
  { top: 203, left: 23, w: 356, h: 99 },
  { top: 333, left: 23, w: 356, h: 99 },
  { top: 463, left: 23, w: 356, h: 99 },
];
const MODE_CARD_ORDER = ["daily", "standard", "speedrun"];

function ModeSelect({onSelect}) {
  const [sessions,setSessions]=useState(()=>loadAllSessionsList());
  const dailyDone=hasDoneDaily();
  const mostRecentSession = sessions[0];
  const byId = Object.fromEntries(GAME_MODES.map(m=>[m.id,m]));

  return (
    <div style={{minHeight:"100dvh",...CHECKER_BG,display:"flex",justifyContent:"center",alignItems:"flex-start"}}>
      <div style={{position:"relative",width:"min(402px, calc(100dvh * 402 / 874))",height:"min(874px, 100dvh)"}}>
        <div style={{position:"absolute",inset:0}}
          dangerouslySetInnerHTML={{__html:
            `<svg viewBox="0 0 402 874" width="100%" height="100%" fill="none" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg" style="display:block">${MODESELECT_ART}</svg>`}}/>

        {MODE_CARD_HITS.map((hit,i)=>{
          const mode = byId[MODE_CARD_ORDER[i]];
          if(!mode) return null;
          const replayDaily = mode.isDaily && dailyDone;
          return (
            <button key={mode.id} onClick={()=>onSelect(mode)}
              aria-label={mode.label}
              title={replayDaily?"Daily complete - click to replay":""}
              style={{position:"absolute",
                top:`${hit.top/874*100}%`, left:`${hit.left/402*100}%`,
                width:`${hit.w/402*100}%`, height:`${hit.h/874*100}%`,
                background:"transparent",border:"none",padding:0,
                cursor:"pointer",
                opacity:1,
                borderRadius:8,
                zIndex:3}}/>
          );
        })}

        <div
          aria-hidden="true"
          style={{
            position:"absolute",
            left:"50%",
            top:mostRecentSession?"80.8%":"84.6%",
            transform:"translate(-50%, -50%)",
            pointerEvents:"none",
            zIndex:1,
          }}
        >
          <img
            src="/stickers/Happy.png"
            alt=""
            draggable="false"
            style={{
              display:"block",
              width:"auto",
              height:"clamp(148px, 21vh, 188px)",
              filter:"drop-shadow(0 12px 16px rgba(0,0,0,0.42))",
              animation:"homeTrexFloat 3s ease-in-out infinite",
              transformOrigin:"50% 75%",
            }}
          />
        </div>

        {mostRecentSession&&(
          <button onClick={()=>onSelect(null,mostRecentSession.modeId)} aria-label="Resume Game"
            style={{position:"absolute",bottom:"1.7%",left:"50%",transform:"translateX(-50%)",width:242,height:82,...BTN.cyan,padding:0,display:"flex",alignItems:"center",justifyContent:"center",gap:12,cursor:"pointer"}}>
            <span aria-hidden="true" style={{fontSize:30,lineHeight:1,filter:"drop-shadow(0 2px 0 #1C1D21)"}}>🔥</span>
            <span style={{...WHITE_STICKER_TEXT,fontFamily:FONT_FIGMA_STICKER,fontSize:15.5,letterSpacing:"0.01em",textTransform:"uppercase",lineHeight:1}}>Resume Game</span>
          </button>
        )}
      </div>
    </div>
  );
}



// 
// TITLE REVEAL — cinematic mash animation
// 
function TitleReveal({card,found,onDone}) {
  const [phase,setPhase]=useState("enter"); // enter | collide | hold
  const [impact,setImpact]=useState(false);
  const title=card.mashedTitle||card.movies.join(" + ");
  const [f1,...f1rest]=card.movies[0].split(" ");
  const [f2,...f2rest]=card.movies[1].split(" ");

  useEffect(()=>{
    const t1=setTimeout(()=>setPhase("collide"),900);
    const tImpact=setTimeout(()=>setImpact(true),1180);
    const tImpactOff=setTimeout(()=>setImpact(false),1460);
    const t2=setTimeout(()=>setPhase("hold"),1600);
    const t3=setTimeout(()=>{ SFX.complete(); onDone(); },3200);
    return()=>{clearTimeout(t1);clearTimeout(tImpact);clearTimeout(tImpactOff);clearTimeout(t2);clearTimeout(t3);};
  },[]);

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:280,textAlign:"center",gap:20,padding:"24px 0",overflow:"hidden",background:T.bg,position:"relative",animation:impact?"impactShake 0.22s ease":"none"}}>
      {impact && <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 45%, rgba(255,239,145,0.65) 0%, rgba(255,239,145,0) 55%)",pointerEvents:"none",animation:"impactFlash 0.3s ease"}}/>}
      {phase!=="hold" ? (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:phase==="collide"?4:56,transition:"gap 0.5s cubic-bezier(.68,-0.55,.27,1.55)",overflow:"hidden",width:"100%",padding:"0 24px",position:"relative",zIndex:2}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontStyle:"italic",color:T.blue,opacity:phase==="enter"?0:1,transform:phase==="enter"?"translateX(-60px)":"translateX(0)",transition:"all 0.6s cubic-bezier(.68,-0.55,.27,1.55)",textAlign:"right",flex:1,lineHeight:1.3,fontWeight:700}}>
            {card.movies[0]}
          </div>
          <div style={{fontFamily:FONT_FIGMA_STICKER,fontSize:18,color:T.border,flexShrink:0,transition:"opacity 0.3s",opacity:phase==="collide"?0:1,fontWeight:700}}>x</div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontStyle:"italic",color:T.orange,opacity:phase==="enter"?0:1,transform:phase==="enter"?"translateX(60px)":"translateX(0)",transition:"all 0.6s cubic-bezier(.68,-0.55,.27,1.55)",textAlign:"left",flex:1,lineHeight:1.3,fontWeight:700}}>
            {card.movies[1]}
          </div>
        </div>
      ) : (
        <div style={{animation:"titlePop 0.4s cubic-bezier(.68,-0.55,.27,1.55)",textAlign:"center",padding:"0 24px",position:"relative",zIndex:2}}>
          <div style={{fontFamily:FONT_FIGMA_STICKER,fontSize:T.sm,color:T.textMuted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>The Mashed Title Was...</div>
          <div style={{...YELLOW_STICKER_TEXT,fontSize:44,lineHeight:1.2,letterSpacing:"0.04em",marginBottom:18}}>
            {title}
          </div>
          <div style={{fontFamily:FONT_FIGMA_STICKER,fontSize:10,color:T.textMuted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>Hidden films</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            {card.movies.map((m,i)=>(
              <span key={i} style={{background:T.surfaceAlt,color:T.textSecondary,border:`1px solid ${T.border}`,borderRadius:T.r,padding:"4px 12px",fontSize:13,fontFamily:"'Outfit',sans-serif",fontStyle:"italic"}}>{m}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function clamp(min,vwVal,max){ return `clamp(${min}px,${vwVal}vw,${max}px)`; }

// 
// INTERMISSION CARD
// 
function Intermission({card,found,score,onContinue}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24,padding:"32px 0",textAlign:"center",animation:"fadeIn 0.5s ease"}}>
      <div style={{background:T.surface,color:T.textPrimary,border:`1px solid ${T.border}`,borderRadius:T.rXl,padding:"28px 32px",maxWidth:500,width:"100%",boxShadow:T.shadow}}>
        <p style={{margin:"0 0 4px",fontFamily:FONT_FIGMA_STICKER,fontSize:T.sm,color:T.textMuted,letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:600}}>The Connection</p>
        <div style={{width:40,height:3,background:T.gold,margin:"10px auto 18px",borderRadius:2}}/>
        <p style={{margin:0,fontFamily:"'Outfit',sans-serif",fontSize:T.lg,color:T.textSecondary,lineHeight:1.8,fontStyle:"italic"}}>"{card.connection}"</p>
        <div style={{marginTop:20,display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
          {card.movies.map((m,i)=>(
            <span key={i} style={{background:found[i]?T.greenBg:T.redBg,color:found[i]?T.green:T.red,border:`1.5px solid ${found[i]?"#86EFAC":"#FECACA"}`,borderRadius:T.r,padding:"6px 16px",fontSize:T.md,fontFamily:"'Outfit',sans-serif",fontStyle:"italic",fontWeight:600}}>{m}</span>
          ))}
        </div>
      </div>
      <div style={{...YELLOW_STICKER_TEXT,fontSize:T.xxl}}>+{score.toLocaleString()} pts this round</div>
      <button onClick={onContinue} style={{...BTN.primary,fontSize:T.lg,padding:"15px 36px"}}>Next Round →</button>
    </div>
  );
}



// 
// RESULT MESSAGES — funny, movie-industry-lingo, based on performance
// 
// Result message banks — pseudo-random, no repeats in a row
const _lastMsgIdx = {};
function pickRandom(key, arr) {
  const last = _lastMsgIdx[key] ?? -1;
  let idx;
  do { idx = Math.floor(Math.random() * arr.length); } while (arr.length > 1 && idx === last);
  _lastMsgIdx[key] = idx;
  return arr[idx];
}

const MSG_BANKS = {
  viewOnly: [
    { headline:"In The Can." },
    { headline:"Locked Picture." },
    { headline:"Already In The Archive." },
    { headline:"Struck From The Negative." },
    { headline:"That Reel Is Spent." },
    { headline:"Screened. Filed. Done." },
  ],
  timesUp: [
    { headline:"Time's Up!", sub:"The clock ran out. No points for this round.", emoji:"⏱️" },
    { headline:"Missed The Screening.", sub:"Doors closed, lights down, and you were still in the lobby.", emoji:"🚪" },
    { headline:"Overran The Slot.", sub:"The projectionist waited as long as he could. Zero points.", emoji:"📽️" },
    { headline:"Out Of Time, Out Of Luck.", sub:"That round expired before you cracked it.", emoji:"⌛" },
  ],
  outOfLives: [
    { headline:"Production Shut Down.", sub:"The insurers pulled out, the crew went home, and the lot has been sold. No lives left.", emoji:"🎬" },
    { headline:"Final Cut.", sub:"You are out of lives. The negative has been incinerated for the tax write-off.", emoji:"🔥" },
    { headline:"Box Office Poison.", sub:"Every last life spent. Even your own mother waited for streaming.", emoji:"🍿" },
    { headline:"Recast And Reshot.", sub:"That was the last of your lives. The studio is going in a different direction.", emoji:"📼" },
    { headline:"Wrapped. Not In A Good Way.", sub:"No lives remain. Somewhere a projectionist is quietly turning off the lamp.", emoji:"💡" },
    { headline:"Lost To The Archive.", sub:"You have run out of lives. The only surviving print is in a vault nobody can open.", emoji:"🗄️" },
  ],
  burnedOut: [
    { headline:"Over Budget, Over Schedule.", sub:"You found it, but the money ran out somewhere in act two. Nothing left to pay you with.", emoji:"💸" },
    { headline:"Released Straight to Bargain Bin.", sub:"Technically completed. Commercially, a catastrophe. Zero points.", emoji:"📉" },
    { headline:"The Credits Rolled Without You.", sub:"You cracked it on fumes. The reward had already left the building.", emoji:"🚪" },
    { headline:"Pyrrhic Screening.", sub:"A win on paper. The accountant is laughing. You scored nothing.", emoji:"🧾" },
    { headline:"Cut For Time.", sub:"You got the answer and lost the whole purse doing it. Brutal maths.", emoji:"✂️" },
    { headline:"Financed Entirely In Debt.", sub:"Every hint and every wrong turn ate the payout. You end with zero.", emoji:"🏦" },
  ],
  perfect1: [
    { headline:"Absolute Cinema.", sub:"First guess, no hints. You didn't even need to rewind.", emoji:"🏆" },
    { headline:"One Take Wonder.", sub:"First guess. No hints. The director is weeping with joy.", emoji:"🎬" },
    { headline:"The Academy Will Hear About This.", sub:"First guess, zero hints. Your Oscars speech is already written.", emoji:"🏆" },
    { headline:"Auteur.", sub:"You didn't guess — you knew. There is a difference.", emoji:"🎭" },
    { headline:"Print It.", sub:"First take. No hints. Crew is going home early.", emoji:"🎥" },
    { headline:"Criterion Tier.", sub:"First guess, no lifelines. This goes straight to the Criterion Collection.", emoji:"🏆" },
  ],
  perfect2: [
    { headline:"That's a Wrap.", sub:"Two guesses, no hints. The craft services table is applauding.", emoji:"🎬" },
    { headline:"Sharp Eye.", sub:"Two guesses, nothing revealed. That is not luck. That is knowledge.", emoji:"👁️" },
    { headline:"Solid Lead.", sub:"Two guesses clean. The director would cast you in anything.", emoji:"🎥" },
    { headline:"Second Guess, First Class.", sub:"Took one warm-up shot and nailed it. Zero hints. Respect.", emoji:"🎞️" },
  ],
  perfectFew: [
    { headline:"Roger Ebert Would Be Proud.", sub:"Got there without a single hint. Two thumbs so far up they are in orbit.", emoji:"👍" },
    { headline:"No Training Wheels.", sub:"A few guesses but zero hints. You did this entirely on film knowledge.", emoji:"🎓" },
    { headline:"Methodical.", sub:"Took your time, used no lifelines, got both. The slow burn wins.", emoji:"🎬" },
    { headline:"Director's Cut. No Notes.", sub:"Studio greenlit the sequel. No changes requested.", emoji:"🎥" },
    { headline:"Film Buff Mode.", sub:"No hints. Just you and your brain and two movies you apparently know extremely well.", emoji:"🧠" },
  ],
  perfectSlow: [
    { headline:"Eventually Genius.", sub:"Many guesses, zero hints. Stubborn and successful. Respect.", emoji:"💪" },
    { headline:"No Lifelines. No Problem.", sub:"Took the long route but kept the reward intact. Smart.", emoji:"🗺️" },
    { headline:"Pure Graft.", sub:"You refused every hint and ground it out. The reward is yours clean.", emoji:"🔨" },
  ],
  hint1: [
    { headline:"Still a Blockbuster.", sub:"One hint — like checking your phone during the trailers. Forgivable. You got it.", emoji:"🍿" },
    { headline:"One Nudge.", sub:"Just the one hint. You took it and ran. Efficient.", emoji:"👟" },
    { headline:"Minor Assist.", sub:"One lifeline used. The rest was all you.", emoji:"🎟️" },
    { headline:"Barely Needed It.", sub:"One hint peeked at. Honestly you probably could have got it anyway.", emoji:"🤏" },
    { headline:"One Clue Club.", sub:"Single hint, both films found. You are not a cheat — you are strategic.", emoji:"🕵️" },
  ],
  hint2: [
    { headline:"Got There. Eventually.", sub:"Two hints. You are the person who asks who that guy is twice during the film. Still counts.", emoji:"😅" },
    { headline:"The Hints Helped.", sub:"Two lifelines opened. Not a crime. The points took a hit but the win is real.", emoji:"🤝" },
    { headline:"Assisted Solve.", sub:"Two hints in. You needed a nudge and a shove. But you stuck with it.", emoji:"📌" },
    { headline:"Collaborative Effort.", sub:"You and the hint system figured it out together. Teamwork.", emoji:"🤝" },
  ],
  hint3: [
    { headline:"You Made It Out.", sub:"Three hints, multiple re-reads, probably whispered both titles to yourself. But roll credits.", emoji:"✂️" },
    { headline:"Maximum Assistance.", sub:"All the lifelines, all the clues. The reward is basically a participation trophy at this point. But a trophy.", emoji:"🏅" },
    { headline:"The Long Way Round.", sub:"Every hint revealed, got there in the end. The destination still counts.", emoji:"🗺️" },
    { headline:"Fully Scaffolded.", sub:"Three hints deep and you still needed a moment. Respect for not giving up.", emoji:"🏗️" },
  ],
  failClean: [
    { headline:"Development Hell.", sub:"This script has been in turnaround since 2003. The studio passed. Netflix passed. Your dog passed.", emoji:"💀" },
    { headline:"Shelved.", sub:"Every major streaming platform declined. This one goes in a box marked DO NOT OPEN.", emoji:"📦" },
    { headline:"Direct to Oblivion.", sub:"No theatrical run. No streaming. No DVD. No one will speak of this.", emoji:"🚫" },
    { headline:"The Test Screening Was Rough.", sub:"Audiences walked out. The director disowned it. The lead is doing podcasts now.", emoji:"😬" },
    { headline:"Cut From the Final Edit.", sub:"Your guesses hit the cutting room floor. Every single one.", emoji:"✂️" },
  ],
  failHint1: [
    { headline:"Limited Release. Very Limited.", sub:"One cinema, Tuesday afternoon, audience of four. One of them left to use the bathroom and never came back.", emoji:"🎞️" },
    { headline:"Niche Market.", sub:"A hint and multiple guesses later and still nothing. You are the film this was not made for.", emoji:"🎭" },
    { headline:"The Hint Did Not Help.", sub:"You peeked and still could not place it. These two films are apparently strangers to you.", emoji:"🤷" },
  ],
  failHints: [
    { headline:"Straight to VHS.", sub:"Head to Blockbuster. Pay your overdue fines. This is going in the bargain bin next to Battlefield Earth.", emoji:"📼" },
    { headline:"The Weinstein Cut.", sub:"Too long, too confusing, nobody wanted it. Three hints and still no answer.", emoji:"📼" },
    { headline:"Deleted Scene.", sub:"Not even the director wants to talk about this one. All three hints used. No result.", emoji:"🗑️" },
    { headline:"The Extended Cut Nobody Asked For.", sub:"Three hints revealed, still could not place it. This one goes straight to the vault.", emoji:"💿" },
  ],
  partial: [
    { headline:"Half a Ticket Stub.", sub:"One film found, one ghost. The other half of this mash is still out there.", emoji:"🎟️" },
    { headline:"One Film. One Ghost.", sub:"Half the cast showed up. The other half is still in their trailer negotiating a parking space.", emoji:"👻" },
    { headline:"Split Billing.", sub:"You got one name on the poster. The other one is just a question mark.", emoji:"❓" },
    { headline:"Partial Credit.", sub:"Film school would give you a C. We give you a C. But also points for the one you got.", emoji:"📝" },
    { headline:"One Down, One Mystery.", sub:"Found one, lost the other entirely. The sequel might explain it.", emoji:"🎬" },
  ],
  skipped: [
    { headline:"Opted Out.", sub:"Skipped. No points, no spoilers, no judgment. Well — minimal judgment.", emoji:"🚶" },
    { headline:"Pass.", sub:"Sometimes you just do not know. Moving on.", emoji:"⏭️" },
    { headline:"Strategic Skip.", sub:"You chose not to guess. This is either wisdom or cowardice and only you know which.", emoji:"🤔" },
    { headline:"Next Card.", sub:"This one was not for you. The next one might be.", emoji:"➡️" },
  ],
};

function getResultMessage(both, hintsUsed, guessCount, maxGuesses, skipped=false, reward=null, timedOut=false) {
  if (skipped) return pickRandom("skipped", MSG_BANKS.skipped);
  if (timedOut) return pickRandom("timesUp", MSG_BANKS.timesUp);
  if (both && reward === 0) return pickRandom("burnedOut", MSG_BANKS.burnedOut);
  if (both && hintsUsed === 0 && guessCount === 1) return pickRandom("perfect1", MSG_BANKS.perfect1);
  if (both && hintsUsed === 0 && guessCount === 2) return pickRandom("perfect2", MSG_BANKS.perfect2);
  if (both && hintsUsed === 0 && guessCount <= 4)  return pickRandom("perfectFew", MSG_BANKS.perfectFew);
  if (both && hintsUsed === 0)                      return pickRandom("perfectSlow", MSG_BANKS.perfectSlow);
  if (both && hintsUsed === 1)                      return pickRandom("hint1", MSG_BANKS.hint1);
  if (both && hintsUsed === 2)                      return pickRandom("hint2", MSG_BANKS.hint2);
  if (both && hintsUsed >= 3)                       return pickRandom("hint3", MSG_BANKS.hint3);
  if (!both && guessCount >= maxGuesses && hintsUsed === 0) return pickRandom("failClean", MSG_BANKS.failClean);
  if (!both && guessCount >= maxGuesses && hintsUsed === 1) return pickRandom("failHint1", MSG_BANKS.failHint1);
  if (!both && guessCount >= maxGuesses && hintsUsed >= 2)  return pickRandom("failHints", MSG_BANKS.failHints);
  return pickRandom("partial", MSG_BANKS.partial);
}

// 
// ROUND RESULT POPUP — auto-shown the moment a round ends
// 
function RoundResultPopup({card, found, guessCount, hintCount, maxGuesses, roundScore, cardIdx, totalCards, results=[], isLast, onNext, onMenu, skipped=false, timedOut=false, showSticker=false, stickerSrc=null, stickerDurationMs=2200, onStickerEnded, reducedMotion=false, transitionFamily=TRANSITION_FAMILIES.punchy}) {
  const both = found[0] && found[1];
  const won = both;
  const msgRef = useRef(null);
  if (!msgRef.current) {
    msgRef.current = getResultMessage(both, hintCount, guessCount, maxGuesses, skipped, roundScore, timedOut);
  }
  const msg = msgRef.current;
  const title = card.mashedTitle || card.movies.join(" + ");
  const [showConnection,setShowConnection]=useState(false);
  const [scoreDisplay, setScoreDisplay] = useState(reducedMotion ? roundScore : 0);
  const [entered, setEntered] = useState(reducedMotion);

  useEffect(() => {
    const h = e => { if (e.key === "Escape") { if(showConnection) setShowConnection(false); else onNext(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [showConnection]);

  // Geometry below is measured directly from the round-end SVGs (402px frame):
  //   film chips  332x24 and 278x24, white, 1px black, square corners
  //   title box   352x108 r11  fill #342698  border #F6A507
  //   pts chip    131x40  r9   fill #D3CAFE
  //   dots        26px r13, 5 per row, 35px pitch, rows 40px apart
  //   footer      #9381FE, cyan 206x60 + pink 104x60
  const dotFor=(i)=>{
    const pr=results[i];
    if(i===cardIdx) return skipped||!won ? T.rose : T.teal;
    if(!pr) return "#D3CBFE";
    if(pr.skipped||!isRoundSolved(pr)) return T.rose;
    if(isRoundSolved(pr)) return T.teal;
    return "#D3CBFE";
  };
  const glyphFor=(i)=>{
    const pr=results[i];
    if(i===cardIdx) return skipped||!won ? "x" : "check";
    if(!pr) return null;
    if(pr.skipped||!isRoundSolved(pr)) return "x";
    if(isRoundSolved(pr)) return "check";
    return null;
  };
  const dotCount=Math.max(totalCards,1);
  const [dotRevealCount, setDotRevealCount] = useState(reducedMotion ? dotCount : 0);
  const resultLottieSrc = won
    ? LOTTIE_ASSETS.roundWin
    : (skipped || timedOut ? null : LOTTIE_ASSETS.roundMiss);
  const resultSheetBg = won ? WIN_RESULT_BG : SUNBURST_BG;
  const rx = (px) => `${(px / 402) * 100}%`;
  const ry = (px) => `${(px / 484) * 100}%`;
  const rfy = (px) => `${(px / 94) * 100}%`;

  const popupTitleSize = title.length > 34 ? 17 : (title.length > 26 ? 19 : 24);
  const popupTitleStyle = {
    ...POPUP_TITLE_TEXT,
    fontSize: popupTitleSize,
    lineHeight: 1.04,
    maxWidth: "100%",
    textAlign: "center",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  };

  useEffect(() => {
    if (reducedMotion) {
      setEntered(true);
      return;
    }
    setEntered(false);
    const id = setTimeout(() => setEntered(true), 70);
    return () => clearTimeout(id);
  }, [reducedMotion, cardIdx, msg.headline, title]);

  const stagedRise = (delayMs = 0, y = 10, baseTransform = "") => (
    reducedMotion
      ? undefined
      : {
          opacity: entered ? 1 : 0,
          transform: entered
            ? (baseTransform || "translateY(0)")
            : `${baseTransform ? `${baseTransform} ` : ""}translateY(${y}px)`,
          transition: `opacity 360ms ease ${delayMs}ms, transform 360ms ease ${delayMs}ms`,
        }
  );

  useEffect(() => {
    if (reducedMotion) {
      setScoreDisplay(roundScore);
      return;
    }
    const start = performance.now();
    const duration = 650;
    let raf = null;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setScoreDisplay(Math.round(roundScore * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [roundScore, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setDotRevealCount(dotCount);
      return;
    }
    setDotRevealCount(0);
    let cursor = 0;
    const id = setInterval(() => {
      cursor += 1;
      setDotRevealCount(cursor);
      if (cursor >= dotCount) clearInterval(id);
    }, 64);
    return () => clearInterval(id);
  }, [dotCount, reducedMotion]);

  const buildChipLines = (title, maxCharsPerLine, maxLines = 3) => {
    const words = String(title || "").trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [""];
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length <= maxCharsPerLine || line.length === 0) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    });
    if (line) lines.push(line);
    if (lines.length <= maxLines) return lines;
    const merged = lines.slice(0, maxLines - 1);
    merged.push(lines.slice(maxLines - 1).join(" "));
    return merged;
  };

  const movieChipLayout = (movieTitle) => {
    const titleLength = String(movieTitle || "").trim().length;
    const prefersWide = titleLength > 14;
    const width = prefersWide ? 282 : 232;
    const lines = buildChipLines(movieTitle, prefersWide ? 18 : 14, 3);
    const lineCount = lines.length;
    const fontSize = lineCount >= 3 ? "clamp(12px, 3.6vw, 14px)" : "clamp(13px, 4vw, 15px)";
    const height = 48 + Math.max(0, (lineCount - 1) * 14);
    return { width, lines, lineCount, fontSize, height };
  };

  const movieChipStyle = (chip) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: `min(${chip.width}px, calc(100% - 20px))`,
    minWidth: 176,
    maxWidth: `min(${chip.width}px, calc(100% - 20px))`,
    minHeight: chip.height,
    height: chip.height,
    background: "#fff",
    border: "1px solid #000000",
    padding: "8px 10px 6px",
    boxSizing: "border-box",
    fontFamily: FONT_FIGMA_STICKER,
    fontSize: chip.fontSize,
    fontWeight: 700,
    color: T.textPrimary,
    textTransform: "uppercase",
    letterSpacing: "0",
    lineHeight: 1.05,
    textAlign: "center",
    overflow: "hidden",
    whiteSpace: "normal",
    wordBreak: "normal",
    overflowWrap: "normal",
  });

  if (won) {
    const topChip = movieChipLayout(card.movies[0]);
    const bottomChip = movieChipLayout(card.movies[1]);
    const movieStackCenterX = 201;
    const chipGap = 5.5;
    const titleGap = 30;
    const plusHeight = 26;
    const plusWidth = 30;
    const preferredTitleY = 296;
    const minTopChipY = 118;
    const chipStackHeight = topChip.height + chipGap + plusHeight + chipGap + bottomChip.height;
    const topChipY = Math.max(minTopChipY, preferredTitleY - titleGap - chipStackHeight);
    const plusY = topChipY + topChip.height + chipGap;
    const bottomChipY = plusY + plusHeight + chipGap;
    const idealTitleY = bottomChipY + bottomChip.height + titleGap;
    const titleY = Math.min(Math.max(248, idealTitleY), 296);
    return (
      <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",justifyContent:"center",alignItems:"flex-end",overflowY:"auto",background:"rgba(0,0,0,0.35)",backdropFilter:reducedMotion?"none":"blur(5px)",animation:reducedMotion?"none":transitionFamily.popupBackdropIn}}
        onClick={e => e.target === e.currentTarget && !showConnection && onNext()}>

        {showConnection&&card.connection&&(
          <div style={{position:"absolute",inset:0,zIndex:500,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:0,overflowY:"auto",background:"rgba(0,0,0,0.45)"}}
            onClick={e=>e.target===e.currentTarget&&setShowConnection(false)}>
            <div style={{position:"relative",width:"min(402px, 100vw)",margin:"0 auto",minHeight:"100dvh",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:18,boxSizing:"border-box"}}>
              <div style={{width:"100%",border:`2px solid ${T.border}`,borderRadius:20,boxShadow:T.shadowLg,background:"linear-gradient(180deg,#6E58F7 0%,#5C46F0 100%)",padding:"28px 18px 22px",textAlign:"center"}}>
                <div style={{...WHITE_STICKER_TEXT,fontSize:20,textTransform:"uppercase",marginBottom:10}}>The Connection</div>
                <p style={{margin:0,fontFamily:"'Outfit',sans-serif",fontSize:15,lineHeight:1.55,color:"#fff"}}>{card.connection}</p>
                <button onClick={()=>setShowConnection(false)} aria-label="Close" style={{...BTN.primary,marginTop:18,padding:"12px 18px"}}>
                  <span style={{...WHITE_STICKER_TEXT,fontSize:12,textTransform:"uppercase"}}>Close</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{position:"relative",width:"min(402px, 100vw)",margin:"0 auto",borderRadius:"12px 12px 0 0",overflow:"visible",boxShadow:T.shadowLg,...resultSheetBg,backgroundColor:T.bgDeep,animation:reducedMotion?"none":transitionFamily.popupSheetIn,transformOrigin:"50% 100%"}}>
          {!!resultLottieSrc && !reducedMotion && (
            <LottieOverlay
              key={`${resultLottieSrc}-${cardIdx}-win`}
              src={resultLottieSrc}
              loop={false}
              speed={1.02}
              style={{
                position:"absolute",
                left:"50%",
                top:"6%",
                width:"min(88vw, 320px)",
                height:"min(88vw, 320px)",
                transform:"translateX(-50%)",
                pointerEvents:"none",
                opacity:0.75,
                zIndex:2,
              }}
            />
          )}
          {showSticker && stickerSrc && (
            <div style={{position:"absolute",left:"50%",bottom:"calc(100% + 6px)",transform:"translateX(-50%)",zIndex:6,pointerEvents:"none"}}>
              <ChromaKeyVideo
                src={stickerSrc}
                autoPlay={true}
                loop={false}
                width={260}
                height={260}
                onEnded={onStickerEnded}
                style={{filter:"drop-shadow(0 14px 24px rgba(0,0,0,0.42))",animation:`winStickerPop ${Math.max(700, Math.round(stickerDurationMs * 0.7))}ms ease-out both`,transform:"translateY(-36px)"}}
              />
            </div>
          )}
          <div style={{aspectRatio:"402 / 484",textAlign:"center",position:"relative"}}>
            <div style={{...POPUP_YELLOW_TEXT,fontSize:"clamp(13px, 4vw, 16px)",textTransform:"uppercase",lineHeight:1.06,letterSpacing:"0",position:"absolute",left:rx(26),right:rx(26),top:ry(29),...stagedRise(20, 8)}}>{msg.headline}</div>
            <div style={{...POPUP_PLAIN_WHITE_TEXT,fontSize:"clamp(10.5px, 3.2vw, 12.8px)",lineHeight:1.23,textTransform:"none",letterSpacing:"0.01em",position:"absolute",left:rx(30),right:rx(30),top:ry(72),...stagedRise(70, 8)}}>{msg.sub}</div>

            <div style={{...movieChipStyle(topChip),position:"absolute",left:rx(movieStackCenterX),top:ry(topChipY),transform:"translateX(-50%)",...stagedRise(120, 10, "translateX(-50%)")}}>{topChip.lines.join(" ")}</div>
            <div style={{position:"absolute",left:rx(movieStackCenterX),top:ry(plusY),transform:"translateX(-50%)",width:rx(plusWidth),height:ry(plusHeight),borderRadius:9,background:"#F6A507",border:"2px solid #1C1D21",boxShadow:"0 1px 0 #1C1D21",boxSizing:"border-box",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT_FIGMA_STICKER,fontSize:"clamp(12px, 3.7vw, 16px)",lineHeight:1,color:"#1C1D21",...stagedRise(170, 10, "translateX(-50%)")}}>+</div>
            <div style={{...movieChipStyle(bottomChip),position:"absolute",left:rx(movieStackCenterX),top:ry(bottomChipY),transform:"translateX(-50%)",...stagedRise(210, 10, "translateX(-50%)")}}>{bottomChip.lines.join(" ")}</div>

            <div style={{position:"absolute",left:rx(25),top:ry(titleY),width:rx(352),height:ry(78),background:"#342698",border:"2px solid #F6A507",borderRadius:11,boxShadow:"0 4px 0 #1C1D21",padding:"10px 12px",boxSizing:"border-box",display:"flex",alignItems:"center",justifyContent:"center",...stagedRise(260, 12)}}>
              <div style={popupTitleStyle}>{title}</div>
            </div>

            <div style={{position:"absolute",left:rx(24),top:ry(401),width:rx(131),height:ry(40),background:"#D3CAFE",border:"2px solid #1C1D21",borderRadius:9,boxShadow:"0 4px 0 #1C1D21",padding:"0 10px",display:"inline-flex",alignItems:"center",gap:8,justifyContent:"center",boxSizing:"border-box",...stagedRise(320, 8)}}>
              <IconStar size={18} />
              <span style={{...POPUP_SCORE_TEXT,display:"inline-block",animation:reducedMotion?"none":"scorePulse 0.28s ease"}}>+{scoreDisplay} PTS</span>
            </div>

            <div style={{position:"absolute",left:rx(212),top:ry(388),display:"grid",gridTemplateColumns:"repeat(5, 26px)",gridTemplateRows:"repeat(2, 26px)",gap:"14px 9px",justifyContent:"center",...stagedRise(360, 8)}}>
              {Array.from({length:dotCount}).map((_,i)=>{
                const bg = dotFor(i);
                const glyph = glyphFor(i);
                return (
                  <div key={i} style={{width:26,height:26,borderRadius:"50%",background:bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 0 #1C1D21",opacity:i<dotRevealCount?1:0.2,transform:i<dotRevealCount?"scale(1)":"scale(0.8)",transition:"opacity 0.22s ease, transform 0.22s ease"}}>
                    {i<dotRevealCount && (glyph==="x" ? <IconXMark size={10} color="#F08D87"/> : glyph==="check" ? <IconCheck size={10} color="#6AE89D"/> : null)}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{aspectRatio:"402 / 94",marginTop:0,...RESULT_FOOTER_BG,borderTop:`1px solid ${T.border}`,position:"relative"}}>
            <button onClick={()=>setShowConnection(true)} aria-label="The Connection"
              style={{position:"absolute",left:rx(24),top:rfy(17),width:rx(207),height:rfy(57),...BTN.cyan,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={POPUP_BUTTON_TEXT}>The Connection</span>
            </button>
            <button onClick={onNext} aria-label={isLast ? "Finish" : "Next"}
              style={{position:"absolute",right:rx(24),top:rfy(17),width:rx(105),height:rfy(57),...BTN.primary,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={POPUP_BUTTON_TEXT}>{isLast ? "Finish" : "Next"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (timedOut) {
    return (
      <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",justifyContent:"center",alignItems:"flex-end",overflowY:"auto",background:"rgba(0,0,0,0.35)",backdropFilter:reducedMotion?"none":"blur(5px)",animation:reducedMotion?"none":transitionFamily.popupBackdropIn}}
        onClick={e => e.target === e.currentTarget && !showConnection && onNext()}>

        <div style={{position:"relative",width:"min(402px, 100vw)",margin:"0 auto",borderRadius:"12px 12px 0 0",overflow:"visible",boxShadow:T.shadowLg,...resultSheetBg,backgroundColor:T.bgDeep,animation:reducedMotion?"none":transitionFamily.popupSheetIn,transformOrigin:"50% 100%"}}>
          <div style={{padding:"52px 22px 28px",minHeight:390,position:"relative",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div style={{position:"absolute",left:"50%",top:-22,transform:"translateX(-50%)",zIndex:2}}>
              <IconStopwatch size={66}/>
            </div>
            <div>
              <div style={{...POPUP_YELLOW_TEXT,textAlign:"center",fontSize:16.5,textTransform:"uppercase",lineHeight:1.14,letterSpacing:"0.02em",marginTop:10,marginBottom:12}}>
                Time&apos;s Up!
              </div>
              <div style={{...POPUP_PLAIN_WHITE_TEXT,textAlign:"center",fontSize:9.8,textTransform:"uppercase",lineHeight:1.26,letterSpacing:"0.01em",margin:"0 auto",maxWidth:330}}>
                The clock ran out. No points for
                <br/>
                this round.
              </div>
            </div>

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"nowrap"}}>
              <div style={{background:"#D3CAFE",border:"2px solid #1C1D21",borderRadius:9,boxShadow:"0 4px 0 #1C1D21",width:131,height:40,padding:"0 10px",display:"inline-flex",alignItems:"center",gap:8,justifyContent:"center"}}>
                <IconStar size={18}/>
                <span style={{...POPUP_SCORE_TEXT,fontSize:14,display:"inline-block",animation:reducedMotion?"none":"scorePulse 0.28s ease"}}>{scoreDisplay} PTS</span>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(5, 26px)",gridTemplateRows:"repeat(2, 26px)",gap:"12px 9px",justifyContent:"center",marginRight:2}}>
                {Array.from({length:dotCount}).map((_,i)=>{
                  const bg = dotFor(i);
                  const glyph = glyphFor(i);
                  return (
                    <div key={i} style={{width:26,height:26,borderRadius:"50%",background:bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 0 #1C1D21",opacity:i<dotRevealCount?1:0.2,transform:i<dotRevealCount?"scale(1)":"scale(0.8)",transition:"opacity 0.22s ease, transform 0.22s ease"}}>
                      {i<dotRevealCount && (glyph==="x" ? <IconXMark size={10} color="#F08D87"/> : glyph==="check" ? <IconCheck size={10} color="#6AE89D"/> : null)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{height:94,marginTop:0,background:"transparent",borderTop:"none",position:"relative"}}>
            <button onClick={onNext} aria-label={isLast ? "Finish" : "Next"}
              style={{position:"absolute",right:24,top:17,width:105,height:57,...BTN.primary,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={POPUP_BUTTON_TEXT}>{isLast ? "Finish" : "Next"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!won) {
    return (
      <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",justifyContent:"center",alignItems:"center",overflowY:"auto",padding:"80px 0 24px",boxSizing:"border-box",background:"rgba(0,0,0,0.35)",backdropFilter:reducedMotion?"none":"blur(5px)",animation:reducedMotion?"none":transitionFamily.popupBackdropIn}}
        onClick={e => e.target === e.currentTarget && !showConnection && onNext()}>

        <div style={{position:"relative",width:"min(402px, 100vw)",margin:"0 auto",borderRadius:"12px 12px 0 0",overflow:"visible",boxShadow:T.shadowLg,...resultSheetBg,backgroundColor:T.bgDeep,animation:reducedMotion?"none":transitionFamily.popupSheetIn,transformOrigin:"50% 100%"}}>
          {!!resultLottieSrc && !reducedMotion && (
            <LottieOverlay
              key={`${resultLottieSrc}-${cardIdx}-miss`}
              src={resultLottieSrc}
              loop={false}
              speed={0.98}
              style={{
                position:"absolute",
                left:"50%",
                top:"2%",
                width:"min(88vw, 280px)",
                height:"min(88vw, 280px)",
                transform:"translateX(-50%)",
                pointerEvents:"none",
                opacity:0.44,
                zIndex:1,
              }}
            />
          )}
          <div style={{padding:"52px 22px 28px",minHeight:390,display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative"}}>
            <div>
              <div style={{...POPUP_YELLOW_TEXT,textAlign:"center",fontSize:16.5,textTransform:"uppercase",lineHeight:1.14,letterSpacing:"0.02em",marginBottom:12}}>{msg.headline}</div>
              <div style={{...POPUP_PLAIN_WHITE_TEXT,textAlign:"center",fontSize:9.8,textTransform:"uppercase",lineHeight:1.26,letterSpacing:"0.01em",margin:"0 auto",maxWidth:330}}>{msg.sub}</div>
            </div>

            {skipped && (
              <div style={{height:170,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",margin:"10px 0 8px"}}>
                <img
                  src={STICKER_ASSETS.trex.sad}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  style={{
                    display:"block",
                    height:"100%",
                    width:"auto",
                    maxWidth:"82%",
                    filter:"drop-shadow(0 14px 18px rgba(0,0,0,0.45))",
                    animation:reducedMotion?"none":"skipSadFloat 1.9s ease-in-out infinite",
                  }}
                />
              </div>
            )}

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"nowrap"}}>
              <div style={{background:"#D3CAFE",border:"2px solid #1C1D21",borderRadius:9,boxShadow:"0 4px 0 #1C1D21",width:131,height:40,padding:"0 10px",display:"inline-flex",alignItems:"center",gap:8,justifyContent:"center"}}>
                <IconStar size={18}/>
                <span style={{...POPUP_SCORE_TEXT,fontSize:14,display:"inline-block",animation:reducedMotion?"none":"scorePulse 0.28s ease"}}>{scoreDisplay} PTS</span>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(5, 26px)",gridTemplateRows:"repeat(2, 26px)",gap:"12px 9px",justifyContent:"center",marginRight:2}}>
                {Array.from({length:dotCount}).map((_,i)=>{
                  const bg = dotFor(i);
                  const glyph = glyphFor(i);
                  return (
                    <div key={i} style={{width:26,height:26,borderRadius:"50%",background:bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 0 #1C1D21",opacity:i<dotRevealCount?1:0.2,transform:i<dotRevealCount?"scale(1)":"scale(0.8)",transition:"opacity 0.22s ease, transform 0.22s ease"}}>
                      {i<dotRevealCount && (glyph==="x" ? <IconXMark size={10} color="#F08D87"/> : glyph==="check" ? <IconCheck size={10} color="#6AE89D"/> : null)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{height:94,marginTop:0,background:"transparent",borderTop:"none",position:"relative"}}>
            <button onClick={onNext} aria-label={isLast ? "Finish" : "Next"}
              style={{position:"absolute",right:24,top:17,width:105,height:57,...BTN.primary,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={POPUP_BUTTON_TEXT}>{isLast ? "Finish" : "Next"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

}

// 
// HANGMAN TITLE — dashes that reveal as films are found
// 
function HangmanTitle({card, found, guesses=[]}) {
  const title = card.mashedTitle || card.movies.join(" + ");

  // Reveal any title word typed in any guess, even if the full guess is wrong.
  const titleTokenSet = new Set(
    normWord(title)
      .split(" ")
      .filter(Boolean)
      .map(normalizeToken)
      .filter(Boolean)
  );

  const typed = new Set();
  guesses.forEach((g) => {
    normWord(g)
      .split(" ")
      .filter(Boolean)
      .map(normalizeToken)
      .forEach((w) => {
        if (w && titleTokenSet.has(w)) typed.add(w);
      });
  });

  function shouldReveal(charIdx) {
    if (found[0] && found[1]) return true;          // solved: show the whole title
    const words = title.split(" ");
    let pos = 0;
    for (let w = 0; w < words.length; w++) {
      if (charIdx >= pos && charIdx < pos + words[w].length) {
        const wordTokens = normWord(words[w]).split(" ").filter(Boolean).map(normalizeToken);
        return wordTokens.some((token) => typed.has(token));
      }
      pos += words[w].length + 1;
    }
    return false;
  }

  const allRevealed = found[0] && found[1];

  // Prefer wrapping between words, but allow very long single words to wrap
  // inside themselves so they cannot force horizontal scrolling on mobile.
  const words = [];
  let cursor = 0;
  title.split(" ").forEach((w) => {
    words.push({ text: w, start: cursor });
    cursor += w.length + 1;
  });

  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:"7px 14px",alignItems:"center",maxWidth:"100%",overflowX:"hidden",overflowY:"visible",paddingBottom:4}}>
      {words.map((word, wi) => {
        const mustWrapInsideWord = word.text.length > 9;
        return (
        <div key={wi} style={{display:"flex",gap:1,flexShrink:mustWrapInsideWord ? 1 : 0,flexWrap:mustWrapInsideWord ? "wrap" : "nowrap",maxWidth:"100%",overflow:"visible",paddingBottom:4}}>
          {word.text.split("").map((ch, ci) => {
            // Punctuation (":", "-", "'"…) is never hidden — a blank tile for a colon
            // is unguessable and just confuses the board.
            const isPunct = !/[a-z0-9]/i.test(ch);
            if (isPunct) return (
              <div key={ci} style={{width:12,display:"flex",alignItems:"flex-end",justifyContent:"center",
                fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:700,color:"#fff",paddingBottom:6}}>{ch}</div>
            );
            const rev = shouldReveal(word.start + ci);
            return (
              <div key={ci} style={{
                width:34,height:37,flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center",
                background:T.surfaceAlt,
                border:`1px solid ${T.border}`,
                borderRadius:9,
                boxShadow:"0 4px 0 #1C1D21",
                fontFamily:"'Outfit',sans-serif",
                fontSize:16,
                fontWeight:700,
                color: allRevealed ? T.pink : T.textPrimary,
                textTransform:"uppercase",
                transition:"color 0.25s ease",
              }}>{rev ? ch : ""}</div>
            );
          })}
        </div>
      );
      })}
    </div>
  );
}

// 
// HINTS MODAL — bottom sheet with two boxes per film (year/genre, then actor).
// Buttons stay visible but gray out once purchased, matching Figma exactly
// (Figma nodes 2:118616 → 2:133413 → 2:148210, the three "Hints — Revealed N" states).
// 
function HintsModal({card, hintsRevealed, guessesLeft, onReveal, onClose, hintAnimationSrc, reducedMotion=false, transitionFamily=TRANSITION_FAMILIES.punchy}) {
  const [showHintAnim, setShowHintAnim] = useState(true);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState(null);
  const hintAnim = typeof hintAnimationSrc === "string"
    ? { src: hintAnimationSrc, width: 320, aboveGap: 8, liftY: -120 }
    : (hintAnimationSrc || null);
  useEffect(() => {
    setShowHintAnim(true);
  }, [hintAnim?.src]);
  const hd = card.hintData;
  const yearGenreRevealed = hintsRevealed.includes(HINT_TIERS[0].id);
  const actorsRevealed = hintsRevealed.includes(HINT_TIERS[1].id);

  const revealWithFx = (tierId) => {
    setRecentlyUnlocked(tierId);
    onReveal(tierId);
  };

  useEffect(() => {
    if (!recentlyUnlocked) return;
    const id = setTimeout(() => setRecentlyUnlocked(null), 560);
    return () => clearTimeout(id);
  }, [recentlyUnlocked]);

  const FilmBoxes = ({i}) => {
    const f = hd?.films?.[i];
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,marginBottom:14}}>
        <div style={{fontFamily:FONT_FIGMA_STICKER,fontSize:11,color:"#fff",opacity:0.85,marginBottom:2,textTransform:"uppercase"}}>Film {i+1}</div>
        <div style={{background:"#fff",border:`1px solid ${T.border}`,padding:"6px 14px",minWidth:170,textAlign:"center",animation:!reducedMotion && recentlyUnlocked===HINT_TIERS[0].id ? "vaultUnlockPulse 0.48s ease" : "none",transformOrigin:"50% 50%"}}>
          <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:14,color:T.textPrimary}}>
            {yearGenreRevealed&&f ? `${f.year} ${f.genre.toUpperCase()}` : "?????"}
          </span>
        </div>
        <div style={{background:"#fff",border:`1px solid ${T.border}`,padding:"6px 14px",minWidth:170,textAlign:"center",position:"relative",overflow:"hidden",animation:!reducedMotion && recentlyUnlocked===HINT_TIERS[1].id ? "vaultUnlockPulse 0.48s ease" : "none",transformOrigin:"50% 50%"}}>
          {!actorsRevealed && (
            <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(130deg,#0b0a16 0 9px,#201d38 9px 18px)",opacity:0.9,pointerEvents:"none"}}/>
          )}
          <span style={{position:"relative",zIndex:1,fontFamily:FONT_FIGMA_STICKER,fontSize:14,color:T.textPrimary,textDecoration:actorsRevealed&&f?"underline":"none",animation:!reducedMotion && actorsRevealed && recentlyUnlocked===HINT_TIERS[1].id ? "tapePeelReveal 0.45s ease" : "none",display:"inline-block"}}>
            {actorsRevealed&&f ? f.actors[0].toUpperCase() : "?????"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:390,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"150px 16px 16px"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{position:"relative",width:"100%",maxWidth:400,overflow:"visible"}}>
        {hintAnim?.src && showHintAnim && (
          <div style={{position:"fixed",left:"50%",top:`calc(max(64px, env(safe-area-inset-top)) + ${hintAnim.aboveGap ?? 8}px)`,transform:"translateX(-50%)",zIndex:430,pointerEvents:"none"}}>
            <ChromaKeyVideo
              src={hintAnim.src}
              autoPlay={true}
              loop={false}
              width={hintAnim.width ?? 320}
              height={hintAnim.width ?? 320}
              onEnded={() => setShowHintAnim(false)}
              style={{filter:"drop-shadow(0 14px 24px rgba(0,0,0,0.42))",transform:`translateY(${hintAnim.liftY ?? -120}px)`}}
            />
          </div>
        )}
        <div style={{width:"100%",maxHeight:"85vh",overflowY:"auto",overflowX:"visible",background:T.bgDeep,border:`2px solid ${T.border}`,borderRadius:T.rXl,boxShadow:T.shadowLg,padding:"66px 20px 24px",animation:reducedMotion?"none":transitionFamily.hintIn,position:"relative",transformOrigin:"50% 100%"}}>
        <button onClick={onClose} aria-label="Close hints" style={{position:"absolute",top:14,right:14,width:30,height:30,background:"#4845F3",border:`2px solid ${T.border}`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <IconX size={11}/>
        </button>
        <div style={{...YELLOW_STICKER_TEXT,textAlign:"center",fontSize:15,marginBottom:18,textTransform:"uppercase"}}>Hints</div>

        <FilmBoxes i={0}/>
        <FilmBoxes i={1}/>

        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:16}}>
          <button onClick={()=>revealWithFx(HINT_TIERS[0].id)} disabled={yearGenreRevealed||guessesLeft===0}
            style={{...BTN.cyan,opacity:yearGenreRevealed?0.4:guessesLeft===0?0.4:1,cursor:yearGenreRevealed||guessesLeft===0?"not-allowed":"pointer",padding:"13px 0"}}>
            <span style={{...WHITE_STICKER_TEXT,fontSize:13,letterSpacing:"0.03em",textTransform:"uppercase"}}>
              Year & Genre  -1 pts{yearGenreRevealed?" ✓":""}
            </span>
          </button>
          <button onClick={()=>revealWithFx(HINT_TIERS[1].id)} disabled={actorsRevealed||guessesLeft===0}
            style={{...BTN.primary,opacity:actorsRevealed?0.4:guessesLeft===0?0.4:1,cursor:actorsRevealed||guessesLeft===0?"not-allowed":"pointer",padding:"13px 0"}}>
            <span style={{...WHITE_STICKER_TEXT,fontSize:13,letterSpacing:"0.03em",textTransform:"uppercase"}}>
              Lead Actors  -3 pts{actorsRevealed?" ✓":""}
            </span>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

// 
// GAME SCREEN
// 
function GameScreen({mode,deck,initialState,onQuit,onComplete,reducedMotion=false}) {
  const [cardIdx,setCardIdx]=useState(initialState?.cardIdx||0);
  // Revisiting an earlier card. rewindIdx===null means "playing the current card".
  const [rewindIdx,setRewindIdx]=useState(null);
  const [cardStates,setCardStates]=useState({});   // {idx:{guesses,hintsRevealed}}
  const [guesses,setGuesses]=useState(initialState?.guesses||[]);
  const [hintsRevealed,setHintsRevealed]=useState(initialState?.hintsRevealed||[]);
  const [phase,setPhase]=useState("playing");
  const [skipped,setSkipped]=useState(false);
  const [showSkipConfirm,setShowSkipConfirm]=useState(false);
  const [lives,setLives]=useState(initialState?.lives ?? mode.maxGuesses);
  const [timeLeft,setTimeLeft]=useState(initialState?.timeLeft ?? (mode.timeLimit||0));
  const [timedOut,setTimedOut]=useState(false);
  const [showHints,setShowHints]=useState(false);
  const [showMissShake, setShowMissShake] = useState(false);
  const [cardTransitionPhase, setCardTransitionPhase] = useState("in"); // in | out | idle
  const [genreTransition, setGenreTransition] = useState(null);
  const missShakeTimerRef = useRef(null);
  const cardSwapTimerRef = useRef(null);
  const cardSwapSettleTimerRef = useRef(null);
  const genreTransitionTimerRef = useRef(null);
  const [showWinAnimation,setShowWinAnimation]=useState(false);
  const [winAnimationSrc,setWinAnimationSrc]=useState(null);
  const [winAnimationDurationMs,setWinAnimationDurationMs]=useState(2200);
  const [winAnimationEnded,setWinAnimationEnded]=useState(false);
  const winAnimationTimerRef=useRef(null);
  const winAnimationLockRef=useRef(false);
  const winAnimationStartedAtRef=useRef(0);
  const guessInputRef=useRef(null);
  const [results,setResults]=useState(initialState?.results||[]);
  const [totalScore,setTotalScore]=useState(initialState?.totalScore||0);
  const [streak,setStreak]=useState(()=>loadStreak());
  const [perfectSolveStreak,setPerfectSolveStreak]=useState(0);
  const prevFoundRef=useRef([false,false]);
  const speedrunDeadlineRef=useRef(null);
  const speedrunRafRef=useRef(null);

  useEffect(() => {
    const invalidDeck = !Array.isArray(deck) || deck.length !== mode.roundCount;
    const invalidCardIndex = cardIdx < 0 || cardIdx >= deck.length;
    const invalidResults = results.length > deck.length;
    if (invalidDeck || invalidCardIndex || invalidResults) {
      clearSession(mode.id);
      onQuit();
    }
  }, [deck, mode.roundCount, mode.id, cardIdx, results.length, onQuit]);

  const activeIdx = rewindIdx!==null ? rewindIdx : cardIdx;
  const card=deck[activeIdx];
  const transitionFamily = pickTransitionFamily(card, activeIdx);
  const pastResult = rewindIdx!==null ? results[rewindIdx] : null;
  // A card you already won is view-only — you earned it, nothing left to play for.
  // A card with no reward left is view-only too. Anything else can be resumed
  // for whatever points remain.
  const pastWon = isRoundSolved(pastResult);
  // A skip is a forfeit, not a pause: the moment you skip, the card is done —
  // no re-attempting it for score later, even if points were left on it.
  const pastSkipped = !!(pastResult && pastResult.skipped);
  const pastSpent = !!(pastResult && !pastWon && !pastSkipped && (pastResult.reward||0) <= 0);
  const viewOnly = rewindIdx!==null && (pastWon || pastSpent || pastSkipped);
  const isRewound = rewindIdx!==null;
  const found=checkGuesses(guesses,card.movies,card.aliases||[[],[]],card.mashedTitle||"");
  const titleFullyRevealed = areAllMashedTitleWordsGuessed(guesses, card.mashedTitle || "");
  // Solved must come from real movie-title or mashed-title matches only.
  // Completing all meaningful mashed-title words should also complete the round.
  const both=(found[0]&&found[1]) || titleFullyRevealed;
  const effectiveFound = both ? [true, true] : found;
  const guessStates = guesses.map(g => guessClassification(g, card));
  // Hearts are run-level lives used when a card is skipped or fully lost.
  // Wrong guesses affect reward only.
  const heartsLeft=lives;
  const wrongGuessCount=guessStates.filter(state=>state==="miss").length;
  const guessesRemainingForCard=Math.max(0, mode.maxGuesses-wrongGuessCount);

  // Reward tracking — derived from hint/individual-film state
  const hintCount=hintsRevealed.length;
  const filmFoundByIndividualGuessCount = card.movies.reduce((count, movieTitle, i) => {
    const aliases = (card.aliases || [[], []])[i] || [];
    const matched = guesses.some((g) =>
      !isMashedTitleGuess(g, card.mashedTitle || "") &&
      isCorrectMovieGuess(g, movieTitle, aliases, card.movies[1 - i])
    );
    return count + (matched ? 1 : 0);
  }, 0);
  const currentReward=calcReward(hintsRevealed,filmFoundByIndividualGuessCount,wrongGuessCount);
  const rewardSpent = !both && currentReward <= 0;
  const cardLost=!both&&(guessesRemainingForCard===0 || rewardSpent);
  const over=both||cardLost;
  const tension=mode.difficultyPacing==="escalating"?marathonTension(cardIdx,deck.length):0;
  const accent=tension>0.6?`hsl(${Math.round(20-tension*20)},88%,56%)`:mode.accentColor;
  const isLast=cardIdx===deck.length-1;
  const hintButtonSrc = hintCount===0
    ? "/design-reference/Guess%20button-2.svg" // 2/2
    : hintCount===1
      ? "/design-reference/Guess%20button-1.svg" // 1/2
      : "/design-reference/Guess%20button.svg"; // 0/2
  const liveCardPts = viewOnly && pastResult
    ? (typeof pastResult.reward === "number" ? pastResult.reward : (both ? (pastResult.pts ?? BASE_REWARD) : 0))
    : currentReward;
  const maxPossibleReward=BASE_REWARD;
  const pointsLost=maxPossibleReward-currentReward;
  const allowSingleLetterY = card.movies.some((m) => normWord(m) === "y tu mama tambien");

  useEffect(() => {
    if (reducedMotion) {
      setCardTransitionPhase("idle");
      return;
    }
    setCardTransitionPhase("in");
    const settle = setTimeout(() => setCardTransitionPhase("idle"), 440);
    return () => clearTimeout(settle);
  }, [activeIdx, reducedMotion]);

  // Sound on new find
  useEffect(()=>{
    const prev=prevFoundRef.current;
    const newFind=found.some((f,i)=>f&&!prev[i]);
    if(newFind) SFX.correct();
    prevFoundRef.current=found;
  },[found[0],found[1]]);

  // Auto-save
  useEffect(()=>{
    if(phase==="playing" && rewindIdx===null) {
      saveSession({modeName:mode.label,modeId:mode.id,cardIdx,guesses,hintsRevealed,results,totalScore,lives,timeLeft,deckLen:deck.length,deck});
    }
  },[cardIdx,guesses,hintsRevealed,results,totalScore,lives,timeLeft,phase,rewindIdx,mode.label,mode.id,deck.length,deck]);

  useEffect(()=>{
    if(isRewound || !over || phase!=="playing") return;
    const nextPhase = "result";
    const delay = both ? 300 : 650;
    const timerId = setTimeout(()=>setPhase(nextPhase), delay);
    return () => clearTimeout(timerId);
  },[over,phase,isRewound,both]);

  const handleGuess=(g)=>{
    if(cardLost||both||viewOnly) return;
    const state = guessClassification(g, card);
    if(state==="miss"){
      SFX.wrong();
      if (!reducedMotion) {
        setShowMissShake(false);
        if (missShakeTimerRef.current) clearTimeout(missShakeTimerRef.current);
        requestAnimationFrame(() => setShowMissShake(true));
        missShakeTimerRef.current = setTimeout(() => setShowMissShake(false), 380);
      }
    }
    setGuesses(p=>[...p,g]);
  };

  const runCardSwap = (commit) => {
    if (reducedMotion) {
      commit();
      return;
    }
    const transitionMeta = GENRE_TRANSITION_META[transitionFamily.name] || GENRE_TRANSITION_META.punchy;
    setGenreTransition({
      nonce: Date.now(),
      name: transitionFamily.name,
      tag: transitionMeta.tag,
      emoji: transitionMeta.emoji,
      anim: transitionMeta.anim,
    });
    if (genreTransitionTimerRef.current) clearTimeout(genreTransitionTimerRef.current);
    genreTransitionTimerRef.current = setTimeout(() => setGenreTransition(null), 520);

    setCardTransitionPhase("out");
    if (cardSwapTimerRef.current) clearTimeout(cardSwapTimerRef.current);
    if (cardSwapSettleTimerRef.current) clearTimeout(cardSwapSettleTimerRef.current);
    cardSwapTimerRef.current = setTimeout(() => {
      commit();
      setCardTransitionPhase("in");
      cardSwapSettleTimerRef.current = setTimeout(() => {
        setCardTransitionPhase("idle");
      }, 420);
    }, 190);
  };

  // Reveal a hint tier — modular, add future tiers to HINT_TIERS array
  const handleRevealHint=(tierId)=>{
    if(hintsRevealed.includes(tierId)||both||cardLost||viewOnly) return;
    setHintsRevealed(p=>[...p,tierId]);
    SFX.hint();
  };

  const handleSkip=()=>{
    if(viewOnly||isRewound) return;
    setLives(l=>Math.max(0,l-1));
    updateStreak(false);
    setShowSkipConfirm(false);
    setShowHints(false);
    setSkipped(true);
    setPhase("result");
  };

  // Individual film guessing — each slot has its own input

  useEffect(()=>{
    if(!mode.timeLimit) return;

    if(speedrunRafRef.current){
      cancelAnimationFrame(speedrunRafRef.current);
      speedrunRafRef.current = null;
    }

    if(phase!=="playing" || both || lives<=0){
      speedrunDeadlineRef.current = null;
      return;
    }

    // Use wall-clock time so timer behavior stays correct even if setTimeout is altered.
    if(speedrunDeadlineRef.current===null){
      speedrunDeadlineRef.current = Date.now() + Math.max(0, timeLeft) * 1000;
    }

    const tick = () => {
      const deadline = speedrunDeadlineRef.current;
      if(deadline===null) return;

      const msLeft = Math.max(0, deadline - Date.now());
      const nextSeconds = Math.ceil(msLeft / 1000);

      setTimeLeft(prev => (prev===nextSeconds ? prev : nextSeconds));

      if(nextSeconds<=0){
        speedrunDeadlineRef.current = null;
        setTimedOut(true);
        setPhase("result");
        return;
      }

      speedrunRafRef.current = requestAnimationFrame(tick);
    };

    speedrunRafRef.current = requestAnimationFrame(tick);
    return ()=>{
      if(speedrunRafRef.current){
        cancelAnimationFrame(speedrunRafRef.current);
        speedrunRafRef.current = null;
      }
    };
  },[phase,both,lives,mode.timeLimit,timeLeft,cardIdx]);

  const goToCard=(target)=>{
    setCardStates(prev=>({...prev,[activeIdx]:{guesses,hintsRevealed}}));
    const st=cardStates[target]||(results[target]?{guesses:results[target].guessList||[],hintsRevealed:results[target].hintList||[]}:{guesses:[],hintsRevealed:[]});
    setGuesses(st.guesses); setHintsRevealed(st.hintsRevealed);
    setShowHints(false);
    setShowSkipConfirm(false);
    setPhase("playing");
    setRewindIdx(target===cardIdx?null:target);
  };
  const canRewind = activeIdx>0;
  const showRewindButton = activeIdx>0;
  const skipEnabled = !mode.isDaily;
  const footerBackgroundSrc = showRewindButton
    ? (hintCount===0 ? "/design-reference/Group%2097.svg" : hintCount===1 ? "/design-reference/Group%20102.svg" : "/design-reference/Group%20103.svg")
    : (hintCount===0 ? "/design-reference/Group%2098.svg" : hintCount===1 ? "/design-reference/Group%20100.svg" : "/design-reference/Group%20101.svg");
  const hintButtonLeft = showRewindButton ? 106.5 : 18.5;
  const guessButtonLeft = showRewindButton ? 180.5 : 103.5;
  const guessButtonWidth = skipEnabled ? (showRewindButton ? 134 : 192) : (showRewindButton ? 206 : 284);
  const skipButtonLeft = showRewindButton ? 322.5 : 315.5;
  const canReturnToCurrent = isRewound && activeIdx!==cardIdx;
  const canOpenSkipConfirm = skipEnabled && !canReturnToCurrent && !viewOnly && !showSkipConfirm && !showHints;
  const footerX = (px) => `${(px / 402) * 100}%`;
  const footerY = (px) => `${(px / 94) * 100}%`;
  const showingResult = phase === "result" && !isRewound;
  const hideGameplayForResult = false;
  const handleFooterRightAction=()=>{
    if(canReturnToCurrent){
      goToCard(cardIdx);
      return;
    }
    if(!canOpenSkipConfirm) return;
    setShowSkipConfirm(true);
  };

  const handleResultNext=()=>{
    if(skipped){
      const skipResult={card,found:[false,false],solved:false,guesses:guesses.length,hints:hintsRevealed.length,guessList:[...guesses],hintList:[...hintsRevealed],pts:0,reward:currentReward,skipped:true};
      const nextResults = upsertRoundResult(results, cardIdx, skipResult);
      if(isLast||lives<=0){
        clearSession(mode.id);
        if(mode.isDaily) markDailyDone(totalScore);
        onComplete(nextResults,totalScore,streak);
        return;
      }
      runCardSwap(() => {
        setResults(nextResults);
        setCardIdx(idx=>idx+1);
        setGuesses([]); setHintsRevealed([]);
        setPerfectSolveStreak(0);
        setSkipped(false); setPhase("playing");
      });
      return;
    }
    const pts=calcScore(both,currentReward);
    const lostCard = !both;
    const livesAfterLoss = Math.max(0, lives - (lostCard ? 1 : 0));
    if (lostCard) {
      setLives(v=>Math.max(0,v-1));
    }
    const isPerfectSolve = both && guesses.length===1 && hintCount===0;
    let nextPerfectStreak = isPerfectSolve ? (perfectSolveStreak + 1) : 0;
    let heartBonus = 0;
    if (nextPerfectStreak >= 4) {
      heartBonus = 1;
      nextPerfectStreak = 0;
      setLives(v=>Math.min(mode.maxGuesses, v+1));
    }
    setPerfectSolveStreak(nextPerfectStreak);

    const newStreak=updateStreak(both);
    setStreak(newStreak);
    const newTotal=totalScore+pts;
    setTotalScore(newTotal);
    const roundResult={card,found:effectiveFound,solved:both,guesses:guesses.length,hints:hintsRevealed.length,guessList:[...guesses],hintList:[...hintsRevealed],pts,reward:currentReward};
    const nextResults = upsertRoundResult(results, activeIdx, roundResult);

    if (isRewound && activeIdx !== cardIdx) {
      const currentCardState = cardStates[cardIdx] || (nextResults[cardIdx]
        ? {guesses:nextResults[cardIdx].guessList||[],hintsRevealed:nextResults[cardIdx].hintList||[]}
        : {guesses:[],hintsRevealed:[]});
      setResults(nextResults);
      setGuesses(currentCardState.guesses);
      setHintsRevealed(currentCardState.hintsRevealed);
      setShowHints(false);
      setShowSkipConfirm(false);
      setSkipped(false);
      setTimedOut(false);
      setPhase("playing");
      setRewindIdx(null);
      return;
    }

    if(isLast||livesAfterLoss+heartBonus<=0){
      clearSession(mode.id);
      if(mode.isDaily) markDailyDone(newTotal);
      onComplete(nextResults,newTotal,newStreak);
      return;
    }
    runCardSwap(() => {
      setResults(nextResults);
      setCardIdx(idx=>idx+1);
      setGuesses([]); setHintsRevealed([]);
      setTimeLeft(mode.timeLimit||0); setTimedOut(false);
      speedrunDeadlineRef.current = null;
      setSkipped(false); setPhase("playing");
    });
  };

  const handleRevealDone=()=>{ setPhase("intermission"); };

  const handleIntermissionNext=()=>{
    const pts=calcScore(both,currentReward);
    const roundResult={card,found:effectiveFound,solved:both,guesses:guesses.length,hints:hintsRevealed.length,guessList:[...guesses],hintList:[...hintsRevealed],pts,reward:currentReward};
    const nextResults = upsertRoundResult(results, activeIdx, roundResult);
    if(isLast){
      clearSession(mode.id);
      if(mode.isDaily) markDailyDone(totalScore);
      onComplete(nextResults,totalScore,streak);
      return;
    }
    runCardSwap(() => {
      setResults(nextResults);
      setCardIdx(idx=>idx+1);
      setGuesses([]); setHintsRevealed([]);
      setTimeLeft(mode.timeLimit||0); setTimedOut(false);
      speedrunDeadlineRef.current = null;
      setSkipped(false); setPhase("playing");
    });
  };

  const roundScore=calcScore(both,currentReward);
  const showFooterBar = !showingResult && (!both || canReturnToCurrent);
  const cardStageAnimation = reducedMotion
    ? "none"
    : (cardTransitionPhase === "out"
      ? transitionFamily.cardOut
      : cardTransitionPhase === "in"
        ? transitionFamily.cardIn
        : "none");
  const cameraShakeLayerAnimation = reducedMotion || !showMissShake
    ? "none"
    : transitionFamily.missShake;

  useEffect(() => {
    return () => {
      if (winAnimationTimerRef.current) {
        clearTimeout(winAnimationTimerRef.current);
      }
      if (missShakeTimerRef.current) {
        clearTimeout(missShakeTimerRef.current);
      }
      if (cardSwapTimerRef.current) {
        clearTimeout(cardSwapTimerRef.current);
      }
      if (cardSwapSettleTimerRef.current) {
        clearTimeout(cardSwapSettleTimerRef.current);
      }
      if (genreTransitionTimerRef.current) {
        clearTimeout(genreTransitionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "result" || !both || skipped || timedOut) {
      winAnimationLockRef.current = false;
      setWinAnimationEnded(false);
      return;
    }
    if (winAnimationLockRef.current) return;

    winAnimationLockRef.current = true;
    const pool = STICKER_ASSETS.winAnimations.filter(Boolean);
    const clapboardAnim = pool.find((anim) => {
      const src = (typeof anim === "string" ? anim : anim?.src) || "";
      return src.toLowerCase().includes("clapboard");
    });
    const popcornAnim = pool.find((anim) => {
      const src = (typeof anim === "string" ? anim : anim?.src) || "";
      return src.toLowerCase().includes("popcorn");
    });
    // Alternate win stickers by round: clapboard on odd-numbered cards, popcorn on even-numbered cards.
    const useClapboard = cardIdx % 2 === 0;
    const pick = useClapboard
      ? (clapboardAnim || popcornAnim || pool[0] || null)
      : (popcornAnim || clapboardAnim || pool[0] || null);
    const pickedSrc = typeof pick === "string" ? pick : (pick?.src || null);
    const pickedDuration = typeof pick === "object" && typeof pick?.durationMs === "number"
      ? pick.durationMs
      : 2200;
    setWinAnimationSrc(pickedSrc);
    setWinAnimationDurationMs(pickedDuration);
    setWinAnimationEnded(false);
    winAnimationStartedAtRef.current = Date.now();
    setShowWinAnimation(true);

    // Safety fallback in case a device never fires video onEnded.
    if (winAnimationTimerRef.current) clearTimeout(winAnimationTimerRef.current);
    winAnimationTimerRef.current = setTimeout(() => {
      setWinAnimationEnded(true);
    }, Math.max(3000, pickedDuration + 1400));

  }, [phase, both, skipped, timedOut, cardIdx]);

  useEffect(() => {
    if (!showWinAnimation || !winAnimationEnded) return;
    const MIN_RESULT_VISIBLE_MS = 4200;
    const elapsed = Date.now() - winAnimationStartedAtRef.current;
    const holdMore = Math.max(0, MIN_RESULT_VISIBLE_MS - elapsed);

    if (winAnimationTimerRef.current) clearTimeout(winAnimationTimerRef.current);
    winAnimationTimerRef.current = setTimeout(() => {
      setShowWinAnimation(false);
      winAnimationLockRef.current = false;
      setWinAnimationEnded(false);
    }, holdMore);
  }, [showWinAnimation, winAnimationEnded]);

  useEffect(() => {
    const stateTag = mode
      ? [
          `boot-${APP_BOOT_NONCE}`,
          "game",
          mode.id,
          cardIdx + 1,
          phase,
          skipped ? "skip" : null,
          timedOut ? "timeout" : null,
          isRewound && rewindIdx !== null ? `rewind-${rewindIdx}` : null,
        ].filter(Boolean).join("-")
      : "game";
    const nextUrl = `${window.location.pathname}${window.location.search}#${stateTag}`;
    if (window.location.href !== `${window.location.origin}${nextUrl}`) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [mode, cardIdx, phase, skipped, timedOut, isRewound, rewindIdx]);

  return (
    <div style={{minHeight:"100dvh",position:"relative",paddingLeft:20,paddingRight:20,paddingBottom:24,overflowX:"hidden",...CHECKER_BG,color:T.textOnDark}}>

      {!!genreTransition && (
        <div
          aria-hidden="true"
          style={{
            position:"fixed",
            inset:0,
            zIndex:280,
            pointerEvents:"none",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            animation:`${genreTransition.anim} 520ms ease both`,
            background:"radial-gradient(circle at 50% 52%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 62%)",
            backdropFilter:"blur(1.5px)",
          }}
          key={genreTransition.nonce}
        >
          {!reducedMotion && (
            <LottieOverlay
              key={`genre-lottie-${genreTransition.nonce}`}
              src={LOTTIE_ASSETS.genreByFamily[genreTransition.name] || LOTTIE_ASSETS.smashImpact}
              loop={false}
              speed={1.08}
              style={{
                position:"absolute",
                left:"50%",
                top:"50%",
                width:"min(90vw, 420px)",
                height:"min(90vw, 420px)",
                transform:"translate(-50%, -50%)",
                pointerEvents:"none",
                opacity:0.68,
              }}
            />
          )}
          <div style={{padding:"10px 14px",borderRadius:12,background:"rgba(14,10,44,0.72)",border:"2px solid #1C1D21",boxShadow:"0 4px 0 #1C1D21",display:"inline-flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:15,lineHeight:1}}>{genreTransition.emoji}</span>
            <span style={{...WHITE_STICKER_TEXT,fontSize:11,letterSpacing:"0.04em",textTransform:"uppercase",lineHeight:1}}>{genreTransition.tag}</span>
          </div>
        </div>
      )}

      {/*  AUTO POPUP when round ends (never while rewinding/view-only)  */}
      {showingResult&&(
        <RoundResultPopup
          card={card}
          found={effectiveFound}
          guessCount={guesses.length}
          hintCount={hintCount}
          maxGuesses={mode.maxGuesses}
          roundScore={roundScore}
          cardIdx={cardIdx}
          totalCards={deck.length}
          results={results}
          isLast={isLast}
          skipped={skipped}
          timedOut={timedOut}
          showSticker={showWinAnimation && both}
          stickerSrc={winAnimationSrc}
          stickerDurationMs={winAnimationDurationMs}
          onStickerEnded={() => setWinAnimationEnded(true)}
          reducedMotion={reducedMotion}
          transitionFamily={transitionFamily}
          onNext={handleResultNext}
          onMenu={()=>{clearSession(mode.id);onQuit();}}
        />
      )}

      {/* Persistent exit X — fixed above every popup/modal, matches every Figma reference screen */}
      <button onClick={()=>{clearSession(mode.id);onQuit();}} aria-label="Exit to menu"
        style={{position:"absolute",top:25,left:20,zIndex:400,width:33,height:35,background:"transparent",border:"none",padding:0,cursor:"pointer"}}>
        <img src="/design-reference/Exit.svg" alt="" aria-hidden="true" draggable="false"
          style={{display:"block",width:"100%",height:"100%",pointerEvents:"none",userSelect:"none"}}/>
      </button>

      {/* Out of lives — run is over, Home is the only exit */}
      {lives<=0&&phase!=="result"&&(()=>{
        const m=pickRandom("outOfLives", MSG_BANKS.outOfLives);
        return (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:450,display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
            <div style={{width:"100%",maxWidth:340,...SUNBURST_BG,backgroundColor:T.bgDeep,border:`2px solid ${T.border}`,borderRadius:16,boxShadow:T.shadowLg,padding:"26px 22px 24px",textAlign:"center"}}>
              <div style={{fontSize:38,marginBottom:8}}>{m.emoji}</div>
              <div style={{...YELLOW_STICKER_TEXT,fontSize:15,textTransform:"uppercase",marginBottom:10,lineHeight:1.45}}>{m.headline}</div>
              <p style={{margin:"0 0 22px",fontFamily:"'Outfit',sans-serif",fontSize:14,color:"rgba(255,255,255,0.9)",lineHeight:1.6}}>{m.sub}</p>
              <button onClick={()=>{clearSession(mode.id);onQuit();}} style={{...BTN.primary,width:"100%",padding:"14px 0"}}>Home</button>
            </div>
          </div>
        );
      })()}

      {/* Are-you-sure skip confirmation */}
      {showSkipConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:390,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
          onClick={e=>e.target===e.currentTarget&&setShowSkipConfirm(false)}>
          <div style={{position:"relative",width:"100%",maxWidth:358,aspectRatio:"358 / 184"}}>
            <img src="/design-reference/Skip%20modal.svg" alt="" aria-hidden="true" draggable="false"
              style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block",pointerEvents:"none",userSelect:"none"}}/>
            <button onClick={()=>{setShowSkipConfirm(false);handleSkip();}} aria-label="Skip It"
              style={{position:"absolute",left:`${20.5/358*100}%`,top:`${104/184*100}%`,width:`${124/358*100}%`,height:`${54/184*100}%`,background:"transparent",border:"none",padding:0,cursor:"pointer"}}/>
            <button onClick={()=>setShowSkipConfirm(false)} aria-label="Keep Trying"
              style={{position:"absolute",left:`${154.5/358*100}%`,top:`${104/184*100}%`,width:`${183/358*100}%`,height:`${54/184*100}%`,background:"transparent",border:"none",padding:0,cursor:"pointer"}}/>
          </div>
        </div>
      )}

      {!hideGameplayForResult&&(
      <div style={{maxWidth:402,margin:"0 auto",animation:cameraShakeLayerAnimation}}>

        {/* HEADER — stat row only; the X exit button floats fixed above (see below) */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"72px 0 24px"}}>
          <div style={HUD_STAT_PILL}>
            <IconTarget size={25}/>
            <span style={HUD_COUNTER_TEXT}>{cardIdx+1}/{deck.length}</span>
          </div>
          <div style={HUD_STAT_PILL}>
            <IconStar size={21}/>
            <span style={HUD_COUNTER_TEXT}>PTS: {liveCardPts}</span>
          </div>
          {mode.timeLimit>0&&(
            <div style={HUD_STAT_PILL}>
              <IconStopwatch size={22}/>
              <span style={{...HUD_COUNTER_TEXT,color:timeLeft<=10?"#FF6B6B":"#FFFFFF"}}>
                {String(Math.floor(timeLeft/60)).padStart(1,"0")}:{String(timeLeft%60).padStart(2,"0")}
              </span>
            </div>
          )}
          <div style={HUD_STAT_PILL}>
            <IconHeart size={28}/>
            <span style={HUD_COUNTER_TEXT}>{guessesRemainingForCard}/{mode.maxGuesses}</span>
          </div>
        </div>

        {/* PLAYING — structure matches Figma exactly: plot card, bare hangman tiles,
            guess input, then a fixed bottom button bar. Nothing else. */}
        <div style={{display:"flex",flexDirection:"column",gap:28,animation:cardStageAnimation,paddingBottom:showFooterBar?104:24,transformOrigin:"50% 60%"}}>

              {/*  PLOT CARD  */}
              <div style={{background:"#fff",borderRadius:22,padding:"26px 20px 22px",boxSizing:"border-box",position:"relative",border:`2px solid ${T.border}`,boxShadow:T.shadow,marginTop:0}}>
                <div style={{position:"absolute",top:-12,left:20,minWidth:104,height:24,padding:"0 10px",background:"#44408E",border:`1.5px solid ${T.border}`,borderRadius:4,boxShadow:"0 2px 0 #1C1D21",display:"inline-flex",alignItems:"center",justifyContent:"center",fontFamily:FONT_FIGMA_STICKER,fontSize:11,color:"#F3F4FF",textTransform:"uppercase",letterSpacing:"0.04em",lineHeight:1,whiteSpace:"nowrap"}}>
                  Mashed Plot
                </div>
                <div style={{position:"absolute",top:-14,right:14}}>
                  <DiffBadge level={card.difficulty} reason={card.difficultyReason}/>
                </div>
                <p style={{margin:"6px 0 0",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:"clamp(16px, 5.3vw, 22px)",lineHeight:1.42,color:"#1C1D21"}}>
                  {card.mashedPlot}
                </p>
                {viewOnly&&(()=>{
                  // Skipped cards get their own flavor text so it's clear this is
                  // "you gave up on this one," not "you already spent it down."
                  const st=pickRandom("viewOnly", MSG_BANKS.viewOnly);
                  return (
                    <div style={{marginTop:18,background:T.gold,border:`2px solid ${T.border}`,borderRadius:9,boxShadow:T.shadowSm,padding:"10px 14px",textAlign:"center",transform:"rotate(-1.5deg)"}}>
                      <div style={{fontFamily:FONT_FIGMA_STICKER,fontSize:12,color:T.textPrimary,textTransform:"uppercase"}}>{pastSkipped ? "Skipped — View Only" : st.headline}</div>
                      {!pastSkipped&&(
                        <div style={{fontFamily:FONT_FIGMA_STICKER,fontSize:11,fontWeight:700,color:T.textPrimary,opacity:0.75,marginTop:3,textTransform:"uppercase",letterSpacing:"0.08em"}}>View Only</div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/*  HANGMAN TILES — bare on the purple background, no card wrapper  */}
              <HangmanTitle card={card} found={pastWon?[true,true]:found} guesses={guesses}/>

              {/*  GUESS INPUT  */}
              <GuessInput ref={guessInputRef} onSubmit={handleGuess} disabled={both||cardLost||viewOnly} allowSingleLetterY={allowSingleLetterY}/>


              {/*  GUESSED-SO-FAR CHIPS — not in the Figma mockup, but the game is unplayable
                  without feedback on what you already tried and what it matched.  */}
              {guesses.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:-8}}>
                  {guesses.map((g,i)=>{
                    const state = guessStates[i] || "miss";
                    const chipStyle = state === "match"
                      ? {background:"#1CB5AD", color:"#FFFFFF", icon:<IconCheck size={10}/>} 
                      : {background:"#E46868", color:"#FFFFFF", icon:<IconXMark size={10}/>};
                    return (
                      <span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,
                        background:chipStyle.background,border:`2px solid ${T.border}`,
                        borderRadius:8,padding:"6px 11px",
                        fontFamily:FONT_FIGMA_STICKER,fontSize:11,
                        color:chipStyle.color,textShadow:T.textShadowSticker,textTransform:"uppercase",maxWidth:"100%",overflowWrap:"anywhere",boxShadow:"0 2px 0 #1C1D21"}}>
                        {chipStyle.icon}{g}
                      </span>
                    );
                  })}
                </div>
              )}

              {/*  HINTS MODAL  */}
              {showHints&&!both&&!viewOnly&&(
                <HintsModal card={card} hintsRevealed={hintsRevealed} guessesLeft={guessesRemainingForCard}
                  onReveal={handleRevealHint} onClose={()=>setShowHints(false)} hintAnimationSrc={STICKER_ASSETS.hintAnimation}
                  reducedMotion={reducedMotion} transitionFamily={transitionFamily}/>
              )}

        </div>

        {/*  FIXED BOTTOM BUTTON BAR — hints / guess / skip  */}
        {showFooterBar&&(
          <div style={{position:"fixed",bottom:0,left:0,right:0,display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:60,boxSizing:"border-box",padding:"0 env(safe-area-inset-left) max(env(safe-area-inset-bottom), 0px) env(safe-area-inset-right)",background:"#9381FE",borderTop:`1px solid ${T.border}`}}>
            <div style={{position:"relative",width:"100%",maxWidth:402,aspectRatio:"402 / 94"}}>
              <img src={footerBackgroundSrc} alt="" aria-hidden="true" draggable="false"
                style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block",pointerEvents:"none",userSelect:"none"}}/>

              {!skipEnabled && !canReturnToCurrent && (
                <div
                  aria-hidden="true"
                  style={{
                    position:"absolute",
                    left:footerX(skipButtonLeft - 2),
                    top:footerY(12),
                    width:footerX(72),
                    height:footerY(74),
                    background:"#8f7bfd",
                    borderRadius:12,
                    boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.14)",
                    pointerEvents:"none",
                  }}
                />
              )}

              {showRewindButton&&(
                <button aria-label="Rewind to previous card" onClick={()=>canRewind&&goToCard(activeIdx-1)}
                  disabled={!canRewind||showSkipConfirm||showHints}
                  style={{position:"absolute",left:footerX(15),top:footerY(16),width:footerX(84),height:footerY(66),background:"transparent",border:"none",padding:0,cursor:canRewind?"pointer":"not-allowed"}}/>
              )}

              <button aria-label={viewOnly?"Hints unavailable in view-only":"Open hints"} onClick={()=>!viewOnly&&setShowHints(true)} disabled={viewOnly}
                style={{position:"absolute",left:footerX(hintButtonLeft),top:footerY(16),width:footerX(65),height:footerY(66),background:"transparent",border:"none",padding:0,cursor:viewOnly?"not-allowed":"pointer"}}/>

              <button aria-label="Submit guess" onClick={()=>guessInputRef.current?.submit()} disabled={cardLost||both||viewOnly}
                style={{position:"absolute",left:footerX(guessButtonLeft),top:footerY(18),width:footerX(guessButtonWidth),height:footerY(64),background:"transparent",border:"none",padding:0,cursor:(cardLost||both||viewOnly)?"not-allowed":"pointer"}}/>

              {cardLost&&(
                <div aria-hidden="true"
                  style={{position:"absolute",left:footerX(guessButtonLeft+1),top:footerY(19),width:footerX(guessButtonWidth-2),height:footerY(60),background:"rgba(0,0,0,0.2)",borderRadius:9}}/>
              )}

              {(skipEnabled || canReturnToCurrent) && (
                <>
                  <button aria-label={canReturnToCurrent?"Return to current card":"Skip card"}
                    onClick={handleFooterRightAction}
                    disabled={!canReturnToCurrent&&!canOpenSkipConfirm}
                    style={{position:"absolute",left:footerX(skipButtonLeft),top:footerY(16),width:footerX(65),height:footerY(66),background:"transparent",border:"none",padding:0,cursor:(!canReturnToCurrent&&!canOpenSkipConfirm)?"not-allowed":"pointer"}}/>

                  {canReturnToCurrent && (
                    <div
                      aria-hidden="true"
                      style={{
                        position:"absolute",
                        left:footerX(skipButtonLeft),
                        top:footerY(16),
                        width:footerX(65),
                        height:footerY(66),
                        pointerEvents:"none",
                      }}
                    >
                      <img
                        src="/design-reference/next%20button.svg"
                        alt=""
                        draggable="false"
                        style={{
                          display:"block",
                          width:"100%",
                          height:"100%",
                          userSelect:"none",
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}




function EndScreen({mode,results,totalScore,onMenu,onPlayAgain}) {
  const [copied,setCopied]=useState(false);
  const correct=results.filter(r=>isRoundSolved(r)).length;
  const skippedCount=results.filter(r=>r.skipped).length;
  const missed=results.length-correct-skippedCount-results.filter(r=>!r.skipped&&!isRoundSolved(r)&&r.found[0]!==r.found[1]).length;
  const displayStreakValue = getRunBestStreak(results);

  const shareText=buildShareText(mode,results,totalScore);
  const handleShare=()=>{
    const done=()=>{setCopied(true);setTimeout(()=>setCopied(false),2600);};
    if(navigator.clipboard&&window.isSecureContext){
      navigator.clipboard.writeText(shareText).then(done).catch(()=>fallbackCopy(shareText,done));
    } else {
      fallbackCopy(shareText,done);
    }
  };

  const chips=[
    {icon:<IconCheck size={12} color="#005242"/>, bg:"#6AE89D", value:correct},
    {icon:<IconXMark size={11} color="#5E0311"/>, bg:"#F08D87", value:missed},
    {icon:<IconSkip size={13} color="#fff"/>, bg:T.orange, value:skippedCount},
    {icon:<span style={{fontSize:13,lineHeight:1,display:"inline-block",transform:"translateY(0.5px)"}}>🔥</span>, bg:"linear-gradient(135deg,#FF4A18,#FFCB2E,#FCEF25)", value:displayStreakValue},
    {icon:<IconStar size={13}/>, bg:T.surfaceRaised, value:totalScore.toLocaleString()},
  ];
  const totalCards = Math.max(1, results.length);
  const correctRatio = correct / totalCards;
  const trexMood = correctRatio >= 0.9
    ? "veryHappy"
    : (correctRatio >= 0.5 ? "happy" : "sad");
  const trexSrc = STICKER_ASSETS.trex[trexMood];
  const trexMotion = trexMood === "veryHappy"
    ? "trexBounce 1.25s ease-in-out infinite"
    : trexMood === "sad"
      ? "trexSway 2.2s ease-in-out infinite"
      : "trexFloat 2.6s ease-in-out infinite";

  return (
    <div style={{position:"absolute",inset:0,zIndex:700,overflowY:"auto",...CHECKER_BG,backgroundColor:T.bg,color:T.textOnDark,animation:"fadeIn 0.5s ease"}}>
      <div style={{width:"min(402px, 100vw)",minHeight:"100dvh",margin:"0 auto",padding:"14px 0 24px",boxSizing:"border-box"}}>
      <div style={{width:"100%",minHeight:"calc(100dvh - 38px)",...WIN_RESULT_BG,backgroundColor:T.bgDeep,border:`2px solid ${T.border}`,borderRadius:20,boxShadow:T.shadowLg,padding:"56px 22px 24px",textAlign:"center",boxSizing:"border-box",display:"flex",flexDirection:"column",position:"relative"}}>

        <div style={{...WHITE_STICKER_TEXT,fontSize:"clamp(30px, 8.8vw, 40px)",lineHeight:1.02,marginBottom:10,textTransform:"uppercase"}}>The End</div>
        <div style={{...YELLOW_STICKER_TEXT,fontSize:"clamp(17px, 5.1vw, 24px)",lineHeight:1.04,marginBottom:24,textTransform:"uppercase"}}>Share Your Results</div>

        <div style={{display:"flex",justifyContent:"center",marginBottom:24,minHeight:198,alignItems:"center"}}>
          <img
            src={trexSrc}
            alt="Trex result sticker"
            onError={(e)=>{ e.currentTarget.style.display = "none"; }}
            style={{display:"block",width:"min(96vw, 340px)",maxWidth:"100%",maxHeight:220,objectFit:"contain",filter:"drop-shadow(0 12px 20px rgba(0,0,0,0.38))",animation:trexMotion,transformOrigin:"50% 85%"}}
          />
        </div>

        {/* Stat chip row */}
        <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:24,flexWrap:"nowrap"}}>
          {chips.map((c,i)=>(
            <div key={i} style={{background:c.bg,border:`1.5px solid ${T.border}`,borderRadius:10,boxShadow:"0 3px 0 #1C1D21",padding:"12px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:7,flex:"1 1 0",maxWidth:62,minHeight:104,justifyContent:"center",boxSizing:"border-box"}}>
              <div style={{height:22,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>{c.icon}</div>
              <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:16,color:T.textPrimary,lineHeight:1,display:"inline-block",transform:"translateY(1px)"}}>{c.value}</span>
            </div>
          ))}
        </div>

        <button onClick={handleShare} style={{...BTN.cyan,width:"100%",padding:"16px 0",marginBottom:18}}>
          <span style={{...WHITE_STICKER_TEXT,fontSize:"clamp(18px, 5.2vw, 24px)",lineHeight:1.02,letterSpacing:"0.03em",textTransform:"uppercase"}}>{copied?"Copied ✓":"Copy"}</span>
        </button>

        <div style={{marginTop:"auto",display:"flex",gap:10}}>
          <button onClick={onMenu} style={{...BTN.cyan,flex:1,padding:"13px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:12}}>
            <span aria-hidden="true">🎬</span>
            <span style={{...WHITE_STICKER_TEXT,fontSize:12,letterSpacing:"0.03em",textTransform:"uppercase"}}>Home</span>
          </button>
          <button onClick={onPlayAgain} style={{...BTN.primary,flex:1,padding:"13px 0",fontSize:12}}>
            <span style={{...WHITE_STICKER_TEXT,fontSize:12,letterSpacing:"0.03em",textTransform:"uppercase"}}>Play Again</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}


// 
// ROOT
// 
function PlotMixApp() {
  // Inject background into document.head immediately — before React renders anything
  // This prevents Android WebView from showing its default dark background
  useEffect(()=>{
    document.documentElement.style.cssText = 'background:#7462FC !important;background-color:#7462FC !important;color:#FFFFFF !important;';
    document.body.style.cssText = 'background:#7462FC !important;background-color:#7462FC !important;color:#FFFFFF !important;margin:0;padding:0;min-height:100dvh;';
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#7462FC';
    document.head.appendChild(meta);
    const style = document.createElement('style');
    style.textContent = 'html,body{background:#7462FC!important;background-color:#7462FC!important;color:#FFFFFF!important;}';
    document.head.appendChild(style);
    return ()=>{ document.head.removeChild(style); };
  },[]);
  const [screen,setScreen]=useState("intro");
  const [mode,setMode]=useState(null);
  const [deck,setDeck]=useState([]);
  const [results,setResults]=useState([]);
  const [totalScore,setTotalScore]=useState(0);
  const [resumeState,setResumeState]=useState(null);
  const [showHelp,setShowHelp]=useState(false);
  const [completedRun,setCompletedRun]=useState(null);

  useEffect(() => {
    if (screen === "end" && !completedRun) {
      setScreen("menu");
    }
  }, [screen, completedRun]);

  // onSelect(mode) = start fresh | onSelect(null, modeId) = resume saved run
  const handleModeSelect=(m, resumeModeId=null)=>{
    if(m&&!resumeModeId) clearSession(m.id);   // fresh run => fresh deck
    if(resumeModeId){
      const saved=loadSession(resumeModeId);
      if(!saved) return;
      const foundMode=GAME_MODES.find(gm=>gm.id===saved.modeId)||GAME_MODES[1];
      setMode(foundMode);
      setDeck(saved.deck);
      setCompletedRun(null);
      setShowHelp(false);
      setResumeState({
        cardIdx:saved.cardIdx,
        guesses:saved.guesses,
        hintsRevealed:saved.hintsRevealed,
        results:saved.results,
        totalScore:saved.totalScore,
        lives:saved.lives,
        timeLeft:saved.timeLeft,
      });
      setScreen("game");
      return;
    }
    const d=buildDeck(m);
    setMode(m); setDeck(d); setResumeState(null); setCompletedRun(null); setShowHelp(false); setScreen("game");
  };

  const [finalStreak,setFinalStreak]=useState(null);
  const handleComplete=(r,score,streak)=>{
    setCompletedRun({mode,results:r,totalScore:score,streak:streak||null});
    setResults([]); setTotalScore(0); setDeck([]); setResumeState(null); setFinalStreak(streak||null); setShowHelp(false); setScreen("end");
  };

  useEffect(() => {
    const tag = screen === "game" && mode ? `boot-${APP_BOOT_NONCE}-game-${mode.id}` : `boot-${APP_BOOT_NONCE}-${screen}`;
    const nextUrl = `${window.location.pathname}${window.location.search}#${tag}`;
    if (window.location.href !== `${window.location.origin}${nextUrl}`) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [screen, mode]);

  const goMenu=()=>{
    setScreen("menu"); setMode(null); setDeck([]); setResults([]); setTotalScore(0);
    setResumeState(null); setCompletedRun(null); setShowHelp(false);
  };

  const handlePlayAgain=()=>{
    const nextMode = completedRun?.mode || mode;
    if(!nextMode) return goMenu();
    const d=buildDeck(nextMode);
    setMode(nextMode); setDeck(d); setResumeState(null); setResults([]); setTotalScore(0); setCompletedRun(null); setShowHelp(false); setScreen("game");
  };

  return (
    <div style={{background:T.bg,backgroundColor:T.bg,color:T.textOnDark,minHeight:"100dvh"}}>
      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #7462FC !important;
          background-color: #7462FC !important;
          color: #FFFFFF !important;
          font-size: 16px !important;
          min-height: 100dvh !important;
          -webkit-font-smoothing: antialiased;
        }

        #root {
          min-height: 100dvh !important;
        }

        *, *::before, *::after {
          box-sizing: border-box !important;
        }

        button {
          -webkit-appearance: none !important;
          appearance: none !important;
          font-family: inherit !important;
        }

        input, textarea, select {
          -webkit-appearance: none !important;
          appearance: none !important;
          color: #1C1D21 !important;
          -webkit-text-fill-color: #1C1D21 !important;
          background-color: #EFF3F8 !important;
          font-family: inherit !important;
        }

        input::placeholder {
          color: rgba(28,29,33,0.4) !important;
          -webkit-text-fill-color: rgba(28,29,33,0.4) !important;
          opacity: 1 !important;
        }

        .guess-input::placeholder {
          font-family: 'Rubik Mono One', sans-serif !important;
          font-size: 14px !important;
          font-weight: 400 !important;
          letter-spacing: 0.02em !important;
          text-transform: uppercase !important;
          color: rgba(28,29,33,0.68) !important;
          -webkit-text-fill-color: rgba(28,29,33,0.68) !important;
          opacity: 1 !important;
        }

        details summary::-webkit-details-marker { display: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #4A45EF; }
        ::-webkit-scrollbar-thumb { background: #D3CBFE; border-radius: 2px; }
        button:active { transform: scale(0.97); }

        @keyframes fadeIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-8px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes titlePop{ 0%{opacity:0;transform:scale(0.75)} 60%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
        @keyframes impactShake { 0%{transform:translateX(0)} 25%{transform:translateX(-6px)} 50%{transform:translateX(5px)} 75%{transform:translateX(-3px)} 100%{transform:translateX(0)} }
        @keyframes impactFlash { 0%{opacity:0} 30%{opacity:1} 100%{opacity:0} }
        @keyframes winStickerPop { 0%{opacity:0;transform:scale(0.72)} 30%{opacity:1;transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
        @keyframes popupBackdropIn { from{opacity:0} to{opacity:1} }
        @keyframes popupSheetPunchy { 0%{transform:translateY(34px) scale(0.96)} 65%{transform:translateY(-9px) scale(1.01)} 100%{transform:translateY(0) scale(1)} }
        @keyframes popupSheetDreamy { 0%{transform:translateY(44px) scale(0.98); opacity:0.4} 100%{transform:translateY(0) scale(1); opacity:1} }
        @keyframes popupSheetRetro { 0%{transform:translateY(40px); opacity:0} 35%{transform:translateY(16px); opacity:0.55} 75%{transform:translateY(-6px); opacity:0.9} 100%{transform:translateY(0); opacity:1} }
        @keyframes popupSheetThriller { 0%{transform:translateY(28px) scale(1.01)} 50%{transform:translateY(-3px) scale(1)} 100%{transform:translateY(0) scale(1)} }
        @keyframes genreWipePunchy { 0%{opacity:0; clip-path:inset(0 100% 0 0)} 35%{opacity:1} 100%{opacity:0; clip-path:inset(0 0 0 100%)} }
        @keyframes genreWipeDreamy { 0%{opacity:0; transform:scale(1.06)} 35%{opacity:1; transform:scale(1)} 100%{opacity:0; transform:scale(0.98)} }
        @keyframes genreWipeRetro { 0%{opacity:0} 20%{opacity:0.95} 40%{opacity:0.35} 60%{opacity:0.95} 100%{opacity:0} }
        @keyframes genreWipeThriller { 0%{opacity:0; clip-path:inset(0 0 100% 0)} 38%{opacity:1; clip-path:inset(0 0 0 0)} 100%{opacity:0; clip-path:inset(100% 0 0 0)} }
        @keyframes cardInPunchy { 0%{transform:translateY(28px) scale(0.97); opacity:0} 100%{transform:translateY(0) scale(1); opacity:1} }
        @keyframes cardOutPunchy { to{transform:translateY(-8px) scale(0.98); opacity:0} }
        @keyframes cardInDreamy { 0%{transform:translateY(20px) scale(0.99); filter:blur(4px); opacity:0} 100%{transform:translateY(0) scale(1); filter:blur(0); opacity:1} }
        @keyframes cardOutDreamy { to{transform:translateY(-6px); opacity:0; filter:blur(3px)} }
        @keyframes cardInRetro { 0%{opacity:0; transform:translateY(16px)} 100%{opacity:1; transform:translateY(0)} }
        @keyframes cardOutRetro { to{opacity:0; transform:translateY(-4px)} }
        @keyframes cardInThriller { 0%{transform:scale(1.02) translateY(10px); filter:contrast(1.25); opacity:0} 100%{transform:scale(1) translateY(0); filter:contrast(1); opacity:1} }
        @keyframes cardOutThriller { to{transform:scale(0.99) translateY(-6px); opacity:0} }
        @keyframes cameraShakePunchy { 0%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(3px)} 100%{transform:translateX(0)} }
        @keyframes cameraShakeDreamy { 0%{transform:translateX(0)} 33%{transform:translateX(-3px)} 66%{transform:translateX(3px)} 100%{transform:translateX(0)} }
        @keyframes cameraShakeRetro { 0%{transform:translateX(0)} 25%{transform:translateX(-4px)} 50%{transform:translateX(4px)} 75%{transform:translateX(-2px)} 100%{transform:translateX(0)} }
        @keyframes cameraShakeThriller { 0%{transform:translateX(0)} 18%{transform:translateX(-5px)} 36%{transform:translateX(5px)} 54%{transform:translateX(-3px)} 72%{transform:translateX(2px)} 100%{transform:translateX(0)} }
        @keyframes scorePulse { 0%{transform:scale(0.88)} 60%{transform:scale(1.08)} 100%{transform:scale(1)} }
        @keyframes vaultDoorIn { 0%{transform:translateY(20px) scale(0.98); opacity:0} 100%{transform:translateY(0) scale(1); opacity:1} }
        @keyframes vaultUnlockPulse { 0%{transform:scale(1)} 35%{transform:scale(1.04)} 100%{transform:scale(1)} }
        @keyframes tapePeelReveal { 0%{clip-path:inset(0 100% 0 0)} 100%{clip-path:inset(0 0 0 0)} }
        @keyframes trexBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes trexSway { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-3deg)} 75%{transform:rotate(3deg)} }
        @keyframes trexFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes homeTrexFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-7px) rotate(-1.2deg)} }
        @keyframes skipStickerDrop { 0%{opacity:0; transform:translateY(-22px) scale(0.86) rotate(-6deg)} 55%{opacity:1; transform:translateY(4px) scale(1.03) rotate(1.5deg)} 100%{opacity:1; transform:translateY(0) scale(1) rotate(0deg)} }
        @keyframes skipSadFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-4px) rotate(-1.5deg)} }
        .pmtc { display:inline-block !important; width:32px !important; height:20px !important; min-width:32px !important; min-height:20px !important; border-radius:5px !important; flex-shrink:0 !important; vertical-align:middle !important; }
      `}</style>
      {screen==="intro"&&<IntroVideoScreen onDone={()=>setScreen(hasOnboarded()?"menu":"onboarding")}/>}
      {screen==="onboarding"&&<Onboarding onDone={()=>{markOnboarded();setScreen("menu");}} onSkip={()=>{markOnboarded();setScreen("menu");}} showSkip/>}
      {screen==="menu"&&<ModeSelect onSelect={handleModeSelect}/>}
      {screen==="game"&&mode&&<GameScreen mode={mode} deck={deck} initialState={resumeState} onQuit={goMenu} onComplete={handleComplete} reducedMotion={false}/>}
      {screen==="end"&&completedRun&&<EndScreen mode={completedRun.mode} results={completedRun.results} totalScore={completedRun.totalScore} onMenu={goMenu} onPlayAgain={handlePlayAgain}/>}
      {/* Not during play: it overlaps the Skip button and swallows its clicks,
          and the Figma gameplay frame has no floating help button. */}
      {screen==="menu"&&<HelpButton onClick={()=>setShowHelp(true)}/>}
      {showHelp&&<HowToPlayModal onClose={()=>setShowHelp(false)}/>}
    </div>
  );
}

export default function PlotMix() {
  return <PlotMixApp key={APP_BOOT_NONCE} />;
}



