import { useState, useEffect, useMemo, useLayoutEffect, useRef, useCallback, forwardRef, useImperativeHandle, useId, Fragment } from "react";
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
    aliases: [["12 angry men"], ["white men can't jump", "white men cant jump"]],
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
    aliases: [["13 going on 30"], ["30 days of night"]],
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
    aliases: [["2001 a space odyssey"], ["space jam", "spacejam"]],
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
    aliases: [["a bugs life", "bugs life"], ["monty python's life of brian"]],
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
    aliases: [["a few good men", "few good men"], ["good will hunting"]],
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
    aliases: [["apocalypse now"], ["now you see me"]],
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
    hintData: {"films": [{"year": 2004, "genre": "Romantic Drama", "actors": ["Ethan Hawke", "Julie Delpy"]}, {"year": 1950, "genre": "Noir Drama", "actors": ["William Holden", "Gloria Swanson"]}]},
  },
  {
    id: 10,
    mashedTitle: "Being John Wick",
    mashedPlot: "A puppeteer discovers a portal that leads literally into the head of a former hitman who is pulled back into the criminal underworld he left behind after a group of gangsters steal his car and kill the puppy left to him by his late wife.",
    movies: ["Being John Malkovich", "John Wick"],
    aliases: [["being john malkovich"], ["john wick"]],
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
    aliases: [["brokeback mountain"], ["back to the future"]],
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
    aliases: [["captain fantastic"], ["fantastic mr fox", "fantastic mr. fox"]],
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
    aliases: [["charlie's angels", "charlies angels"], ["charlie and the chocolate factory"]],
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
    aliases: [["city of god"], ["the godfather", "godfather"]],
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
    aliases: [["crouching tiger hidden dragon"], ["hidden figures"]],
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
    aliases: [["dirty harry"], ["when harry met sally"]],
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
    aliases: [["edge of tomorrow"], ["tomorrow never dies"]],
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
    aliases: [["eternal sunshine of the spotless mind"], ["a beautiful mind", "beautiful mind"]],
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
    aliases: [["fantastic beasts and where to find them"], ["finding nemo"]],
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
    aliases: [["grizzly man"], ["man on the moon"]],
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
    aliases: [["how to train your dragon"], ["train to busan"]],
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
    aliases: [["how to lose a guy in 10 days"], ["10 things i hate about you"]],
    hints: ["Both are turn-of-the-millennium romantic comedies built around elaborate deceptions about love.", "Both feature a man paid or bet to win over a woman who wants nothing to do with him.", "Think: Kate Hudson meets Julia Stiles and Heath Ledger."],
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
    aliases: [["i know what you did last summer"], ["500 days of summer"]],
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
    aliases: [["independence day"], ["the day of the jackal", "day of the jackal"]],
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
    aliases: [["kill bill"], ["bill and teds excellent adventure", "bill & ted's excellent adventure"]],
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
    aliases: [["licence to kill"], ["to kill a mockingbird"]],
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
    aliases: [["meet joe black"], ["black hawk down", "blackhawk down"]],
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
    aliases: [["monsters inc", "monsters inc."], ["the incredibles", "incredibles"]],
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
    aliases: [["no country for old men"], ["oldboy", "old boy"]],
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
    aliases: [["portrait of a lady on fire"], ["lady and the tramp", "lady & the tramp"]],
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
    aliases: [["quantum of solace"], ["soul"]],
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
    aliases: [["revolutionary road"], ["the road to el dorado", "road to el dorado"]],
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
    aliases: [["run lola run"], ["chicken run"]],
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
    aliases: [["shaun of the dead"], ["dead poets society"]],
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
    aliases: [["singin in the rain", "singin' in the rain"], ["rain man", "rainman"]],
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
    connection: "Some Like It Hot and Hot Fuzz are both comedies in which ordinary people stumble into violent criminal conspiracies and must use wit and disguise to survive \u2014 separated by nearly fifty years and an ocean.",
    hintData: {"films": [{"year": 1959, "genre": "Comedy", "actors": ["Marilyn Monroe", "Tony Curtis"]}, {"year": 2007, "genre": "Action Comedy", "actors": ["Simon Pegg", "Nick Frost"]}]},
  },
  {
    id: 45,
    mashedTitle: "Spirited Cast Away",
    mashedPlot: "A 10-year-old girl wanders into a bathhouse ruled by gods, witches and spirits. When she wants to return she discovers that her parents have been transformed into pigs and that she is now stranded on a remote island. Forced to survive alone, she adapts to the harsh environment, forming an emotional bond with a volleyball.",
    movies: ["Spirited Away", "Cast Away"],
    aliases: [["spirited away"], ["cast away", "castaway"]],
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
    aliases: [["superbad"], ["bad boys"]],
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
    mashedPlot: "Two teenagers meet at a cancer support group in Indianapolis and fall deeply in love. When they travel to Amsterdam to meet a reclusive author, they discover he has secretly been recruited by the Rebel Alliance — and that the only way to save their relationship is to destroy the Death Star.",
    movies: ["The Fault in Our Stars", "Star Wars"],
    aliases: [["the fault in our stars", "fault in our stars"], ["star wars"]],
    hints: ["One is a 2014 teen romance based on a John Green novel. The other is a 1977 space opera that changed cinema forever.", "One stars Shailene Woodley and Ansel Elgort. The other stars Mark Hamill, Harrison Ford and Carrie Fisher.", "A terminal cancer diagnosis meets the Force, lightsabers, and a galaxy far, far away."],
    difficulty: "Easy",
    difficultyReason: "Both films are massively well-known and the title mashup writes itself — players will laugh the moment they see the answer",
    connection: "Both films are fundamentally about young people confronting impossible odds — one against illness, one against an evil empire — and choosing love and hope anyway.",
    hintData: {"films":[{"year":2014,"genre":"Romantic Drama","actors":["Shailene Woodley","Ansel Elgort"]},{"year":1977,"genre":"Sci-Fi Adventure","actors":["Mark Hamill","Harrison Ford","Carrie Fisher"]}]},
  },
  {
    id: 52,
    mashedTitle: "The Grand Budapest Hotel Rwanda",
    mashedPlot: "A devoted hotel concierge and his young prot\u00e9g\u00e9 become entangled in an adventure involving a priceless painting while sheltering over a thousand Tutsi refugees, risking their lives to save others amid escalating violence in Kigali.",
    movies: ["The Grand Budapest Hotel", "Hotel Rwanda"],
    aliases: [["the grand budapest hotel", "grand budapest hotel"], ["hotel rwanda"]],
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
    aliases: [["the green mile", "green mile"], ["8 mile"]],
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
    aliases: [["vanilla sky"], ["skyfall"]],
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
    aliases: [["waterworld"], ["world war z"]],
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
    aliases: [["xxx"], ["x-men", "xmen", "x men"]],
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
    aliases: [["y tu mama tambien", "y tu mamá también"], ["mamma mia", "mamma mia!"]],
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
    aliases: [["zero dark thirty"], ["the dark knight", "dark knight"]],
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
    aliases: [["Breakfast Club"], ["Breakfast at Tiffanys"]],
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
    aliases: [[], []],
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
    aliases: [["Little Miss Sunshine"], ["Eternal Sunshine of the Spotless Mind"]],
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
    aliases: [["Blackswan"], ["Blackhawk Down"]],
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
    aliases: [[], []],
    hints: ["One is a 2011 Cameron Crowe family drama starring Matt Damon. The other is a 2001 comedy starring Ben Stiller as a dimwitted supermodel.", "One is heartwarming and features actual animals. The other features a look called Blue Steel.", "A struggling zoo meets the world's most dangerous male model."],
    difficulty: "Easy",
    difficultyReason: "Both films are instantly recognizable and the premise mashup is absurd in the best possible way",
    connection: "Both films are about men who are completely out of their depth trying to make something work — one a grieving dad with a zoo, one a model who can't turn left.",
    hintData: {"films":[{"year":2011,"genre":"Family Drama","actors":["Matt Damon","Scarlett Johansson"]},{"year":2001,"genre":"Comedy","actors":["Ben Stiller","Owen Wilson"]}]}
  },
  {
    id: 70,
    mashedTitle: "Independence Groundhog Day",
    mashedPlot: "A cocky fighter pilot wakes up on July 4th to find Earth under attack by a massive alien invasion fleet. He joins the resistance, helps destroy an alien mothership — then wakes up on July 4th again. And again. Every time he dies fighting the aliens, the day resets, and he has to find a new way to save humanity from scratch.",
    movies: ["Independence Day", "Groundhog Day"],
    aliases: [[], ["Ground Hog Day"]],
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
    aliases: [["Princess Bride"], []],
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
    aliases: [[], []],
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
    aliases: [["Crazy Stupid Love"], []],
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
    aliases: [["Devil Wears Prada"], ["Pride & Prejudice"]],
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
    aliases: [["Lion King"], ["Kings Speech"]],
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
    aliases: [[], []],
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
    aliases: [["Nightmare Before Christmas"], []],
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
    aliases: [["Its a Wonderful Life"], []],
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
    aliases: [[], []],
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
    aliases: [[], []],
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
    aliases: [[], []],
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
    aliases: [[], []],
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
    aliases: [[], []],
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
    aliases: [["Sixth Sense"], ["Sense & Sensibility"]],
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
    aliases: [[], []],
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
    aliases: [["Quiet Place"], ["Place Beyond the Pines"]],
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
    aliases: [[], []],
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
    aliases: [[], []],
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
    aliases: [["Snow White and the Seven Dwarfs"], ["Seven Year Itch"]],
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
    aliases: [[], []],
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
    aliases: [[], []],
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
    aliases: [[], []],
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
    aliases: [[], []],
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
    aliases: [[], []],
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
    aliases: [[], ["Wolf of Wall Street"]],
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
// SCORING & HINT SYSTEM
//
// Base reward per card: 10 points
// Hint Tier 1 (metadata): lowers reward by 1
// Hint Tier 2 (actors):   lowers reward by 3
// Wrong guess:            lowers reward by 1 per wrong word (title words, grammar words and correct film names are free)
// Guessing films individually: no reward penalty (still considered correct progress)
// Formula: currentReward = max(0, baseReward - hintPenalty - wrongGuessPenalty)
// 

const BASE_REWARD = 10;   // the run's starting budget, in budget units (owner decision 2026-11-04)
// One studio budget for the whole run: wrong words and hints spend it, and when it hits $0 the
// studio cancels the picture: GAME OVER. Owner decision 2026-11-05: one unit is shown as $10M,
// so the budget starts at (and can never rise above) $100M. Only a clean solve (no paid hints,
// no wrong words) earns BOX_OFFICE back, and never past the $100M cap.
const STARTING_BUDGET = BASE_REWARD;
const BOX_OFFICE = 2;
const BUDGET_UNIT_M = 10;
const money = (n) => `$${n * BUDGET_UNIT_M}M`;

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
  // Owner decision 2026-10-22: a nudge between the two, from the card's written clue.
  {
    id: "whisper",
    tier: 3,
    label: "Director's Whisper",
    description: "A nudge about both films, with title words blanked out",
    tokenCost: 1,
    rewardPenalty: 2,
  },
  // Future tiers slot in here: quotes, taglines, director, poster fragments, etc.
];

// Individual film guesses are valid progress and should not reduce reward.
const INDIVIDUAL_FILM_PENALTY = 0;
const WRONG_GUESS_REWARD_PENALTY = 1;


// Live reward calculation — called every render so player sees it drop in real time
// hintsRevealed = array of tier IDs revealed so far
// filmsGuessedIndividually = count of films found via individual guess (not mash title)
// wrongWordPenalty = points lost to wrong guesses: one per wrong word in each guess
function calcReward(hintsRevealed, filmsGuessedIndividually, wrongWordPenalty, base = BASE_REWARD) {
  const tokensPenalty = hintsRevealed.reduce((acc, tierId) => {
    const tier = HINT_TIERS.find(t => t.id === tierId);
    return acc + (tier ? tier.rewardPenalty : 0);
  }, 0);
  return Math.max(
    0,
    base
      - tokensPenalty
      - (filmsGuessedIndividually * INDIVIDUAL_FILM_PENALTY)
      - (wrongWordPenalty * WRONG_GUESS_REWARD_PENALTY)
  );
}

// Score = straight reward, no multiplier
// The run's score is films released: one per solved card.
function calcScore(won) {
  return won ? 1 : 0;
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

// Daily rotation (owner decision 2026-10-19): from this local date on, the Daily goes
// through every card in one fixed shuffled order before any card repeats. Earlier
// dates keep the original per-date shuffle, so no one's Daily changes mid-day.
// Adding or removing cards reshuffles the order for days not yet played.
const DAILY_ROTATION_START = new Date(2026, 10, 1); // 1 November 2026
const DAILY_ROTATION_SEED = 20261101;
function localDayNumber(d) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
// The Daily card for a date (themed weeks first, then the fixed rotation); null before the rotation starts.
function dailyCardFor(sourceDeck, date) {
  return themedDailyCard(sourceDeck, date) || dailyRotationCard(sourceDeck, date);
}
function dailyRotationCard(sourceDeck, date) {
  const dayIndex = localDayNumber(date) - localDayNumber(DAILY_ROTATION_START);
  if (dayIndex < 0 || sourceDeck.length === 0) return null;
  const order = shuffleRng([...sourceDeck].sort((a, b) => a.id - b.id), mulberry32(DAILY_ROTATION_SEED));
  return order[dayIndex % order.length];
}

function buildDeck(mode) {
  const { id, roundCount, isDaily } = mode;
  const sourceDeck = uniqueCardsByMoviePair(MASTER_DECK);
  const cap = Math.min(roundCount, sourceDeck.length);
  if (isDaily) {
    const dayCard = dailyCardFor(sourceDeck, new Date());
    if (dayCard) return [dayCard].slice(0, cap);
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

  // Owner decision 2026-10-22: a new player's very first Standard card is an Easy one.
  let firstEver = false;
  try { firstEver = !localStorage.getItem(LS_PLAYED_STANDARD); localStorage.setItem(LS_PLAYED_STANDARD, "1"); } catch {}
  if (firstEver) {
    const easy = shuffled.find((card) => card.difficulty === "Easy");
    if (easy) {
      saveRecentStandardStarts([easy.id]);
      return [easy, ...shuffled.filter((card) => card.id !== easy.id)].slice(0, cap);
    }
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
    .replace(/['’]/g, "")           // can't → cant (apostrophes never split a word)
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
    .replace(/['’]/g, "")
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

// Grammar words a player never has to type to complete a title word by word.
// Real title words ("day", "will", "there", "being", ...) must not be listed here.
const STOPWORDS = new Set(["the","a","an","and","of","in","on","at","to","for","with","is","it","or","from","by"]);

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



// Words in a guess that are neither in the mashed title nor grammar words.
// Each one costs a point (owner rule, 2026-10-19); correct words are free.
function wrongWordsInGuess(guess, card) {
  const titleTokens = new Set(
    normWord(card.mashedTitle || "")
      .split(" ")
      .filter(Boolean)
      .map(normalizeToken)
  );
  return normWord(guess)
    .split(" ")
    .filter(Boolean)
    .map(normalizeToken)
    .filter((token) => token && !STOPWORDS.has(token) && !titleTokens.has(token));
}

// If players reveal every meaningful word in the mashed title, treat the round
// as solved even when guesses were entered as separate words.
function areAllMashedTitleWordsGuessed(guesses, mashedTitle = "", movies = [], found = [false, false]) {
  const rawTitleWords = normWord(mashedTitle).split(" ").filter(Boolean);
  const titleTokens = rawTitleWords
    .map(normalizeToken)
    .filter((token) => token && !STOPWORDS.has(token));

  if (titleTokens.length === 0) return false;

  const required = new Set(titleTokens);
  const guessed = new Set();

  guesses.forEach((g) => {
    // Every title word in any guess counts, however many words the guess had.
    // This is the same rule HangmanTitle uses to reveal tiles, so a title that
    // is fully shown on screen is also solved.
    normWord(g)
      .split(" ")
      .filter(Boolean)
      .map(normalizeToken)
      .forEach((token) => { if (required.has(token)) guessed.add(token); });
    // Title words typed run together ("officespace") count for each word they join.
    normWord(g).split(" ").filter(Boolean).forEach((typed) => {
      for (let i = 0; i < rawTitleWords.length; i++) {
        for (let len = 2; len <= 3 && i + len <= rawTitleWords.length; len++) {
          const run = rawTitleWords.slice(i, i + len);
          if (normalizeToken(typed) === normalizeToken(run.join(""))) {
            run.map(normalizeToken).forEach((token) => { if (required.has(token)) guessed.add(token); });
          }
        }
      }
    });
  });
  // A film already named reveals all of its words too (owner report 2026-10-26: "officespace"
  // then "cowboys" showed the whole of "Office Space Cowboys" but didn't solve it).
  movies.forEach((m, i) => {
    if (!found[i]) return;
    normWord(m).split(" ").filter(Boolean).map(normalizeToken)
      .forEach((token) => { if (required.has(token)) guessed.add(token); });
  });

  return Array.from(required).every((token) => guessed.has(token));
}

// True when the guess is exactly one film's title (or accepted spelling of it).
function isExactFilmName(guess, movies, aliases = []) {
  const g = norm(guess);
  return movies.some((m, i) => [m, ...((aliases[i]) || [])].some((t) => norm(t) === g));
}

function checkGuesses(guesses, movies, aliases, mashedTitle="") {
  const found=[false,false];
  guesses.forEach(g=>{
    // Mashed title: accept robust near-full matches but still reject short partials.
    // Naming one film exactly only ever counts for that film, even when it is
    // within typo distance of the mashed title ("The Green Mile" vs "The Green 8 Mile").
    if(!isExactFilmName(g, movies, aliases) && isMashedTitleGuess(g, mashedTitle)) {
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
  // A correct film name or full title, or a guess made only of title words
  // (and grammar words), is never a miss.
  if (isFullyCorrectGuess(guess, card)) return "match";
  // Grammar words are free alongside real title words, but a guess of only small words that
  // aren't in the title ("of", "on" for "...Mermaid in Manhattan") is not correct (owner report
  // 2026-10-26: they were ticked green and revealed nothing).
  const titleTokens = new Set(normWord(card.mashedTitle || "").split(" ").filter(Boolean).map(normalizeToken));
  const tokens = normWord(guess).split(" ").filter(Boolean).map(normalizeToken);
  if (!tokens.some((t) => titleTokens.has(t))) return "miss";
  if (wrongWordsInGuess(guess, card).length === 0) return "match";
  return "miss";
}

// Points a guess costs: one per wrong word; correct guesses cost nothing.
function guessPenalty(guess, card) {
  if (guessClassification(guess, card) === "match") return 0;
  return Math.max(1, wrongWordsInGuess(guess, card).length);
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
const LS_PLAYED_STANDARD = "plotmix_played_standard";
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
// The first Daily result of the day is the one kept and shared; replays don't
// overwrite it. Returns true when this call recorded the day's first result.
// First completion of today's Daily also counts toward the Daily streak.
// It also counts toward the Gold Lamé curtains: 3 Dailies in a row solved with no wrong guess.
function completeDaily(score, shareText, results = []) {
  const first = markDailyDone(score, shareText);
  if (first) {
    recordDailyPlayed();
    recordPerfectDaily(results.length > 0 && results.every((r) => r.solved && (r.wrong || 0) === 0));
  }
  return first;
}
function markDailyDone(score, shareText) {
  try{
    if(localStorage.getItem(getDailyKey())) return false;
    localStorage.setItem(getDailyKey(),JSON.stringify({score,shareText,date:new Date().toISOString()}));
    return true;
  }catch{ return true; }
}
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
  if (typeof session.budget !== "number") return false;
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

// Sound on/off (owner decision 2026-10-19), remembered between visits.
const LS_SOUND = "plotmix_sound";
function isSoundOn() { try { return localStorage.getItem(LS_SOUND) !== "off"; } catch { return true; } }
function setSoundOn(on) { try { localStorage.setItem(LS_SOUND, on ? "on" : "off"); } catch {} }

function playTone(frequency, type, duration, gain, delayStart=0, rampDown=true) {
  if (!isSoundOn()) return;
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

// Filtered noise with a soft swell, for whooshes, rustles, rattles and splats.
// filter: {type, from, to, q} sweeps the filter frequency over the sound.
let _noiseBuf = null;
function playNoise(duration, gain, delayStart = 0, filter = { type: "bandpass", from: 800, to: 800, q: 1 }, attack = 0.05) {
  if (!isSoundOn()) return;
  try {
    const ctx = getACtx(); if (!ctx) return;
    if (!_noiseBuf) {
      _noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = _noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t0 = ctx.currentTime + delayStart;
    const src = ctx.createBufferSource(); src.buffer = _noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = filter.type; f.Q.value = filter.q || 1;
    f.frequency.setValueAtTime(filter.from, t0);
    f.frequency.linearRampToValueAtTime(filter.to, t0 + duration);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + Math.min(attack, duration / 2));
    g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    src.connect(f); f.connect(g); g.connect(ctx.destination);
    src.start(t0); src.stop(t0 + duration + 0.02);
  } catch (e) {}
}

// A held "sh": fast rise, steady hold, short release, through two "sh" formant bands.
function playShush(duration, gain, delayStart = 0) {
  if (!isSoundOn()) return;
  try {
    const ctx = getACtx(); if (!ctx) return;
    if (!_noiseBuf) {
      _noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = _noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t0 = ctx.currentTime + delayStart, rel = Math.min(0.18, duration / 3);
    [[2700, 1.8, 1], [1900, 1.4, 0.55]].forEach(([freq, q, mix]) => {
      const src = ctx.createBufferSource(); src.buffer = _noiseBuf;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = q;
      f.frequency.setValueAtTime(freq * 1.06, t0);
      f.frequency.linearRampToValueAtTime(freq * 0.94, t0 + duration);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(gain * mix, t0 + 0.06);
      g.gain.setValueAtTime(gain * mix, t0 + duration - rel);
      g.gain.linearRampToValueAtTime(0.0001, t0 + duration);
      src.connect(f); f.connect(g); g.connect(ctx.destination);
      src.start(t0, Math.random()); src.stop(t0 + duration + 0.02);
    });
  } catch (e) {}
}

// One synth voice with an optional pitch slide and a low-pass filter (brass, whistles, voices).
function playSynth({ type = "sawtooth", freq, slideTo = null, dur, gain, delay = 0, lp = null, attack = 0.02, vibrato = 0 }) {
  if (!isSoundOn()) return;
  try {
    const ctx = getACtx(); if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    let node = o;
    if (lp) { const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = lp; o.connect(f); node = f; }
    if (vibrato) {
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 6; lg.gain.value = vibrato; lfo.connect(lg); lg.connect(o.frequency); lfo.start(t0); lfo.stop(t0 + dur + 0.05);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.setValueAtTime(gain, t0 + Math.max(attack, dur * 0.6));
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    node.connect(g); g.connect(ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  } catch (e) {}
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
// A brass-ish chord: a few detuned sawtooth voices through a warm filter.
function playChord(freqs, dur, gain, delay = 0) {
  freqs.forEach((f) => { playSynth({ freq: f, dur, gain, delay, lp: 1800, attack: 0.03 }); playSynth({ freq: f * 1.005, dur, gain: gain * 0.6, delay, lp: 1400, attack: 0.03 }); });
}
// Light applause: many tiny hand-claps, thinning out, at a random density.
function playClapping(seconds, density, gain, delay = 0) {
  const n = Math.round(seconds * density);
  for (let i = 0; i < n; i++) {
    const t = delay + Math.random() * seconds * (0.4 + 0.6 * Math.random());
    playNoise(0.03 + Math.random() * 0.02, gain * (0.5 + Math.random() * 0.5), t, { type: "bandpass", from: 900 + Math.random() * 1600, to: 900 + Math.random() * 1600, q: 1.2 }, 0.002);
  }
}
function playWhistle(delay = 0) {
  if (Math.random() < 0.5) { // wolf whistle: up, then up-and-down
    playSynth({ type: "sine", freq: 1100, slideTo: 2300, dur: 0.22, gain: 0.05, delay, attack: 0.02 });
    playSynth({ type: "sine", freq: 1000, slideTo: 2500, dur: 0.18, gain: 0.05, delay: delay + 0.3, attack: 0.02 });
    playSynth({ type: "sine", freq: 2500, slideTo: 900, dur: 0.3, gain: 0.045, delay: delay + 0.48, attack: 0.01 });
  } else { // a long rising "woo" whistle
    playSynth({ type: "sine", freq: 1500, slideTo: 2900, dur: 0.55, gain: 0.045, delay, attack: 0.05, vibrato: 18 });
  }
}

// Vibration on Android phones (iPhone browsers don't support it). Follows the sound button.
function buzz(pattern) {
  if (!isSoundOn()) return;
  try { if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(pattern); } catch {}
}

const SFX = {
  laser: () => {
    playTone(1500, "sawtooth", 0.06, 0.05);
    playTone(900, "sawtooth", 0.08, 0.05, 0.04);
    playTone(500, "square", 0.08, 0.03, 0.09);
  },
  boom: () => {
    playTone(120, "square", 0.22, 0.09);
    playTone(70, "sawtooth", 0.3, 0.08, 0.03);
  },
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
  // Cinema extras: every sound is generated here, no audio files.
  clap: () => {
    playTone(1800,"square",0.03,0.08);
    playTone(240,"triangle",0.08,0.1,0.01);
  },
  pop: () => {
    [0,0.05,0.11].forEach((d,i)=>playTone(1150+i*260,"sine",0.04,0.06,d));
  },
  projector: (seconds = 0.95) => {
    // A film reel running: the sprocket clatter (about 20 clicks a second) over a low motor hum.
    const clicks = Math.round(seconds * 20);
    for (let i = 0; i < clicks; i++) playNoise(0.022, 0.09, i * 0.05, { type: "highpass", from: 2200, to: 2200, q: 0.8 }, 0.002);
    for (let i = 0; i < clicks; i += 2) playTone(70, "square", 0.03, 0.025, i * 0.05);
    playTone(55, "sawtooth", seconds, 0.018);
  },
  leaderBeep: (go=false) => {
    playTone(go?1320:880,"sine",go?0.32:0.12,0.12);
  },
  curtain: (delay = 0.25) => {
    // Heavy velvet sliding open: two swells of filtered noise (one per side) plus a soft rustle.
    playNoise(1.2, 0.16, delay, { type: "bandpass", from: 380, to: 1400, q: 0.7 }, 0.35);
    playNoise(1.0, 0.1, delay + 0.08, { type: "bandpass", from: 520, to: 1800, q: 0.9 }, 0.3);
    playNoise(0.5, 0.05, delay + 0.6, { type: "highpass", from: 2500, to: 4000, q: 0.5 }, 0.1);
  },
  // A solved card (owner request 2026-10-26): a "ta-da!" then light applause and the odd
  // whistle, mixed differently every time so it never sounds the same twice.
  winCheer: () => {
    const C = 261.63, E = 329.63, G = 392, C5 = 523.25, E5 = 659.25, G5 = 783.99;
    const fanfare = pick([
      () => { playChord([G, C5 * 0.5 * 2, E5 * 0.5 * 2].map((f) => f), 0.14, 0.035); playChord([C5, E5, G5], 0.7, 0.04, 0.16); },     // ta-DAA
      () => { [C5, E5, G5].forEach((f, i) => playSynth({ freq: f, dur: 0.12, gain: 0.05, delay: i * 0.09, lp: 2200 })); playChord([C5, E5, G5, C5 * 2], 0.7, 0.03, 0.27); }, // da-da-da-DAA
      () => { playChord([E, G, C5], 0.12, 0.035); playChord([E, G, C5], 0.12, 0.035, 0.14); playChord([G, C5, E5], 0.75, 0.04, 0.3); }, // ta-ta-DAA
      () => { playChord([C, E, G], 0.18, 0.035); playChord([C5, E5, G5], 0.8, 0.04, 0.2); playSynth({ type: "triangle", freq: C5 * 2, dur: 0.6, gain: 0.03, delay: 0.25 }); }, // ta-DAA with sparkle
    ]);
    fanfare();
    playClapping(1.4 + Math.random() * 0.6, 14 + Math.random() * 14, 0.07, 0.25);
    if (Math.random() < 0.75) playWhistle(0.45 + Math.random() * 0.5);
    if (Math.random() < 0.3) playWhistle(0.9 + Math.random() * 0.4);
  },
  groan: () => {
    // The audience going "awww": voices sliding down.
    [196, 220, 247, 262].forEach((f, i) => playSynth({ freq: f, slideTo: f * 0.7, dur: 1.0, gain: 0.03, delay: i * 0.04, lp: 900, attack: 0.15, vibrato: 4 }));
  },
  skip: () => {
    // A record scratch, then a sad two-note "wah-wah".
    playNoise(0.12, 0.18, 0, { type: "bandpass", from: 400, to: 3000, q: 2 }, 0.005);
    playNoise(0.1, 0.14, 0.12, { type: "bandpass", from: 3000, to: 500, q: 2 }, 0.005);
    playSynth({ freq: 233, slideTo: 220, dur: 0.3, gain: 0.05, delay: 0.3, lp: 900, vibrato: 3 });
    playSynth({ freq: 208, slideTo: 175, dur: 0.6, gain: 0.05, delay: 0.62, lp: 900, vibrato: 6 });
  },
  page: () => playNoise(0.18, 0.06, 0, { type: "highpass", from: 1500, to: 4500, q: 0.7 }, 0.03), // hints opened: paper rustle
  tick: () => playTone(1400, "sine", 0.03, 0.025), // any button tap
  ticket: () => { for (let i = 0; i < 6; i++) playNoise(0.02, 0.08, i * 0.025, { type: "highpass", from: 3000, to: 3000, q: 1 }, 0.002); }, // ticket tear
  // The usher's "shh... shhhhh!" (owner request 2026-11-05): a held, breathy hiss shaped like a
  // human "sh" (energy around 2-3.5 kHz) rather than a whoosh, so it can't be mistaken for the curtain.
  psst: () => { playShush(0.22, 0.09, 0); playShush(1.15, 0.12, 0.42); },
  rip: () => playNoise(0.35, 0.12, 0, { type: "bandpass", from: 1200, to: 4000, q: 0.9 }, 0.01), // spoiler tape
  // A camera flash (owner feedback 2026-11-05): the shutter's "ka-chik", the flash tube's bright
  // "fwip", and on the last flash of a burst the rising whine of the flash recharging.
  snap: (recharge = false) => {
    playNoise(0.014, 0.22, 0, { type: "bandpass", from: 3600, to: 3200, q: 2.5 }, 0.001);
    playNoise(0.03, 0.16, 0.05, { type: "bandpass", from: 1700, to: 1400, q: 2 }, 0.001);
    playNoise(0.1, 0.1, 0.004, { type: "bandpass", from: 7000, to: 1600, q: 0.9 }, 0.002);
    if (recharge) playSynth({ type: "sine", freq: 1600, slideTo: 7200, dur: 1.1, gain: 0.025, delay: 0.25, attack: 0.08 });
  },
  shutter: (n = 6) => { for (let i = 0; i < n; i++) { const d = 0.2 + i * 0.37 + Math.random() * 0.15; playNoise(0.03, 0.12, d, { type: "highpass", from: 2500, to: 2500, q: 1 }, 0.002); playNoise(0.05, 0.06, d + 0.05, { type: "bandpass", from: 1200, to: 1200, q: 1 }, 0.002); } },
  iris: () => { playNoise(0.5, 0.06, 0, { type: "lowpass", from: 1400, to: 300, q: 0.7 }, 0.1); playNoise(0.5, 0.06, 0.6, { type: "lowpass", from: 300, to: 1400, q: 0.7 }, 0.1); },
  slate: () => {
    // The clapper arm comes down with a sharp CLACK just after the board lands.
    playNoise(0.2, 0.08, 0.05, { type: "bandpass", from: 300, to: 900, q: 0.8 }, 0.05);
    playNoise(0.06, 0.3, 0.48, { type: "highpass", from: 1500, to: 1500, q: 0.8 }, 0.001);
    playTone(220, "triangle", 0.08, 0.14, 0.48);
  },
  boo: () => {
    // A crowd booing: several low, slightly out-of-tune voices sliding down.
    [118, 131, 142, 156, 171].forEach((f, i) => {
      try {
        if (!isSoundOn()) return;
        const ctx = getACtx(); if (!ctx) return;
        const t0 = ctx.currentTime + i * 0.03;
        const o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = "sawtooth"; o.frequency.setValueAtTime(f, t0); o.frequency.linearRampToValueAtTime(f * 0.78, t0 + 1.1);
        lp.type = "lowpass"; lp.frequency.value = 700;
        g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.035, t0 + 0.2); g.gain.exponentialRampToValueAtTime(0.001, t0 + 1.2);
        o.connect(lp); lp.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + 1.25);
      } catch (e) {}
    });
    playNoise(1.1, 0.04, 0, { type: "bandpass", from: 500, to: 380, q: 0.6 }, 0.2);
  },
  // Rubber stamp: a short dry thwack
  stamp: (delay = 0) => {
    playNoise(0.09, 0.2, delay, { type: "lowpass", from: 900, to: 200, q: 0.8 }, 0.002);
    playTone(80, "square", 0.08, 0.1, delay);
  },
  splat: (delay = 0) => {
    playNoise(0.25, 0.22, delay, { type: "lowpass", from: 1800, to: 300, q: 0.7 }, 0.005);
    playTone(95, "sine", 0.18, 0.12, delay);
  },
  // Combo ladder: each correct guess in a row plays the next note of a pentatonic scale
  comboNote: (step=0) => {
    const scale=[0,2,4,7,9];
    const f=523.25*Math.pow(2,(scale[step%5]+12*Math.min(2,Math.floor(step/5)))/12);
    playTone(f,"sine",0.18,0.2);
    playTone(f*1.5,"sine",0.26,0.14,0.1);
  },
  // Letter-tile reveal: quiet ticks climbing a semitone at a time
  tileTick: (step=0, delay=0) => {
    playTone(660 * Math.pow(2, step / 12), "triangle", 0.06, 0.035, delay);
  },
  badge: () => {
    [[784,0],[988,0.09],[1319,0.18]].forEach(([f,d])=>playTone(f,"triangle",0.22,0.1,d));
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
// The game's public address, added to shared results (owner decision 2026-10-19).
const PLAY_URL = "https://plotmix-app.vercel.app";

// "Add to home screen": browsers that support it fire beforeinstallprompt; we keep it and
// offer the install only after a Daily win, never as a pop-up on arrival.
let deferredInstallPrompt = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstallPrompt = e; });
  window.addEventListener("appinstalled", () => { deferredInstallPrompt = null; });
}

// Daily numbers count from 1 October 2026 (Daily #1).
const DAILY_NUMBER_START = new Date(2026, 9, 1);
function getDailyNumber(date = new Date()) { return localDayNumber(date) - localDayNumber(DAILY_NUMBER_START) + 1; }

// Spoiler-free "journey" (owner request 2026-10-22, after Wordle's grid): the Daily shows
// every guess (🟩 found something, 🟥 missed) and hints (💡); longer runs show one mark per card.
function shareJourney(mode, results) {
  if (mode.isDaily) {
    return results.map((r) => {
      if (r.skipped) return "⏭️";
      const marks = (r.guessList || []).map((g) => (r.card && guessClassification(g, r.card) === "match") ? "🟩" : "🟥").join("");
      const hints = "💡".repeat(r.hints || 0);
      return [marks || "⏱️", hints].filter(Boolean).join(" ");
    });
  }
  return [results.map((r) => r.skipped ? "⏭️" : isRoundSolved(r) ? "🟩" : "🟥").join("")];
}

function buildShareText(mode, results, totalScore) {
  const correct=results.filter(r=>isRoundSolved(r)).length;
  const skipped=results.filter(r=>r.skipped).length;
  const failed=results.filter(r=>!r.skipped&&!isRoundSolved(r)&&!(r.found&&r.found[0]!==r.found[1])).length;
  const dateLine = mode.isDaily ? `📅 ${getTodayLabel()}\n` : "";
  const streakValue = getRunBestStreak(results);
  const summaryLine = `${correct}✅ ${failed}❌ ${skipped}⏭️ ${streakValue}🔥 ${totalScore.toLocaleString()}🎬`;
  const title = mode.isDaily ? `🎬 PLOTMIX ${mode.label} #${getDailyNumber()}` : `🎬 PLOTMIX ${mode.label}`;
  const lines = [
    title,
    `${dateLine}${shareJourney(mode, results).join("\n")}`,
    summaryLine,
    `Play: ${PLAY_URL}`,
  ];
  return lines.join("\n");
}


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
  // A slightly heavier black rim so orange text stands out on the purple checkerboard
  // (owner request 2026-10-26; a white rim was tried first and read worse).
  textShadow: "0 2px 0 #000000, 1px 1px 0 #000000, -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000",
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

// Win sheet: same glow and gradient, but the rays live on their own layer so they can spin.
const WIN_RESULT_BG = {
  backgroundColor: "#4A45EF",
  backgroundImage: [
    "radial-gradient(circle at 50% 104%, rgba(206, 190, 255, 0.58) 0%, rgba(206, 190, 255, 0.24) 14%, rgba(206, 190, 255, 0) 58%)",
    "linear-gradient(180deg, #6757F5 0%, #5146E7 52%, #473DD9 100%)",
  ].join(","),
};
const WIN_RAYS_LAYER = "repeating-conic-gradient(from -90deg, rgba(157, 142, 255, 0.44) 0deg 10deg, rgba(83, 68, 214, 0.1) 10deg 20deg)";

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
  // Real clip lengths (checked by a test against the files): popcorn 3.67 s, clapboard 2.03 s.
  // They were listed as 2.1 s and 1.2 s, so the sticker was hidden before the clip finished.
  winAnimations: [
    { src: "/stickers/popcorn.mp4", durationMs: 3700 },
    { src: "/stickers/clapboard.mp4", durationMs: 2050 },
  ],
  hintAnimation: { src: "/stickers/hint.mp4", width: 320, aboveGap: 8, liftY: -120 },
  trex: {
    sad: "/stickers/Sad.webp",
    happy: "/stickers/Happy.webp",
    veryHappy: "/stickers/Very-happy.webp",
  },
};

// Renders a video through canvas and keys out green-screen pixels so exported
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
    let lastFrameTime = -1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const draw = () => {
      if (disposed) return;
      // Key out a frame only when the video shows a new one: the clips are 30 fps,
      // while the screen refreshes 60+ times a second.
      if (video.readyState >= 2 && !video.paused && !video.ended && video.currentTime !== lastFrameTime) {
        lastFrameTime = video.currentTime;
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


// Card counter: the clapperboard from the opening title video, with its "?" painted out so
// the scene number can sit on the slate (owner request 2026-11-04).
function SceneClapper({scene, total}) {
  return (
    <div role="img" aria-label={`Scene ${scene} of ${total}`}
      style={{position:"relative",width:96,height:103,flexShrink:0}}>
      <img src="/stickers/scene-clapper.webp" alt="" aria-hidden="true" draggable="false"
        style={{display:"block",width:"100%",height:"100%",userSelect:"none",pointerEvents:"none",filter:"drop-shadow(0 3px 0 #1C1D21)"}}/>
      <div aria-hidden="true" style={{position:"absolute",left:"6%",right:"6%",top:"45%",bottom:"7%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        ...YELLOW_STICKER_TEXT,lineHeight:1,textAlign:"center"}}>
        <span style={{fontSize:12,letterSpacing:"0.06em"}}>SCENE</span>
        <span style={{fontSize:23,marginTop:2}}>{scene}/{total}</span>
      </div>
    </div>
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
        autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false}
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

// Speaker button that turns the game's sound effects on and off.
function SoundToggle({style={}}) {
  const [on,setOn]=useState(()=>isSoundOn());
  const toggle=()=>{ const next=!on; setSoundOn(next); setOn(next); };
  return (
    <button onClick={toggle} aria-label="Sound" aria-pressed={on} title={on?"Sound on":"Sound off"}
      style={{width:40,height:40,borderRadius:"50%",background:T.bgDeep,border:`2px solid ${T.border}`,cursor:"pointer",boxShadow:T.shadowSm,display:"flex",alignItems:"center",justifyContent:"center",padding:0,...style}}>
      <span aria-hidden="true" style={{fontSize:18,lineHeight:1,filter:"drop-shadow(0 1px 0 #1C1D21)"}}>{on?"🔊":"🔇"}</span>
    </button>
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
  // Tap anywhere (or press a key) to skip the intro (owner request 2026-11-05).
  useEffect(() => {
    const onKey = (e) => { if (["Enter", " ", "Escape"].includes(e.key)) finish(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div role="button" tabIndex={0} aria-label="Skip intro" onClick={finish}
      style={{minHeight:"100dvh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer"}}>
      <div aria-hidden="true" style={{position:"absolute",left:"50%",bottom:"max(22px, env(safe-area-inset-bottom))",transform:"translateX(-50%)",zIndex:1,pointerEvents:"none",
        fontFamily:FONT_FIGMA_STICKER,fontSize:11,letterSpacing:"0.08em",color:"rgba(255,255,255,0.75)",textTransform:"uppercase",whiteSpace:"nowrap",
        animation:"introSkipHint 0.6s ease 1.2s both"}}>Tap to skip</div>
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
<image href="/stickers/title-banner.webp" x="20" y="36" width="362" height="127" preserveAspectRatio="xMidYMid meet"><title>PlotMix: What's the title?</title></image>
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

function ModeSelect({onSelect, onArcade}) {
  const [sessions,setSessions]=useState(()=>loadAllSessionsList());
  const passes=arcadePasses();
  const dailyDone=hasDoneDaily();
  // Owner 2026-11-06: no big Resume button. A small RESUME tab hangs off the card of the
  // game you left (Daily or Standard). Speed Run is one sitting, so it never offers one.
  const resumable = Object.fromEntries(sessions.filter(s=>s.modeId!=="speedrun").map(s=>[s.modeId,s]));
  const byId = Object.fromEntries(GAME_MODES.map(m=>[m.id,m]));

  return (
    <div style={{minHeight:"100dvh",...CHECKER_BG,display:"flex",justifyContent:"center",alignItems:"flex-start"}}>
      <div style={{position:"relative",width:"min(402px, calc(100dvh * 402 / 874))",height:"min(874px, 100dvh)",containerType:"inline-size"}}>
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

        {MODE_CARD_HITS.map((hit,i)=>{
          const saved = resumable[MODE_CARD_ORDER[i]];
          if(!saved) return null;
          const u = n => `${n/402*100}cqw`;
          return (
            <button key={`resume-${saved.modeId}`} onClick={()=>onSelect(null,saved.modeId)} aria-label="Resume Game"
              title={`Resume at film ${saved.cardIdx+1} of ${saved.deckLen}`}
              style={{position:"absolute",zIndex:4,
                right:`${(402-hit.left-hit.w+14)/402*100}%`, top:`calc(${(hit.top+hit.h)/874*100}% - ${u(13)})`,
                height:u(26),padding:`0 ${u(10)} 0 ${u(8)}`,display:"flex",alignItems:"center",gap:u(5),
                background:T.blue,border:"2px solid #1C1D21",borderRadius:u(13),boxShadow:"0 3px 0 #1C1D21",cursor:"pointer",
                transform:"rotate(-3deg)"}}>
              <span aria-hidden="true" style={{fontSize:u(12),lineHeight:1}}>🔥</span>
              <span style={{...WHITE_STICKER_TEXT,fontFamily:FONT_FIGMA_STICKER,fontSize:u(11),lineHeight:1,letterSpacing:"0.02em"}}>RESUME</span>
              <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:u(10.5),lineHeight:1,color:"#1C1D21",
                background:"#FFF8E6",border:"1.5px solid #1C1D21",borderRadius:u(8),padding:`${u(1.5)} ${u(5)}`}}>{saved.cardIdx+1}/{saved.deckLen}</span>
            </button>
          );
        })}

        {/* Popcorn Panic sits under Speed Run (owner request 2026-10-25): plays are won by
            solving 5 mashups in a row in Standard or Speed Run. */}
        {/* Owner 2026-11-05: the T-rex and an overflowing POPCORN PANIC bucket sit side by side
            (T-rex left, bucket right) in the gap between Speed Run and the corner buttons, both as big as
            that gap allows, so neither covers a button on shorter phones. */}
        <div style={{position:"absolute",left:16,right:16,top:`${566/874*100}%`,bottom:"calc(2% + 58px)",
          display:"flex",alignItems:"center",justifyContent:"space-evenly",gap:8,zIndex:3,pointerEvents:"none",containerType:"size"}}>
          <img
            src="/stickers/Happy.webp"
            alt=""
            aria-hidden="true"
            draggable="false"
            style={{
              display:"block",
              width:"auto",
              height:"min(100%, 188px)",
              maxWidth:"52%",
              objectFit:"contain",
              filter:"drop-shadow(0 12px 16px rgba(0,0,0,0.42))",
              animation:"homeTrexFloat 3s ease-in-out infinite",
              transformOrigin:"50% 75%",
            }}
          />
          <button onClick={onArcade} aria-label="Popcorn Panic"
            style={{position:"relative",flex:"none",height:"min(100%, 150px)",aspectRatio:"306 / 283",padding:0,border:"none",cursor:"pointer",pointerEvents:"auto",
              background:"url(/stickers/popcorn-8.webp) center / contain no-repeat",filter:"drop-shadow(0 4px 0 rgba(28,29,33,0.55))"}}>
            <span style={{position:"absolute",left:"50%",top:"56%",transform:"translate(-50%,-50%) rotate(-5deg)",display:"flex",flexDirection:"column",alignItems:"center",
              background:"#FFD84D",border:"2px solid #1C1D21",borderRadius:6,padding:"3px 6px 2px",boxShadow:"0 2px 0 #1C1D21",whiteSpace:"nowrap"}}>
              <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:"min(11.5cqh, 17px)",lineHeight:1.05,color:"#1C1D21"}}>POPCORN</span>
              <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:"min(13.5cqh, 20px)",lineHeight:1.05,color:"#E8344E"}}>PANIC!</span>
            </span>
            <span style={{position:"absolute",right:-8,top:"6%",transform:"rotate(10deg)",fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:800,color:"#1C1D21",
              background:"#FFF8E6",border:"2px solid #1C1D21",borderRadius:10,padding:"1px 7px",whiteSpace:"nowrap"}}>{passes>0?`${passes} play${passes===1?"":"s"}`:"🔒"}</span>
          </button>
        </div>

      </div>
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
    { headline:"Time's Up!", sub:"The clock ran out. No release for this one.", emoji:"⏱️" },
    { headline:"Missed The Screening.", sub:"Doors closed, lights down, and you were still in the lobby.", emoji:"🚪" },
    { headline:"Overran The Slot.", sub:"The projectionist waited as long as he could. Show's over.", emoji:"📽️" },
    { headline:"Out Of Time, Out Of Luck.", sub:"That round expired before you cracked it.", emoji:"⌛" },
  ],
  // The card's points hit 0 before it was solved: the studio cancels it.
  // The run's budget hit $0: the studio cancels the whole picture. GAME OVER.
  outOfPoints: [
    { headline:"The Studio Has Pulled The Plug.", sub:"Love the energy. Hate the spending. The budget is gone and so is your picture.", emoji:"📋" },
    { headline:"Cancelled. Effective Immediately.", sub:"The execs saw the burn rate, choked on their oat lattes and shut the whole thing down.", emoji:"☕" },
    { headline:"Greenlight Revoked.", sub:"Budget: $0. The studio is \"going in a different direction\". The direction is away from you.", emoji:"🚦" },
    { headline:"Shelved Indefinitely.", sub:"Every last dollar spent. The film is now a tax write-off and a cautionary tale for interns.", emoji:"🗃️" },
    { headline:"Notes From The Top: No.", sub:"You ran out of money before you ran out of guesses. Please return your lanyard at the gate.", emoji:"🪪" },
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
    { headline:"Restored In 4K.", sub:"First guess, no lifelines. This one goes in the deluxe box set.", emoji:"🏆" },
  ],
  perfect2: [
    { headline:"That's a Wrap.", sub:"Two guesses, no hints. The craft services table is applauding.", emoji:"🎬" },
    { headline:"Sharp Eye.", sub:"Two guesses, nothing revealed. That is not luck. That is knowledge.", emoji:"👁️" },
    { headline:"Solid Lead.", sub:"Two guesses clean. The director would cast you in anything.", emoji:"🎥" },
    { headline:"Second Guess, First Class.", sub:"Took one warm-up shot and nailed it. Zero hints. Respect.", emoji:"🎞️" },
  ],
  perfectFew: [
    { headline:"The Critics Are Raving.", sub:"Got there without a single hint. Five stars, and they are out of stars.", emoji:"👍" },
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
    { headline:"The Hints Helped.", sub:"Two lifelines opened. Not a crime. The budget took a hit but the film is in the can.", emoji:"🤝" },
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
    { headline:"Development Hell.", sub:"This script has been in turnaround since 2003. The studio passed. The streamers passed. Your dog passed.", emoji:"💀" },
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
    { headline:"Straight to VHS.", sub:"Be kind, rewind, and pay your late fees. This is going in the bargain bin with the cautionary tales.", emoji:"📼" },
    { headline:"The Studio Recut.", sub:"Too long, too confusing, nobody wanted it. Three hints and still no answer.", emoji:"📼" },
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
    { headline:"Opted Out.", sub:"Skipped. Free of charge, no spoilers, no judgment. Well — minimal judgment.", emoji:"🚶" },
    { headline:"Pass.", sub:"Sometimes you just do not know. Moving on.", emoji:"⏭️" },
    { headline:"Strategic Skip.", sub:"You chose not to guess. This is either wisdom or cowardice and only you know which.", emoji:"🤔" },
    { headline:"Next Card.", sub:"This one was not for you. The next one might be.", emoji:"➡️" },
  ],
};

function getResultMessage(both, hintsUsed, guessCount, maxGuesses, skipped=false, reward=null, timedOut=false, outOfPoints=false) {
  if (skipped) return pickRandom("skipped", MSG_BANKS.skipped);
  if (timedOut) return pickRandom("timesUp", MSG_BANKS.timesUp);
  if (outOfPoints) return pickRandom("outOfPoints", MSG_BANKS.outOfPoints);
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
// The two films on the win popup are old-fashioned roll tickets: kraft paper, a red printed
// frame, a serial number on the stub and serrated tear edges (owner request 2026-11-05).
const TICKET_EDGES = "conic-gradient(from 45deg at left, #0000, #000 1deg 89deg, #0000 90deg) left / 51% 7px repeat-y, conic-gradient(from -135deg at right, #0000, #000 1deg 89deg, #0000 90deg) right / 51% 7px repeat-y";
// Old roll-ticket corners: a quarter-circle bite out of each corner (owner reference 2026-11-05).
const TICKET_CORNER_R = 10;
const TICKET_CORNERS = [["0 0","left top"],["100% 0","right top"],["0 100%","left bottom"],["100% 100%","right bottom"]].map(([at, place]) => `radial-gradient(circle ${TICKET_CORNER_R}px at ${at}, #0000 98%, #000) ${place} / 51% 51% no-repeat`).join(", ");
const TICKET_PAPER = (tone) => `radial-gradient(rgba(92,70,38,0.16) 0.8px, transparent 1.3px) 0 0 / 6px 6px, radial-gradient(rgba(255,250,235,0.28) 0.8px, transparent 1.3px) 3px 2px / 9px 9px, linear-gradient(180deg, ${tone[0]}, ${tone[1]})`;
function FilmTicket({chip, serial, tone = ["#DFCDA9", "#CDB68D"], tilt = 0, style, frame = 1.5}) {
  return (
    <div style={{width:chip.w ? `min(${chip.w}px, calc(100vw - 20px))` : `min(${chip.width + 34}px, calc(100% - 20px))`,height:chip.h ?? chip.height + 4,filter:"drop-shadow(0 3px 0 rgba(28,29,33,0.85))",...style}}>
      <div style={{width:"100%",height:"100%",transform:`rotate(${tilt}deg)`,WebkitMask:TICKET_CORNERS,mask:TICKET_CORNERS}}>
      <div style={{position:"relative",width:"100%",height:"100%",boxSizing:"border-box",background:TICKET_PAPER(tone),
        WebkitMask:TICKET_EDGES,mask:TICKET_EDGES,display:"flex",alignItems:"center",padding:"0 8px"}}>
        <div style={{position:"absolute",inset:"6px 11px",border:`${frame}px solid #B0463E`,borderRadius:3,pointerEvents:"none"}}/>
        <div style={{flex:1,minWidth:0,padding:"0 8px 0 12px",textAlign:"center",fontFamily:FONT_FIGMA_STICKER,fontSize:chip.fontSize,lineHeight:1.08,color:"#2A2420",textTransform:"uppercase",letterSpacing:"0.02em"}}>{chip.lines.join(" ")}</div>
        <div aria-hidden="true" style={{alignSelf:"stretch",width:26,flex:"none",margin:"5px 0",borderLeft:"1.5px solid #B0463E",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:7.5,color:"#2A2420",writingMode:"vertical-rl",whiteSpace:"nowrap",letterSpacing:"0.06em"}}>{serial}</span>
        </div>
      </div>
      </div>
    </div>
  );
}

// Walk of Fame star, stamped next to the box office on a flawless solve (first guess, no hints).
// Drawn like the real pavement star: a coral terrazzo star edged in brass on a charcoal
// terrazzo square, a brass name across the top and a round brass film-camera emblem below.
const FAME_SPECKS = [[12,14,"#8C7F86"],[24,82,"#B98E97"],[82,18,"#8C7F86"],[88,74,"#B98E97"],[10,56,"#6E6468"],[60,90,"#8C7F86"],[92,46,"#6E6468"],[40,8,"#B98E97"],[70,60,"#6E6468"],[30,40,"#6E6468"]];
function FameStar({size = 62, name = "YOU"}) {
  const pts = Array.from({length:10}, (_,i) => { const r = i % 2 ? 17.5 : 44, a = -Math.PI/2 + i*Math.PI/5; return `${50 + r*Math.cos(a)},${53 + r*Math.sin(a)}`; }).join(" ");
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{display:"block",overflow:"visible",filter:"drop-shadow(0 3px 0 #1C1D21)"}}>
      <rect x="1.5" y="1.5" width="97" height="97" rx="5" fill="#3B3337" stroke="#1C1D21" strokeWidth="3"/>
      {FAME_SPECKS.map(([x,y,c],i)=><circle key={i} cx={x} cy={y} r={i%3?1.4:2} fill={c}/>)}
      <polygon points={pts} fill="#E7A1AC" stroke="#C99A3E" strokeWidth="3.2" strokeLinejoin="miter"/>
      <polygon points={pts} fill="none" stroke="#F4D27A" strokeWidth="0.9" strokeLinejoin="miter" transform="translate(50 53) scale(0.9) translate(-50 -53)"/>
      <circle cx="44" cy="44" r="1.2" fill="#F6C9D0"/><circle cx="58" cy="60" r="1.1" fill="#C77F8B"/><circle cx="38" cy="64" r="1" fill="#F6C9D0"/>
      <text x="50" y="50" textAnchor="middle" fontFamily="'Rubik Mono One',sans-serif" fontSize="10.5" fill="#E2B85A" stroke="#7A5A1C" strokeWidth="0.5" letterSpacing="0.5">{name}</text>
      <circle cx="50" cy="64" r="8.5" fill="#E2B85A" stroke="#7A5A1C" strokeWidth="1"/>
      <g fill="#5A4214"><rect x="44.5" y="62" width="8.5" height="6" rx="1"/><polygon points="53,63.6 56.2,61.8 56.2,68.2 53,66.4"/><circle cx="46.7" cy="60" r="1.9"/><circle cx="51" cy="60" r="1.9"/></g>
    </svg>
  );
}
// Paparazzi flashes around the win popup as the title lands (owner request 2026-11-05):
// three quick pops, a half-second hold, then two more. Each pop drains the card to black and white for a blink.
const WIN_FLASH_TIMES = [550, 700, 850, 1350, 1500];
const WIN_FLASH_SPOTS = [[7, 6], [93, 30], [6, 62], [92, 8], [50, 1]];
const WIN_FLASH_MONO_MS = 70;

// The money bag with an amount printed on it (owner's art, 2026-11-05) and a caption under it.
// How far right of the sheet padding the skip / time-up / game-over bag sits (owner 2026-11-05: "a bit to the right").
const SKIP_BAG_NUDGE_X = 30;
function MoneyBag({text, ariaLabel, label, width = 76}) {
  return (
    <div style={{position:"relative",width,display:"inline-flex",flexDirection:"column",alignItems:"center",gap:3,flex:"none"}}>
      <div style={{position:"relative",width}}>
        <img src="/stickers/money-bag.webp" alt="" aria-hidden="true" width={width} height={Math.round(width*1.23)} style={{display:"block",width,height:"auto"}}/>
        <div style={{position:"absolute",left:"49%",top:"57%",transform:"translate(-50%,-50%) scaleX(0.82)",lineHeight:1}}>
          <span aria-label={ariaLabel} style={{display:"inline-block",fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:Math.round(width*0.21),lineHeight:1,letterSpacing:"-0.03em",color:"#2A0E33",whiteSpace:"nowrap"}}>{text}</span>
        </div>
      </div>
      {label && <div style={{...POPUP_YELLOW_TEXT,fontSize:9.5,lineHeight:1,textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}</div>}
    </div>
  );
}

// Dressing-room lamps around the answer card on the win popup. Points run counter-clockwise
// from the top middle, so staggering their animation by index makes the light chase counter-clockwise.
function marqueeBulbs(w, h, gap = 22) {
  const per = 2 * (w + h), n = Math.round(per / gap), pts = [];
  const segs = [[w/2,0,0,0],[0,0,0,h],[0,h,w,h],[w,h,w,0],[w,0,w/2,0]];
  for (let i = 0; i < n; i++) {
    let d = i * per / n;
    for (const [x1,y1,x2,y2] of segs) {
      const len = Math.hypot(x2-x1, y2-y1);
      if (d <= len) { pts.push({x: x1 + (x2-x1)*d/len, y: y1 + (y2-y1)*d/len}); break; }
      d -= len;
    }
  }
  return pts;
}
const MARQUEE_BULBS = marqueeBulbs(352, 78, 24);

function RoundResultPopup({card, found, guessCount, hintCount, maxGuesses, roundScore, bonus=null, onBonus, cardIdx, totalCards, results=[], isLast, onNext, onMenu, skipped=false, timedOut=false, outOfPoints=false, budgetLeft=0, isDaily=false, showSticker=false, stickerSrc=null, stickerDurationMs=2200, onStickerEnded, reducedMotion=false, transitionFamily=TRANSITION_FAMILIES.punchy}) {
  const both = found[0] && found[1];
  const won = both;
  const msgRef = useRef(null);
  if (!msgRef.current) {
    msgRef.current = getResultMessage(both, hintCount, guessCount, maxGuesses, skipped, budgetLeft, timedOut, outOfPoints && !both && !skipped && !timedOut);
  }
  const cancelled = outOfPoints && !both && !skipped && !timedOut;
  // The CANCELLED stamp thwacks down just after the title lands.
  useEffect(() => {
    if (!cancelled) return;
    const id = setTimeout(() => SFX.stamp(), reducedMotion ? 0 : 900);
    return () => clearTimeout(id);
  }, [cancelled, reducedMotion]);
  // A Walk of Fame star is only for a flawless solve: first guess, no hints.
  const flawless = won && hintCount === 0 && guessCount === 1;
  // Paparazzi shutters as the title lands, then the Walk of Fame star thwacks down.
  const [mono,setMono]=useState(false);
  useEffect(() => {
    if (!won || reducedMotion) return;
    const ids = [];
    WIN_FLASH_TIMES.forEach(t => {
      ids.push(setTimeout(() => { SFX.snap(t === WIN_FLASH_TIMES[WIN_FLASH_TIMES.length-1]); setMono(true); }, t));
      ids.push(setTimeout(() => setMono(false), t + WIN_FLASH_MONO_MS));
    });
    if (flawless) ids.push(setTimeout(() => SFX.stamp(), 1900));
    return () => ids.forEach(clearTimeout);
  }, [won, reducedMotion, flawless]);
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
  // Daily Challenge is one card, so a lone progress dot (green check) says nothing: hide it
  // and centre the money bag / T-rex instead (owner request 2026-11-08).
  const showDots=!isDaily && dotCount>1;
  const bagX=showDots ? 105 : 201;
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

  // Title smash: the two films slide in from opposite sides and the mashed title slams down.
  const smashIn = (delayMs, dx, base = "translateX(-50%)") => (
    reducedMotion
      ? undefined
      : {
          opacity: entered ? 1 : 0,
          transform: entered ? (base || "none") : `${base} translateX(${dx}px)`,
          transition: `opacity 240ms ease ${delayMs}ms, transform 460ms cubic-bezier(.2,1.35,.4,1) ${delayMs}ms`,
        }
  );
  const titleSlam = reducedMotion
    ? undefined
    : {
        opacity: entered ? 1 : 0,
        transform: entered ? "scale(1)" : "scale(1.4)",
        transition: "opacity 180ms ease 520ms, transform 360ms cubic-bezier(.3,1.7,.5,1) 520ms",
      };

  // After the first count-up, a later rise (the bonus question) pops the money bag instead.
  const scoreShownRef = useRef(null);
  const [bagPop, setBagPop] = useState(0);
  const [trexLeaving, setTrexLeaving] = useState(false);
  useEffect(() => {
    const prev = scoreShownRef.current;
    scoreShownRef.current = roundScore;
    if (reducedMotion) {
      setScoreDisplay(roundScore);
      return;
    }
    if (prev === 0 && roundScore > 0) {
      setTrexLeaving(true);
      setScoreDisplay(roundScore);
      setBagPop(k => k + 1);
      const id = setTimeout(() => setTrexLeaving(false), 420);
      return () => clearTimeout(id);
    }
    if (prev !== null && roundScore > prev) {
      setBagPop(k => k + 1);
      const id = setTimeout(() => setScoreDisplay(roundScore), 200);
      return () => clearTimeout(id);
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


  if (won) {
    // Owner layout 2026-11-05 (402px screen). x,y are piece centres; y is measured from the top of
    // the popup's main area (0..445), so negative y sits above the sheet. Tickets size to the title.
    const MAIN_H = 445;
    const my = (px) => `${(px / MAIN_H) * 100}%`;
    const ticketFor = (movieTitle) => {
      const len = String(movieTitle || "").trim().length;
      const oneLine = Math.round(240 + (len - 13) * 25.3);
      if (oneLine <= 360) return { w: Math.max(200, oneLine), h: 59, lines: [String(movieTitle)], fontSize: 15 };
      const lines = buildChipLines(movieTitle, 20, 3);
      return { w: 350, h: 59 + (lines.length - 1) * 17, lines, fontSize: lines.length >= 3 ? 13 : 14 };
    };
    const topTicket = ticketFor(card.movies[0]);
    const bottomTicket = ticketFor(card.movies[1]);
    // A tilted ticket reaches higher/lower at its corners; push long ones down so they keep
    // the same clearance from the title card (and each other) as the owner's layout.
    const TILT1 = -4, TILT2 = 5;
    const halfSpan = (t, deg) => { const r = Math.abs(deg) * Math.PI / 180; return t.h / 2 * Math.cos(r) + t.w / 2 * Math.sin(r); };
    const ticket1Y = Math.max(147.5, 110 + halfSpan(topTicket, TILT1));
    const ticket2Y = Math.max(242, ticket1Y + halfSpan(topTicket, TILT1) + 13.5 + halfSpan(bottomTicket, TILT2));
    return (
      <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",justifyContent:"center",alignItems:"flex-end",overflowY:"auto",overflowX:"hidden",background:"rgba(0,0,0,0.35)",backdropFilter:reducedMotion?"none":"blur(5px)",animation:reducedMotion?"none":transitionFamily.popupBackdropIn}}
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

        <div style={{position:"relative",width:"min(402px, 100vw)",margin:"0 auto",borderRadius:"12px 12px 0 0",overflow:"visible",boxShadow:T.shadowLg,...resultSheetBg,backgroundColor:T.bgDeep,animation:reducedMotion?"none":transitionFamily.popupSheetIn,transformOrigin:"50% 100%",filter:mono?"grayscale(1) brightness(2.4) contrast(0.85)":"none"}}>
          <div aria-hidden="true" style={{position:"absolute",inset:0,overflow:"hidden",borderRadius:"12px 12px 0 0",pointerEvents:"none"}}>
            <div style={{position:"absolute",left:"50%",top:"104%",width:1800,height:1800,margin:"-900px 0 0 -900px",background:WIN_RAYS_LAYER,animation:reducedMotion?"none":"raysSpin 40s linear infinite"}}/>
          </div>
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
          <div style={{aspectRatio:`402 / ${MAIN_H}`,textAlign:"center",position:"relative"}}>
            <div style={{...POPUP_YELLOW_TEXT,color:"#F6A507",fontSize:"clamp(13px, 4vw, 16px)",textTransform:"uppercase",lineHeight:1.06,letterSpacing:"0",position:"absolute",left:rx(197.5),top:my(-102.5),width:rx(350),transform:"translate(-50%,-50%)",...stagedRise(20, 8, "translate(-50%,-50%)")}}>{msg.headline}</div>
            <div style={{...POPUP_PLAIN_WHITE_TEXT,fontSize:"clamp(10.5px, 3.2vw, 12.8px)",lineHeight:1.23,textTransform:"none",letterSpacing:"0.01em",position:"absolute",left:rx(199.5),top:my(-52),width:rx(342),transform:"translate(-50%,-50%)",...stagedRise(70, 8, "translate(-50%,-50%)")}}>{msg.sub}</div>

            <div style={{position:"absolute",left:rx(201.5),top:my(56),width:rx(352),height:78,transform:"translate(-50%,-50%)"}}>
            <div style={{position:"absolute",inset:0,background:"#342698",border:"2px solid #F6A507",borderRadius:11,boxShadow:"0 4px 0 #1C1D21",padding:"10px 12px",boxSizing:"border-box",display:"flex",alignItems:"center",justifyContent:"center",...titleSlam}}>
              {MARQUEE_BULBS.map((b,i)=>(
                <span key={i} aria-hidden="true" style={{position:"absolute",left:`${b.x/352*100}%`,top:`${b.y/78*100}%`,width:13,height:13,margin:"-6.5px 0 0 -6.5px",borderRadius:"50%",border:"1px solid #1C1D21",boxSizing:"border-box",
                  ...(reducedMotion ? {background:"#FFF8D6",boxShadow:"0 0 10px 4px rgba(255,226,110,0.85)"} : {background:"#B88A2A",animation:`bulbChase 2.4s linear ${(i/MARQUEE_BULBS.length-1)*2.4}s infinite`})}}/>
              ))}
              <div style={popupTitleStyle}>{title}</div>
            </div>
            </div>

            <div style={{position:"absolute",left:rx(201),top:my(ticket1Y),width:`min(${topTicket.w}px, calc(100% - 20px))`,height:topTicket.h,transform:"translate(-50%,-50%)"}}>
              <FilmTicket chip={topTicket} frame={2} serial={String(312200 + (card.id||0) * 2).slice(-6)} tone={["#D6C29C", "#CDB68D"]} tilt={TILT1} style={{width:"100%",height:"100%",...smashIn(120, -280, "")}}/>
            </div>
            <div style={{position:"absolute",left:rx(200),top:my(ticket2Y),width:`min(${bottomTicket.w}px, calc(100% - 20px))`,height:bottomTicket.h,transform:"translate(-50%,-50%)"}}>
              <FilmTicket chip={bottomTicket} frame={2} serial={String(312201 + (card.id||0) * 2).slice(-6)} tone={["#DAC7A2", "#D2BC94"]} tilt={TILT2} style={{width:"100%",height:"100%",...smashIn(240, 280, "")}}/>
            </div>

            {roundScore > 0 && !trexLeaving && <div style={{position:"absolute",left:rx(bagX),top:my(356.5),width:76,transform:"translate(-50%,-50%)",...stagedRise(320, 8, "translate(-50%,-50%)")}}>
              {bagPop > 0 && !reducedMotion && <div key={`flare${bagPop}`} aria-hidden="true" style={{position:"absolute",left:"50%",top:"55%",width:170,height:170,margin:"-85px 0 0 -85px",borderRadius:"50%",pointerEvents:"none",zIndex:-1,
                background:"repeating-conic-gradient(from 0deg, rgba(255,216,77,0.95) 0deg 9deg, rgba(255,216,77,0) 9deg 24deg)",
                WebkitMask:"radial-gradient(circle, #000 18%, rgba(0,0,0,0.7) 40%, transparent 70%)",mask:"radial-gradient(circle, #000 18%, rgba(0,0,0,0.7) 40%, transparent 70%)",
                animation:"bagFlare 1.1s ease-out both"}}/>}
              <div key={`bag${bagPop}`} style={{position:"relative",animation:bagPop > 0 && !reducedMotion ? "bagPop 0.55s cubic-bezier(.3,1.4,.5,1) both" : "none"}}>
              <img src="/stickers/money-bag.webp" alt="" aria-hidden="true" width="76" height="93" style={{display:"block",width:76,height:"auto"}}/>
              <div style={{position:"absolute",left:"49%",top:"57%",transform:"translate(-50%,-50%) scaleX(0.82)",lineHeight:1}}><span aria-label="Box office" style={{display:"inline-block",fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:16,lineHeight:1,letterSpacing:"-0.03em",color:"#2A0E33",whiteSpace:"nowrap",animation:reducedMotion?"none":"scorePulse 0.28s ease"}}>+{money(scoreDisplay)}</span></div>
              </div>
              <div style={{...POPUP_YELLOW_TEXT,position:"absolute",left:"50%",top:"100%",marginTop:2,transform:"translateX(-50%)",fontSize:9.5,lineHeight:1,textTransform:"uppercase",whiteSpace:"nowrap"}}>Bonus budget</div>
            </div>}
            {(roundScore === 0 || trexLeaving) && <img src="/stickers/Very-happy.webp" alt="" aria-hidden="true" width="136" height="136" style={{position:"absolute",left:rx(bagX),top:my(358),width:136,height:136,transform:"translate(-50%,-50%)",filter:"drop-shadow(0 3px 0 rgba(28,29,33,0.6))",
              ...(trexLeaving && !reducedMotion ? {animation:"trexPop 0.42s cubic-bezier(.4,0,.8,.4) both"} : stagedRise(320, 8, "translate(-50%,-50%)"))}}/>}
            {!reducedMotion && WIN_FLASH_SPOTS.map(([x,y],i)=>(
              <div key={`f${i}`} aria-hidden="true" style={{position:"absolute",left:`${x}%`,top:`${y}%`,width:96,height:96,opacity:0,pointerEvents:"none",zIndex:4,
                background:"radial-gradient(circle, #FFFFFF 0%, rgba(255,255,255,0.85) 12%, rgba(255,250,220,0.35) 32%, rgba(255,255,255,0) 62%), linear-gradient(90deg, rgba(255,255,255,0) 44%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 56%) center/100% 4px no-repeat, linear-gradient(0deg, rgba(255,255,255,0) 44%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 56%) center/4px 100% no-repeat",
                animation:`flashPop 0.55s ease-out ${WIN_FLASH_TIMES[i]/1000 - 0.04}s 1 both`}}/>
            ))}

            {showDots && <div aria-label="Card results" style={{position:"absolute",left:rx(290),top:my(356.5),transform:"translate(-50%,-50%)",display:"grid",gridTemplateColumns:"repeat(5, 26px)",gridTemplateRows:"repeat(2, 26px)",gap:"14px 9px",justifyContent:"center",...stagedRise(360, 8, "translate(-50%,-50%)")}}>
              {Array.from({length:dotCount}).map((_,i)=>{
                const bg = dotFor(i);
                const glyph = glyphFor(i);
                return (
                  <div key={i} style={{width:26,height:26,borderRadius:"50%",background:bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 0 #1C1D21",opacity:i<dotRevealCount?1:0.2,transform:i<dotRevealCount?"scale(1)":"scale(0.8)",transition:"opacity 0.22s ease, transform 0.22s ease",...(i===cardIdx && i<dotRevealCount && !reducedMotion ? {animation:"dotBeat 2.4s ease-in-out 0.3s infinite"} : {})}}>
                    {i<dotRevealCount && (glyph==="x" ? <IconXMark size={10} color="#F08D87"/> : glyph==="check" ? <IconCheck size={10} color="#6AE89D"/> : null)}
                  </div>
                );
              })}
            </div>}
          </div>

          {bonus && (<>
            <div role="group" aria-label="Which came first?" style={{height:106,background:"rgba(14,10,44,0.6)",textAlign:"center",position:"relative",zIndex:3,
              ...(reducedMotion ? {} : {animation:`bonusFadeIn 0.45s ease ${(WIN_FLASH_TIMES[WIN_FLASH_TIMES.length-1] + 1000)/1000}s both`})}}>
              <div style={{...POPUP_YELLOW_TEXT,color:"#F6A507",fontSize:12,textTransform:"uppercase",position:"absolute",left:"50%",top:11,width:rx(370),transform:"translate(-50%,-50%)",lineHeight:1}}>Bonus: which came out first?</div>
              {bonus.films.map((f,i)=>{
                const a=bonus.answer, picked=a?.pick===i, older=bonus.years[i]<bonus.years[1-i];
                return (
                  <button key={i} onClick={(e)=>{ e.stopPropagation(); onBonus?.(i); }} disabled={!!a} aria-label={`${f} came first`}
                    style={{...BTN.cyan,position:"absolute",left:rx(i ? 297 : 108.5),top:50,width:rx(181),minHeight:40,height:"auto",transform:"translate(-50%,-50%)",background:"#F28628",border:"2px solid #1C1D21",borderRadius:9,boxShadow:"0 4px 0 #1C1D21",padding:"4px 6px",boxSizing:"border-box",display:"flex",alignItems:"center",justifyContent:"center",cursor:a?"default":"pointer",
                      ...(a ? {background: older ? "#16A34A" : picked ? "#DC2626" : "#4B4F78"} : {})}}>
                    <span style={{...WHITE_STICKER_TEXT,fontSize:f.length > 30 ? 8 : f.length > 18 ? 9 : 10.5,textTransform:"uppercase",lineHeight:1.12}}>{f}{a ? ` · ${bonus.years[i]}` : ""}</span>
                  </button>
                );
              })}
              {bonus.answer && (
                <div role="status" aria-label="Bonus result" style={{...POPUP_YELLOW_TEXT,color:"#F6A507",fontSize:11.5,textTransform:"uppercase",position:"absolute",left:rx(204),top:92,width:rx(370),transform:"translate(-50%,-50%)",lineHeight:1}}>
                  {bonus.answer.correct ? (isDaily ? "✓ Film buff! Certified cinephile" : bonus.capped ? `✓ Film buff! Budget's already maxed at ${money(STARTING_BUDGET)}` : `✓ Film buff! +${money(1)} to the budget`) : "✗ Nope, the other one. No bonus."}
                </div>
              )}
            </div>
            <div aria-hidden="true" style={{height:45}}/>
          </>)}

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
              <div style={{marginLeft:SKIP_BAG_NUDGE_X}}><MoneyBag text={money(budgetLeft)} ariaLabel="Budget left" label="Budget left"/></div>

              <div style={{display:showDots?"grid":"none",gridTemplateColumns:"repeat(5, 26px)",gridTemplateRows:"repeat(2, 26px)",gap:"12px 9px",justifyContent:"center",marginRight:2}}>
                {Array.from({length:dotCount}).map((_,i)=>{
                  const bg = dotFor(i);
                  const glyph = glyphFor(i);
                  return (
                    <div key={i} style={{width:26,height:26,borderRadius:"50%",background:bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 0 #1C1D21",opacity:i<dotRevealCount?1:0.2,transform:i<dotRevealCount?"scale(1)":"scale(0.8)",transition:"opacity 0.22s ease, transform 0.22s ease",...(i===cardIdx && i<dotRevealCount && !reducedMotion ? {animation:"dotBeat 2.4s ease-in-out 0.3s infinite"} : {})}}>
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
                opacity:cancelled ? 0.28 : 0.44,
                zIndex:1,
              }}
            />
          )}
          <div style={{padding:"52px 22px 28px",minHeight:390,display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative"}}>
            {cancelled && (
              <div aria-label="Cancelled" role="img"
                style={{position:"absolute",left:"50%",top:"56%",zIndex:5,transform:"translate(-50%,-50%) rotate(-12deg)",border:"3px solid #E8344E",borderRadius:6,padding:"4px 14px",color:"#E8344E",background:"rgba(28,29,33,0.35)",fontFamily:FONT_FIGMA_STICKER,fontSize:"clamp(26px, 9vw, 38px)",letterSpacing:"0.08em",lineHeight:1,whiteSpace:"nowrap",pointerEvents:"none",textShadow:"0 0 1px #E8344E",animation:reducedMotion?"none":"cancelStamp 380ms cubic-bezier(.3,1.6,.5,1) 900ms both"}}>
                CANCELLED
              </div>
            )}
            <div>
              <div style={{...POPUP_YELLOW_TEXT,textAlign:"center",fontSize:16.5,textTransform:"uppercase",lineHeight:1.14,letterSpacing:"0.02em",marginBottom:12,position:"relative",zIndex:6}}>{msg.headline}</div>
              <div style={{...POPUP_PLAIN_WHITE_TEXT,textAlign:"center",fontSize:11.5,textTransform:"uppercase",lineHeight:1.32,letterSpacing:"0.01em",margin:"0 auto",maxWidth:340,position:"relative",zIndex:6,textShadow:"0 2px 0 #1C1D21, 0 0 8px rgba(28,29,33,0.85)"}}>{msg.sub}</div>
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
              <div style={{marginLeft:SKIP_BAG_NUDGE_X}}><MoneyBag text={money(budgetLeft)} ariaLabel="Budget left" label="Budget left"/></div>

              <div style={{display:showDots?"grid":"none",gridTemplateColumns:"repeat(5, 26px)",gridTemplateRows:"repeat(2, 26px)",gap:"12px 9px",justifyContent:"center",marginRight:2}}>
                {Array.from({length:dotCount}).map((_,i)=>{
                  const bg = dotFor(i);
                  const glyph = glyphFor(i);
                  return (
                    <div key={i} style={{width:26,height:26,borderRadius:"50%",background:bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 0 #1C1D21",opacity:i<dotRevealCount?1:0.2,transform:i<dotRevealCount?"scale(1)":"scale(0.8)",transition:"opacity 0.22s ease, transform 0.22s ease",...(i===cardIdx && i<dotRevealCount && !reducedMotion ? {animation:"dotBeat 2.4s ease-in-out 0.3s infinite"} : {})}}>
                      {i<dotRevealCount && (glyph==="x" ? <IconXMark size={10} color="#F08D87"/> : glyph==="check" ? <IconCheck size={10} color="#6AE89D"/> : null)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{height:94,marginTop:0,background:"transparent",borderTop:"none",position:"relative"}}>
            <button onClick={onNext} aria-label={isLast || cancelled ? "Finish" : "Next"}
              style={{position:"absolute",right:24,top:17,width:105,height:57,...BTN.primary,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={POPUP_BUTTON_TEXT}>{isLast || cancelled ? "Finish" : "Next"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

}

//
// CINEMA EXTRAS — film-themed animations and jokes (owner request 2026-10-21).
// Original wording and generic cinema imagery only: no posters, logos, real quotes
// or award names. Everything decorative ignores taps and respects reduce-motion.
//
const DIRECTOR_NOTES = [
  "Cut! From the top.",
  "Less drama, more title.",
  "The audience is getting restless.",
  "Again, with feeling.",
  "Close-ish. Go again.",
  "Hold for sound… and go again.",
  "Check the gate. Going again.",
];

const TRAILER_OPENERS = [
  "In a world… where two films collide…",
  "This season… one plot… two movies…",
  "From the people who brought you yesterday's card…",
  "One mashup. One day. One chance.",
  "Coming soon to a phone near you…",
];

// Spoof ratings in our own style (not the official rating-box design).
function getSpoofRating(ratio) {
  if (ratio >= 1)   return { code:"G",  label:"Got 'Em All",   color:"#6AE89D" };
  if (ratio >= 0.7) return { code:"PG", label:"Pretty Good",   color:"#FFD84D" };
  if (ratio >= 0.4) return { code:"M",  label:"Mixed Reviews", color:"#FFB347" };
  return                   { code:"R",  label:"Rough Night",   color:"#F08D87" };
}

// Made-up publications and quotes.
const CRITIC_OUTLETS = ["The Daily Plot", "Popcorn Quarterly", "Reel Talk Weekly", "The Mashup Monitor", "Sprocket & Spool"];
const CRITIC_QUOTES = {
  top:   ["I laughed, I cried, I named both films.", "A tour de force of knowing things.", "Flawless. I demand a sequel."],
  good:  ["Mostly brilliant, occasionally confused. Like the films.", "A crowd-pleaser with only minor plot holes."],
  mixed: ["Bold choices. Some of them were even right.", "Uneven, but the second act really found its feet."],
  low:   ["I have seen worse. Not recently.", "The popcorn was excellent.", "Walked in confident. Walked out humbled."],
};
function getCriticReview(ratio) {
  const tier = ratio >= 1 ? "top" : ratio >= 0.7 ? "good" : ratio >= 0.4 ? "mixed" : "low";
  const stars = { top:5, good:4, mixed:3, low: ratio > 0 ? 2 : 1 }[tier];
  const pool = CRITIC_QUOTES[tier];
  return {
    stars,
    quote: pool[Math.floor(Math.random() * pool.length)],
    outlet: CRITIC_OUTLETS[Math.floor(Math.random() * CRITIC_OUTLETS.length)],
  };
}

// Badges, remembered between visits.
const LS_BADGES = "plotmix_badges";
const BADGES = [
  { id:"directorsCut",    name:"Director's Cut",    emoji:"🎬", desc:"Solved a card with no hints" },
  { id:"plotTwist",       name:"Plot Twist",        emoji:"🌀", desc:`Released a film with ${money(1)} left in the budget` },
  { id:"boxOfficeSmash",  name:"Box Office Smash",  emoji:"💥", desc:"Solved 5 cards in a row" },
  { id:"goldenPopcorn",   name:"Golden Popcorn",    emoji:"🍿", desc:"Solved every card in a full run" },
  { id:"straightToVideo", name:"Straight to Video", emoji:"📼", desc:"Finished a run without releasing a single film" },
];
function loadBadges() {
  try { const v = JSON.parse(localStorage.getItem(LS_BADGES) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
// Records badges and returns the ones earned for the first time.
function earnBadges(ids) {
  const have = loadBadges();
  const fresh = ids.filter((id, i) => !have.includes(id) && ids.indexOf(id) === i);
  if (fresh.length) { try { localStorage.setItem(LS_BADGES, JSON.stringify([...have, ...fresh])); } catch {} }
  return fresh;
}

// Solved cards in a row at the end of the results so far.
function trailingSolvedStreak(results, upto) {
  let n = 0;
  for (let i = Math.min(upto, results.length) - 1; i >= 0; i--) {
    if (results[i] && isRoundSolved(results[i])) n++; else break;
  }
  return n;
}

// Film strip tiles drawn as small SVGs: dark film, sprocket holes on both edges, a lighter frame.
const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const FILM_STRIP_BG = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="54" height="72"><rect width="54" height="72" fill="#1C1D21"/><rect x="3" y="12" width="8" height="11" rx="2" fill="#F3F4FF"/><rect x="3" y="48" width="8" height="11" rx="2" fill="#F3F4FF"/><rect x="43" y="12" width="8" height="11" rx="2" fill="#F3F4FF"/><rect x="43" y="48" width="8" height="11" rx="2" fill="#F3F4FF"/><rect x="15" y="5" width="24" height="62" rx="2" fill="#8F86C4"/><rect x="15" y="5" width="24" height="62" rx="2" fill="url(#g)" opacity="0.5"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF"/><stop offset="1" stop-color="#3D3A55"/></linearGradient></defs></svg>');
const FILM_STRIP_BG_H = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><rect width="72" height="72" fill="#1C1D21"/><rect x="12" y="3" width="11" height="8" rx="2" fill="#F3F4FF"/><rect x="48" y="3" width="11" height="8" rx="2" fill="#F3F4FF"/><rect x="12" y="61" width="11" height="8" rx="2" fill="#F3F4FF"/><rect x="48" y="61" width="11" height="8" rx="2" fill="#F3F4FF"/><rect x="5" y="15" width="62" height="42" rx="2" fill="#8F86C4"/></svg>');

// Wrong guess: a clapperboard snaps shut on the next take, with a note from the director.
// Points counter: rolls to the new value and shakes harder the more points were lost.
function RollingPoints({value, reducedMotion=false, style}) {
  const [shown,setShown]=useState(value);
  const [shake,setShake]=useState(null);
  const prevRef=useRef(value);
  useEffect(()=>{
    const from=prevRef.current;
    prevRef.current=value;
    if(from===value) return;
    if(reducedMotion){ setShown(value); return; }
    if(value<from) setShake({key:Date.now(), amp: Math.min(8, 2 + (from-value)*2)});
    const start=performance.now(), dur=380;
    let raf=null;
    const tick=(now)=>{
      const t=Math.min(1,(now-start)/dur);
      setShown(Math.round(from+(value-from)*(1-Math.pow(1-t,3))));
      if(t<1) raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return ()=>{ if(raf) cancelAnimationFrame(raf); };
  },[value, reducedMotion]);
  return (
    <span key={shake?.key} style={{...style,display:"inline-block","--amp":`${shake?.amp||0}px`,animation:shake?"ptsShake 0.36s ease":"none",color:shake?"#FFB4B4":style?.color}}
      onAnimationEnd={()=>setShake(null)}>{money(shown)}</span>
  );
}

function ClapperTake({take, note, reducedMotion=false}) {
  const stripes = [6, 18, 30, 42];
  return (
    <div role="status" style={{position:"fixed",left:"50%",top:"34%",zIndex:320,pointerEvents:"none",
      transform:"translateX(-50%)",animation:reducedMotion?"none":"clapperIn 1.4s ease both"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#1C1D21",border:"2px solid #F3F4FF",borderRadius:12,boxShadow:"0 4px 0 #000"}}>
        <svg width="46" height="42" viewBox="0 0 46 42" aria-hidden="true" style={{overflow:"visible",flexShrink:0}}>
          <g style={{transformOrigin:"3px 14px",transformBox:"view-box",animation:reducedMotion?"none":"clapSnap 0.45s ease-out both"}}>
            <rect x="1" y="5" width="44" height="9" rx="1.5" fill="#F3F4FF"/>
            {stripes.map(x=><polygon key={x} points={`${x},5 ${x+6},5 ${x+2},14 ${x-4},14`} fill="#1C1D21"/>)}
          </g>
          <rect x="1" y="15" width="44" height="26" rx="2" fill="#F3F4FF"/>
          <rect x="1" y="15" width="44" height="7" fill="#1C1D21"/>
          {stripes.map(x=><polygon key={x} points={`${x},15 ${x+6},15 ${x+2},22 ${x-4},22`} fill="#F3F4FF"/>)}
          <line x1="6" y1="29" x2="40" y2="29" stroke="#1C1D21" strokeWidth="1.5"/>
          <line x1="6" y1="35" x2="28" y2="35" stroke="#1C1D21" strokeWidth="1.5"/>
        </svg>
        <div style={{textAlign:"left"}}>
          <div style={{...YELLOW_STICKER_TEXT,fontSize:16,lineHeight:1.1,textTransform:"uppercase"}}>Take {take}</div>
          <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12.5,color:"#F3F4FF",marginTop:3,whiteSpace:"nowrap"}}>{note}</div>
        </div>
      </div>
    </div>
  );
}

// Run streak shown as the owner's popcorn bucket art: 8 drawings that fill up (and spill)
// as the streak grows; kernels pop on every film found (owner request 2026-11-04).
const POPCORN_STAGES = Array.from({length:9}, (_,i)=>`/stickers/popcorn-${i}.webp`);
function PopcornMeter({streak, popKey, reducedMotion=false, inline=false, width}) {
  const level = Math.min(POPCORN_STAGES.length-1, streak);
  const kernels = [[-30,-34],[-14,-48],[4,-54],[20,-44],[32,-28]];
  const bucketW = width || (inline ? 58 : 76);
  const bucket = (
    <div style={{position:"relative",width:bucketW}}>
      <img src={POPCORN_STAGES[level]} alt="" aria-hidden="true" draggable="false"
        style={{display:"block",width:bucketW,height:"auto",userSelect:"none",filter:"drop-shadow(0 3px 0 rgba(0,0,0,0.35))",animation:reducedMotion||!popKey?"none":"scorePulse 0.28s ease"}} key={`b-${level}-${popKey}`}/>
      {!reducedMotion && popKey > 0 && kernels.map(([dx,dy],i)=>(
        <span key={`${popKey}-${i}`} style={{position:"absolute",left:bucketW/2-4,top:bucketW*0.3,width:9,height:9,borderRadius:"50%",background:"#FFF6D8",border:"1px solid #1C1D21",
          "--dx":`${dx}px`,"--dy":`${dy}px`,animation:`kernelPop 0.7s cubic-bezier(.2,.8,.3,1) ${i*30}ms both`}}/>
      ))}
    </div>
  );
  // Regular runs: just the bucket; the HUD places it and the streak text (owner layout 2026-11-04).
  if (inline) return <div aria-label={`Streak: ${streak}`} style={{pointerEvents:"none"}}>{bucket}</div>;
  // Speed Run: bucket and pill at the spots the owner placed in the HUD layout lab
  // (2026-11-05), in px on a 402px screen, spread as % of the width.
  const at=(x,y)=>({position:"absolute",left:`${x/402*100}%`,top:y});
  return (
    <div aria-label={`Streak: ${streak}`} style={{position:"absolute",top:0,left:0,right:0,height:0,zIndex:250,pointerEvents:"none"}}>
      <div style={at(145,-2)}>{bucket}</div>
      <span style={{...at(143,93),height:20,padding:"0 9px",borderRadius:10,background:"#FFD84D",border:"1.5px solid #1C1D21",fontFamily:FONT_FIGMA_STICKER,fontSize:10,color:"#1C1D21",display:"flex",alignItems:"center",whiteSpace:"nowrap",boxSizing:"border-box",animation:reducedMotion?"none":"titlePop 0.35s ease both"}}>{streak} in a row</span>
    </div>
  );
}

// Speed Run starts with an old film-leader countdown; the clock starts on "GO".
function FilmLeaderCountdown({onDone, reducedMotion=false}) {
  const [n,setN]=useState(3);
  const doneRef=useRef(onDone);
  doneRef.current=onDone;
  useEffect(()=>{
    SFX.leaderBeep(n===0);
    const id=setTimeout(()=>{ if(n===0) doneRef.current(); else setN(n-1); }, n===0 ? 450 : 700);
    return ()=>clearTimeout(id);
  },[n]);
  return (
    <div role="status" aria-label="Countdown" style={{position:"fixed",inset:0,zIndex:460,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(28,22,12,0.82)"}}>
      <div style={{position:"relative",width:220,height:220,borderRadius:"50%",border:"4px solid #F3F4FF",background:"#3A3226",overflow:"hidden",boxShadow:"0 0 0 10px rgba(243,244,255,0.12)"}}>
        {!reducedMotion && n>0 && (
          <div key={n} style={{position:"absolute",inset:0,background:"conic-gradient(rgba(243,244,255,0.28) 0deg, rgba(243,244,255,0.28) 90deg, transparent 90deg)",animation:"leaderSweep 0.7s linear both"}}/>
        )}
        <div style={{position:"absolute",left:0,right:0,top:"50%",height:2,background:"rgba(243,244,255,0.55)"}}/>
        <div style={{position:"absolute",top:0,bottom:0,left:"50%",width:2,background:"rgba(243,244,255,0.55)"}}/>
        <div style={{position:"absolute",inset:26,borderRadius:"50%",border:"2px solid rgba(243,244,255,0.55)"}}/>
        <div key={`num-${n}`} style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",...WHITE_STICKER_TEXT,fontSize:n===0?52:96,lineHeight:1,animation:reducedMotion?"none":"titlePop 0.3s ease both"}}>
          {n===0 ? "GO!" : n}
        </div>
      </div>
    </div>
  );
}

// Owner request 2026-10-26: a row of seated cinema-goers (silhouettes) rises from the bottom.
// Only for the big moments, so the screen never gets busy: a cheer when a card is solved and a
// groan when one is lost, in the pause before the result (nothing to tap then). ~1.7 seconds.
const AUDIENCE_HAIR = ["short", "long", "spiky", "buns", "quiff", "short", "spiky", "long", "buns", "quiff"];
function AudienceRow({mood="cheer", animate=true}) {
  const cheer = mood === "cheer";
  const ink = "#26323A";
  return (
    <svg viewBox="0 0 402 64" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      {AUDIENCE_HAIR.map((hair, i) => {
        const cx = 22 + i * 39.8;
        const dy = i % 2 ? 2 : 0;
        return (
          <g key={i} style={animate ? {transformBox:"fill-box",transformOrigin:"50% 100%",
            animation:cheer ? "audienceCheer 0.7s ease-in-out 2" : "audienceGroan 0.5s ease-out both",animationDelay:`${(i % 3) * 0.09}s`} : undefined}>
            {hair === "long" && <path d={`M${cx-9} ${16+dy} Q${cx-10} ${4+dy} ${cx} ${4+dy} Q${cx+10} ${4+dy} ${cx+9} ${16+dy} L${cx+10} ${32+dy} L${cx-10} ${32+dy} Z`} fill={ink}/>}
            <ellipse cx={cx} cy={15+dy} rx="7.5" ry="8.5" fill={ink}/>
            {hair === "short" && <ellipse cx={cx} cy={9+dy} rx="8" ry="5" fill={ink}/>}
            {hair === "spiky" && <path d={`M${cx-8} ${12+dy} L${cx-6} ${3+dy} L${cx-3} ${8+dy} L${cx} ${1+dy} L${cx+3} ${8+dy} L${cx+6} ${3+dy} L${cx+8} ${12+dy} Z`} fill={ink}/>}
            {hair === "buns" && <><circle cx={cx-6} cy={6+dy} r="4.2" fill={ink}/><circle cx={cx+6} cy={6+dy} r="4.2" fill={ink}/></>}
            {hair === "quiff" && <path d={`M${cx-8} ${12+dy} Q${cx-7} ${2+dy} ${cx+3} ${3+dy} Q${cx+11} ${4+dy} ${cx+8} ${12+dy} Z`} fill={ink}/>}
            <rect x={cx-3.5} y={21+dy} width="7" height="8" fill={ink}/>
            <path d={`M${cx-18} 64 L${cx-18} ${33+dy} Q${cx-18} ${27+dy} ${cx-11} ${27+dy} L${cx+11} ${27+dy} Q${cx+18} ${27+dy} ${cx+18} ${33+dy} L${cx+18} 64 Z`} fill={ink}/>
          </g>
        );
      })}
      <rect x="2" y="44" width="398" height="13" rx="3" fill={ink}/>
      {AUDIENCE_HAIR.map((_, i) => {
        const cx = 22 + i * 39.8;
        return <g key={i}><rect x={cx-15} y="57" width="5" height="6" rx="2" fill={ink}/><rect x={cx+10} y="57" width="5" height="6" rx="2" fill={ink}/></g>;
      })}
    </svg>
  );
}
function AudienceReaction({mood}) {
  const cheer = mood === "cheer";
  return (
    <div role="status" aria-label={cheer ? "Audience cheers" : "Audience groans"}
      style={{position:"fixed",left:0,right:0,bottom:0,height:64,zIndex:290,pointerEvents:"none",animation:"audienceIn 1.7s ease both"}}>
      <div style={{position:"absolute",left:"50%",bottom:60,transform:"translateX(-50%)",whiteSpace:"nowrap",padding:"3px 10px",borderRadius:10,background:"rgba(14,10,44,0.8)",...WHITE_STICKER_TEXT,fontSize:12,textTransform:"uppercase"}}>
        {cheer ? "👏 Woo-hoo!" : "😩 Awww…"}
      </div>
      <AudienceRow mood={mood}/>
      {cheer && (
        <div style={{position:"absolute",left:"62%",bottom:34,width:26,height:26,animation:"popcornToss 1.2s ease-out 0.25s both"}}>
          <ArcadeItemArt kind="popcorn" variant={1}/>
        </div>
      )}
    </div>
  );
}

// Holiday decorations: a garland across the top of the screen with ornaments hanging from it.
function HolidayOrnament({decor, i}) {
  const ink = "#1C1D21";
  if (decor === "pumpkins") return i % 3 === 2
    ? <svg viewBox="0 0 32 20" width="30" height="19"><path d="M16 8 C12 2 6 2 1 6 C5 7 6 10 5 13 C8 11 11 12 13 14 L16 17 L19 14 C21 12 24 11 27 13 C26 10 27 7 31 6 C26 2 20 2 16 8 Z" fill="#2B1840" stroke={ink} strokeWidth="1"/></svg>
    : <svg viewBox="0 0 28 26" width="26" height="24"><rect x="12.5" y="1" width="3" height="6" rx="1" fill="#3E7B2C" stroke={ink} strokeWidth="0.8"/><ellipse cx="14" cy="16" rx="12" ry="9" fill="#F28C1B" stroke={ink} strokeWidth="1.2"/><path d="M8 9 Q5 16 8 24 M14 7 V25 M20 9 Q23 16 20 24" stroke="#C9650B" strokeWidth="1.2" fill="none"/><path d="M8 14 l3 -2 1 3 Z M20 14 l-3 -2 -1 3 Z M9 19 q5 4 10 0" fill="#3A1C04" stroke="#3A1C04" strokeWidth="1"/></svg>;
  if (decor === "lights") {
    const c = ["#E4444F", "#20B46A", "#FFD84D", "#2F6BFF"][i % 4];
    return <svg viewBox="0 0 16 26" width="14" height="24" style={{filter:`drop-shadow(0 0 5px ${c})`}}><rect x="5" y="0" width="6" height="6" rx="1" fill="#4A4F58" stroke={ink} strokeWidth="0.8"/><path d="M8 5 C2 9 1 17 8 25 C15 17 14 9 8 5 Z" fill={c} stroke={ink} strokeWidth="1"/><ellipse cx="6" cy="12" rx="1.6" ry="3" fill="#fff" opacity="0.6"/></svg>;
  }
  if (decor === "dreidels") return i % 2
    ? <svg viewBox="0 0 22 22" width="18" height="18"><circle cx="11" cy="11" r="9.5" fill="#E8B92B" stroke={ink} strokeWidth="1.2"/><circle cx="11" cy="11" r="6" fill="none" stroke="#B8860B" strokeWidth="1"/></svg>
    : <svg viewBox="0 0 22 30" width="20" height="27"><rect x="9" y="0" width="4" height="7" rx="1" fill="#C9D6F2" stroke={ink} strokeWidth="0.8"/><path d="M3 7 H19 V19 L11 29 L3 19 Z" fill="#2F5BD3" stroke={ink} strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 11 H15 V17 H7 Z" fill="#C9D6F2" opacity="0.85"/></svg>;
  if (decor === "lanterns") return (
    <svg viewBox="0 0 26 40" width="24" height="37"><rect x="8" y="0" width="10" height="4" rx="1" fill="#D9A21B" stroke={ink} strokeWidth="0.8"/><ellipse cx="13" cy="15" rx="12" ry="11" fill="#D7261E" stroke={ink} strokeWidth="1.2"/><path d="M7 6 Q4 15 7 24 M13 4 V26 M19 6 Q22 15 19 24" stroke="#A3140E" strokeWidth="1" fill="none"/><rect x="8" y="25" width="10" height="4" rx="1" fill="#D9A21B" stroke={ink} strokeWidth="0.8"/><path d="M11 29 V39 M13 29 V40 M15 29 V39" stroke="#D9A21B" strokeWidth="1.4"/></svg>
  );
  if (decor === "crescents") return i % 2
    ? <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 2 A10 10 0 1 0 22 18 A8 8 0 1 1 15 2 Z" fill="#E8C55A" stroke={ink} strokeWidth="1"/></svg>
    : <svg viewBox="0 0 20 34" width="18" height="31"><path d="M10 0 L13 6 H7 Z" fill="#C9A227" stroke={ink} strokeWidth="0.8"/><path d="M5 6 H15 L17 12 V24 L13 30 H7 L3 24 V12 Z" fill="#1F6B54" stroke={ink} strokeWidth="1.1"/><path d="M6 13 H14 V23 H6 Z" fill="#FFD97A" opacity="0.9"/><path d="M10 13 V23 M6 18 H14" stroke="#C9A227" strokeWidth="0.8"/></svg>;
  if (decor === "eggs") {
    const [a, b] = [["#F4B6C2", "#8FD3F4"], ["#BDE8A6", "#F8D86A"], ["#C9B6F2", "#F4B6C2"], ["#8FD3F4", "#F8D86A"]][i % 4];
    return <svg viewBox="0 0 20 26" width="17" height="22"><path d="M10 1 C3 1 1 12 1 16 C1 22 5 25 10 25 C15 25 19 22 19 16 C19 12 17 1 10 1 Z" fill={a} stroke={ink} strokeWidth="1.1"/><path d="M2 14 l3 -3 3 3 3 -3 3 3 3 -3 1.5 1.5" stroke={b} strokeWidth="2.2" fill="none"/></svg>;
  }
  // newyear: gold stars and streamers
  return i % 2
    ? <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 1 L14.8 8.6 L23 9 L16.6 14 L18.8 22 L12 17.4 L5.2 22 L7.4 14 L1 9 L9.2 8.6 Z" fill="#FFD84D" stroke={ink} strokeWidth="1"/></svg>
    : <svg viewBox="0 0 12 34" width="10" height="30"><path d="M6 0 Q1 6 6 12 Q11 18 6 24 Q1 30 6 34" stroke={["#E4444F", "#2F6BFF", "#20B46A"][i % 3]} strokeWidth="3.5" fill="none" strokeLinecap="round"/></svg>;
}
function HolidayDecor({holiday, reducedMotion=false}) {
  const count = 11;
  return (
    <div role="img" aria-label={`${holiday.name} decorations`} style={{position:"fixed",top:0,left:0,right:0,height:58,zIndex:60,pointerEvents:"none"}}>
      <svg viewBox="0 0 402 20" width="100%" height="20" preserveAspectRatio="none" aria-hidden="true" style={{position:"absolute",top:0,left:0}}>
        <path d={`M0 3 ${Array.from({length:count},(_,i)=>`Q${(i+0.5)*402/count} 16 ${(i+1)*402/count} 3`).join(" ")}`} stroke={holiday.curtains[1]} strokeWidth="2.2" fill="none"/>
      </svg>
      {Array.from({length:count},(_,i)=>(
        <div key={i} style={{position:"absolute",top:9 + (i % 2) * 3,left:`${(i+0.5)*100/count}%`,transform:"translateX(-50%)",transformOrigin:"50% 0",
          animation:reducedMotion ? "none" : `decorSway ${2.4 + (i % 3) * 0.4}s ease-in-out ${-(i * 0.3)}s infinite`}}>
          <div style={{width:1.5,height:4 + (i % 3) * 3,background:holiday.curtains[1],margin:"0 auto"}}/>
          <HolidayOrnament decor={holiday.decor} i={i}/>
        </div>
      ))}
    </div>
  );
}

// Owner request 2026-10-26: the 3rd wrong guess on a card brings the crowd back to boo and throw
// a tomato at the screen. 2.8 seconds, never blocks taps.
const TOMATO_MS = 2800;
function TomatoBoo() {
  return (
    <div role="status" aria-label="Boo" style={{position:"fixed",inset:0,zIndex:330,pointerEvents:"none",overflow:"hidden"}}>
      {/* The splat stays on the "screen" a moment, dripping, then fades. */}
      <div style={{position:"absolute",left:"50%",top:"34%",width:190,height:190,marginLeft:-95,marginTop:-95,animation:`tomatoSplat ${TOMATO_MS}ms ease both`}}>
        <svg viewBox="0 0 200 200" width="190" height="190" aria-hidden="true">
          <path d="M100 30 C120 34 128 18 140 30 C150 40 136 52 150 60 C168 66 186 58 184 78 C182 96 162 92 160 106 C158 120 178 130 166 146 C154 160 140 144 128 154 C116 164 118 184 100 182 C82 180 88 160 74 154 C60 148 48 166 36 152 C24 138 44 124 40 110 C36 96 14 98 16 80 C18 62 40 70 50 60 C60 50 48 36 62 28 C76 20 84 28 100 30 Z" fill="#D7261E" stroke="#7A0A10" strokeWidth="3"/>
          <circle cx="58" cy="44" r="7" fill="#D7261E"/><circle cx="160" cy="48" r="5" fill="#D7261E"/><circle cx="176" cy="132" r="6" fill="#D7261E"/><circle cx="30" cy="120" r="5" fill="#D7261E"/>
          <path d="M82 110 Q86 140 84 168 M118 116 Q120 136 119 150" stroke="#B3192C" strokeWidth="9" strokeLinecap="round" fill="none" style={{animation:`tomatoDrip ${TOMATO_MS}ms ease-in both`}}/>
          <ellipse cx="86" cy="76" rx="18" ry="10" fill="#FF6B6B" opacity="0.6"/>
          <path d="M92 92 l6 -10 6 10 M100 84 v-8" stroke="#2E7D32" strokeWidth="4" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      {/* The tomato, thrown from the crowd. */}
      <div style={{position:"absolute",left:"62%",bottom:40,width:44,height:44,marginLeft:-22,animation:"tomatoThrow 0.65s cubic-bezier(.3,.6,.5,1) 0.3s both"}}>
        <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
          <circle cx="22" cy="25" r="17" fill="#E4322B" stroke="#1C1D21" strokeWidth="2"/>
          <path d="M22 9 l-6 -3 4 5 -8 1 8 2 -4 5 6 -4 6 4 -4 -5 8 -2 -8 -1 4 -5 Z" fill="#2E7D32" stroke="#1C1D21" strokeWidth="1"/>
          <ellipse cx="15" cy="20" rx="4" ry="6" fill="#fff" opacity="0.35"/>
        </svg>
      </div>
      <div style={{position:"absolute",left:"50%",bottom:76,transform:"translateX(-50%)",...WHITE_STICKER_TEXT,fontSize:34,color:"#FFB4B4",animation:`booShake ${TOMATO_MS}ms ease both`}}>BOO!</div>
      <div style={{position:"absolute",left:0,right:0,bottom:0,height:64,animation:`audienceInLong ${TOMATO_MS}ms ease both`}}>
        <AudienceRow mood="groan"/>
      </div>
    </div>
  );
}

// Owner request 2026-10-26: sit idle too long and the usher's flashlight sweeps across.
const USHER_IDLE_MS = 30000;
function Usher() {
  return (
    <div role="status" aria-label="Usher" style={{position:"fixed",inset:0,zIndex:320,pointerEvents:"none",overflow:"hidden",animation:"usherDim 3.2s ease both"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(6,4,18,0.55)"}}/>
      <div style={{position:"absolute",left:"50%",top:"38%",width:260,height:260,marginLeft:-130,marginTop:-130,borderRadius:"50%",
        background:"radial-gradient(circle, rgba(255,244,190,0.55) 0%, rgba(255,244,190,0.22) 45%, rgba(255,244,190,0) 70%)",animation:"usherSweep 3.2s ease-in-out both"}}/>
      <div style={{position:"absolute",left:"50%",bottom:"22%",transform:"translateX(-50%)",whiteSpace:"nowrap",padding:"10px 16px",borderRadius:12,background:"rgba(14,10,44,0.85)",border:"2px solid #1C1D21",...WHITE_STICKER_TEXT,fontSize:13}}>
        🔦 Psst… the film's started.
      </div>
    </div>
  );
}

// Owner request 2026-10-26: paparazzi flashes on the end screen after a perfect run.
function CameraFlashes() {
  useEffect(() => { SFX.shutter(8); }, []);
  const spots = [[12, 18], [82, 12], [30, 34], [70, 30], [8, 58], [90, 52], [22, 80], [78, 76], [50, 8], [55, 64]];
  return (
    <div aria-label="Camera flashes" role="img" style={{position:"fixed",inset:0,zIndex:730,pointerEvents:"none"}}>
      {spots.map(([x, y], i) => (
        <div key={i} style={{position:"absolute",left:`${x}%`,top:`${y}%`,width:90,height:90,opacity:0,
          background:"radial-gradient(circle, #FFFFFF 0%, rgba(255,255,255,0.85) 12%, rgba(255,250,220,0.35) 32%, rgba(255,255,255,0) 62%)",
          animation:`flashPop 1.6s ease-out ${(i * 0.37) % 1.6}s 3`}}/>
      ))}
    </div>
  );
}

// Between cards (alternative): a camera iris. Six overlapping steel blades swirl shut to a point
// and open again, like a real lens aperture (owner request 2026-11-05: not a cartoon circle).
const IRIS_MS = 1100;
// One blade, drawn closed (its tip at the centre). Every blade is this one turned by 60 degrees,
// and it opens by sliding out along its own radius, so the aperture stays a sharp hexagon.
const IRIS_BLADE = (() => {
  const L = 420, d = (i) => { const a = (k) => (k / 6) * Math.PI * 2 - Math.PI / 2; return [Math.cos(a(i + 1)) - Math.cos(a(i)), Math.sin(a(i + 1)) - Math.sin(a(i))]; };
  const d0 = d(0), dp = d(-1);
  return [[0, 0], d0, [d0[0] * L, d0[1] * L], [dp[0] * L, dp[1] * L]].map(p => p.map(n => +n.toFixed(3)).join(",")).join(" ");
})();
function IrisWipe() {
  return (
    <div role="status" aria-label="Iris change" style={{position:"fixed",inset:0,zIndex:305,pointerEvents:"none",overflow:"hidden"}}>
      <svg width="100%" height="100%" viewBox="-100 -90 200 200" preserveAspectRatio="xMidYMid slice" style={{position:"absolute",inset:0,display:"block"}}>
        <defs>
          <linearGradient id="irisBlade" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stopColor="#4A4A56"/><stop offset="0.35" stopColor="#24242C"/><stop offset="1" stopColor="#0E0E13"/></linearGradient>
        </defs>
        <g style={{transformBox:"view-box",transformOrigin:"0px 0px",animation:`irisTurn ${IRIS_MS}ms cubic-bezier(.6,0,.4,1) both`}}>
          {[0,1,2,3,4,5].map(i => (
            <g key={i} transform={`rotate(${i * 60})`}>
              <polygon points={IRIS_BLADE} fill="url(#irisBlade)" stroke="#9A9AA8" strokeWidth="1.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                style={{animation:`irisSlide ${IRIS_MS}ms cubic-bezier(.6,0,.4,1) both`}}/>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
// Between cards (alternative): a classic black-and-white clapperboard drops in, its striped
// arm snaps shut on the hinge, and it lifts away (owner reference 2026-11-05).
const CLAPPER_SLAM_MS = 1250;
const CLAPPER_STRIPES = "repeating-linear-gradient(115deg,#F7F4EE 0 22px,#141418 22px 44px)";
function ClapperSlam({scene}) {
  const ink = "#F7F4EE";
  const label = {fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:13,letterSpacing:"0.06em",color:ink,textTransform:"uppercase",lineHeight:1};
  const chalk = {fontFamily:FONT_FIGMA_STICKER,fontSize:13,color:ink,lineHeight:1,whiteSpace:"nowrap"};
  const today = new Date();
  const date = `${String(today.getMonth()+1).padStart(2,"0")}/${String(today.getDate()).padStart(2,"0")}`;
  const row = (name, value) => (
    <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
      <span style={label}>{name}</span>
      <span style={{flex:1,borderBottom:`2px solid ${ink}`,paddingBottom:2,textAlign:"left",...chalk}}>{value}</span>
    </div>
  );
  const cell = (name, value, last) => (
    <div style={{flex:1,borderRight:last ? "none" : `2px solid ${ink}`,padding:"6px 4px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:7}}>
      <span style={{...label,fontSize:11}}>{name}</span>
      <span style={{...chalk,fontSize:20}}>{value}</span>
    </div>
  );
  return (
    <div role="status" aria-label="Clapper change" style={{position:"fixed",inset:0,zIndex:305,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(11,8,18,0.55)",animation:`leaderFade ${CLAPPER_SLAM_MS}ms linear both`}}>
      <div style={{position:"relative",width:264,filter:"drop-shadow(0 10px 18px rgba(0,0,0,0.55))",animation:`slamDrop ${CLAPPER_SLAM_MS}ms cubic-bezier(.2,.9,.3,1) both`}}>
        <div style={{position:"absolute",left:0,right:0,top:0,height:32,transformOrigin:"12px 30px",animation:`slamArm ${CLAPPER_SLAM_MS}ms ease-in both`,
          background:CLAPPER_STRIPES,border:"3px solid #141418",borderRadius:"3px 3px 2px 2px",boxSizing:"border-box"}}/>
        <div style={{marginTop:34,height:32,background:CLAPPER_STRIPES,backgroundPosition:"22px 0",border:"3px solid #141418",borderBottomWidth:2,boxSizing:"border-box"}}/>
        <div aria-hidden="true" style={{position:"absolute",left:5,top:26,width:15,height:15,borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,#F2F2F2,#8C8C94 60%,#4A4A52)",border:"2px solid #141418",boxSizing:"border-box",zIndex:2}}/>
        <div style={{background:"#141418",borderRadius:"0 0 10px 10px",padding:"14px 16px 0",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{...label,fontFamily:FONT_FIGMA_STICKER,fontWeight:400,fontSize:22,letterSpacing:"0.04em",textAlign:"center",paddingBottom:2}}>Hollywood</div>
          {row("Production", "PlotMix")}
          {row("Director", "You")}
          {row("Camera", "T. Rex")}
          <div style={{display:"flex",margin:"2px -16px 0",borderTop:`2px solid ${ink}`}}>
            {cell("DATE", date)}
            {cell("SCENE ", scene)}
            {cell("TAKE", 1, true)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Between cards (alternative): wide film strips race down both sides and the projector flickers.
const FILM_REEL_MS = 950;
function FilmReelChange() {
  return (
    <div role="status" aria-label="Film reel change" style={{position:"fixed",inset:0,zIndex:305,pointerEvents:"none",overflow:"hidden",animation:`filmJitter ${FILM_REEL_MS}ms steps(10) both`}}>
      {["left","right"].map(side=>(
        <div key={side} style={{position:"absolute",top:"-10%",bottom:"-10%",[side]:0,width:54,backgroundImage:FILM_STRIP_BG,backgroundSize:"54px 72px",backgroundRepeat:"repeat-y",
          boxShadow:"0 0 12px rgba(0,0,0,0.5)",animation:`filmSideIn${side==="left"?"L":"R"} ${FILM_REEL_MS}ms ease both, filmRoll ${FILM_REEL_MS}ms linear both`}}/>
      ))}
      <div style={{position:"absolute",inset:0,background:"#FFF8E7",animation:`projectorFlicker ${FILM_REEL_MS}ms linear both`}}/>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(90deg, transparent 0 37px, rgba(28,22,12,0.35) 37px 38px, transparent 38px 113px, rgba(255,255,255,0.5) 113px 114px)",animation:`filmScratch ${FILM_REEL_MS}ms steps(6) both`}}/>
    </div>
  );
}

// Between cards: an old film-leader countdown, "5, 4, blip!" (owner request 2026-10-25).
const LEADER_BLIP_MS = 1300;
function LeaderBlip() {
  const [step, setStep] = useState(5); // 5, 4, then 0 = the blip
  useEffect(() => {
    SFX.leaderBeep(step === 0);
    if (step === 0) return;
    const id = setTimeout(() => setStep(step === 5 ? 4 : 0), 420);
    return () => clearTimeout(id);
  }, [step]);
  return (
    <div role="status" aria-label="Next card countdown" style={{position:"fixed",inset:0,zIndex:305,pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center",
      background:"rgba(28,22,12,0.9)",animation:`leaderFade ${LEADER_BLIP_MS}ms linear both`}}>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(90deg, transparent 0 37px, rgba(255,255,255,0.18) 37px 38px, transparent 38px 113px, rgba(255,255,255,0.3) 113px 114px)",animation:"filmScratch 0.8s steps(6) infinite"}}/>
      <div style={{position:"relative",width:200,height:200,borderRadius:"50%",border:"4px solid #F3F4FF",background:"#3A3226",overflow:"hidden",boxShadow:"0 0 0 10px rgba(243,244,255,0.12)"}}>
        {step > 0 && <div key={step} style={{position:"absolute",inset:0,background:"conic-gradient(rgba(243,244,255,0.28) 0deg, rgba(243,244,255,0.28) 90deg, transparent 90deg)",animation:"leaderSweep 0.42s linear both"}}/>}
        <div style={{position:"absolute",left:0,right:0,top:"50%",height:2,background:"rgba(243,244,255,0.55)"}}/>
        <div style={{position:"absolute",top:0,bottom:0,left:"50%",width:2,background:"rgba(243,244,255,0.55)"}}/>
        <div style={{position:"absolute",inset:24,borderRadius:"50%",border:"2px solid rgba(243,244,255,0.55)"}}/>
        {step > 0 && (
          <div key={`n${step}`} style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",...WHITE_STICKER_TEXT,fontSize:92,lineHeight:1}}>{step}</div>
        )}
      </div>
      {step === 0 && <div style={{position:"absolute",inset:0,background:"#FFFDF2",animation:"leaderBlip 0.35s ease-out both"}}/>}
    </div>
  );
}

// Red curtains that part to reveal the screen, with an optional trailer-voice line.
function CurtainReveal({line=null, zIndex=600, reducedMotion=false, colors=null}) {
  const [visible,setVisible]=useState(true);
  useEffect(()=>{
    if(reducedMotion) return;
    SFX.curtain(line ? 2.3 : 0.25);
    const id=setTimeout(()=>setVisible(false), line ? 4100 : 2100);
    return ()=>clearTimeout(id);
  },[reducedMotion, line]);
  if(reducedMotion || !visible) return null;
  // With a line, the curtains wait until it has been read (owner feedback 2026-10-26).
  const delay = line ? 2.3 : 0.25;
  const [c0, c1] = colors || curtainColors();
  // Velvet with deep pleats: the folds bunch up as each side is drawn to the wings, and the
  // hem lags a little behind the top like real fabric (owner request 2026-11-05).
  const pleats = `repeating-linear-gradient(90deg, rgba(0,0,0,0.38) 0px, rgba(0,0,0,0) 7px, rgba(255,255,255,0.13) 13px, rgba(0,0,0,0) 19px, rgba(0,0,0,0.38) 26px)`;
  const velvet = `linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%), ${pleats}, repeating-linear-gradient(90deg, ${c0} 0px, ${c1} 13px, ${c0} 26px)`;
  const swagFill = `linear-gradient(180deg, ${c1}, ${c0})`;
  const SWAGS = 5;
  return (
    <div aria-hidden="true" style={{position:"fixed",inset:0,zIndex,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,bottom:0,left:0,width:"51%",background:velvet,boxShadow:"inset -14px 0 22px rgba(0,0,0,0.5)",transformOrigin:"0 0",animation:`curtainLeft 1.6s cubic-bezier(.55,.05,.35,1) ${delay}s both`}}/>
      <div style={{position:"absolute",top:0,bottom:0,right:0,width:"51%",background:velvet,boxShadow:"inset 14px 0 22px rgba(0,0,0,0.5)",transformOrigin:"100% 0",animation:`curtainRight 1.6s cubic-bezier(.55,.05,.35,1) ${delay}s both`}}/>
      {Array.from({length:SWAGS}).map((_,i)=>(
        <div key={i} style={{position:"absolute",top:-4,left:`${i*(100/SWAGS) - 2}%`,width:`${100/SWAGS + 4}%`,height:78,zIndex:2,background:swagFill,
          WebkitMask:"radial-gradient(ellipse 52% 100% at 50% 0, #000 98%, transparent 100%)",mask:"radial-gradient(ellipse 52% 100% at 50% 0, #000 98%, transparent 100%)",
          boxShadow:"inset 0 -6px 0 #F6A507",transformOrigin:"50% 0",
          animation:`curtainSwag 1.2s cubic-bezier(.5,0,.3,1) ${delay + 0.15 + Math.abs(i-(SWAGS-1)/2)*0.09}s both`}}>
          <div style={{position:"absolute",inset:0,background:"repeating-radial-gradient(ellipse 60% 120% at 50% -10%, rgba(0,0,0,0) 0 10px, rgba(0,0,0,0.28) 14px, rgba(0,0,0,0) 18px)"}}/>
          <div style={{position:"absolute",left:"6%",right:"6%",bottom:0,height:7,background:"repeating-linear-gradient(90deg, #F6A507 0 2px, transparent 2px 5px)",opacity:0.9}}/>
        </div>
      ))}
      <div style={{position:"absolute",top:0,left:0,right:0,height:16,zIndex:3,background:`linear-gradient(${c0},${c1})`,borderBottom:"3px solid #F6A507",animation:`curtainValance 0.9s ease-in ${delay+0.75}s both`}}/>
      {line && (
        <div style={{position:"absolute",left:24,right:24,top:"42%",textAlign:"center",...YELLOW_STICKER_TEXT,fontSize:"clamp(16px, 5vw, 22px)",lineHeight:1.3,textTransform:"uppercase",animation:"trailerLine 2.8s ease both"}}>
          {line}
        </div>
      )}
    </div>
  );
}

// A losing card's frame "burns" in the projector before the result appears.
function FilmBurn() {
  return (
    <div aria-hidden="true" style={{position:"fixed",inset:0,zIndex:310,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",left:"62%",top:"26%",width:160,height:160,marginLeft:-80,marginTop:-80,borderRadius:"50%",
        background:"radial-gradient(circle, rgba(255,247,214,0.95) 0%, rgba(255,166,48,0.85) 22%, rgba(122,40,4,0.7) 44%, rgba(0,0,0,0) 70%)",
        animation:"filmBurn 0.9s ease-out both"}}/>
      <div style={{position:"absolute",left:"30%",top:"62%",width:120,height:120,marginLeft:-60,marginTop:-60,borderRadius:"50%",
        background:"radial-gradient(circle, rgba(255,247,214,0.9) 0%, rgba(255,166,48,0.8) 22%, rgba(122,40,4,0.65) 44%, rgba(0,0,0,0) 70%)",
        animation:"filmBurn 0.9s ease-out 0.12s both"}}/>
    </div>
  );
}

// Time until the next Daily (local midnight).
function NextDailyCountdown() {
  const calc=()=>{
    const now=new Date();
    const next=new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
    const s=Math.max(0, Math.floor((next-now)/1000));
    return [Math.floor(s/3600), Math.floor(s/60)%60, s%60].map(n=>String(n).padStart(2,"0")).join(":");
  };
  const [left,setLeft]=useState(calc);
  useEffect(()=>{ const id=setInterval(()=>setLeft(calc()),1000); return ()=>clearInterval(id); },[]);
  return <span>{left}</span>;
}

function BadgeToast({badges, onDone}) {
  return (
    <div role="status" style={{position:"fixed",top:"max(6px, calc(100dvh - 868px))",left:"calc(50% - 1.5px)",transform:"translateX(-50%)",zIndex:520,pointerEvents:"none",display:"flex",flexDirection:"column",gap:6,alignItems:"center",animation:"badgeDrop 6.1s cubic-bezier(.3,1,.4,1) both"}} onAnimationEnd={e=>{ if (e.target===e.currentTarget && onDone) onDone(); }}>
      {badges.map(b=>(
        <div key={b.id} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"min(330px, calc(100vw - 24px))",minHeight:38,boxSizing:"border-box",padding:"6px 14px",background:"#FFD84D",border:"2px solid #1C1D21",borderRadius:12,boxShadow:"0 3px 0 #1C1D21",whiteSpace:"nowrap"}}>
          <span style={{fontSize:18,lineHeight:1}}>{b.emoji}</span>
          <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:11,color:"#1C1D21",textTransform:"uppercase"}}>{b.title || `Badge unlocked: ${b.name}`}</span>
        </div>
      ))}
    </div>
  );
}

const CINEMA_KEYFRAMES = `
  @keyframes trexPop { 0%{transform:translate(-50%,-50%) scale(1);opacity:1} 70%{transform:translate(-50%,-50%) scale(1.35);opacity:1} 100%{transform:translate(-50%,-50%) scale(1.6);opacity:0} }
  @keyframes bagPop { 0%{transform:scale(1)} 35%{transform:scale(1.28)} 100%{transform:scale(1)} }
  @keyframes bagFlare { 0%{opacity:0; transform:scale(0.4) rotate(0deg)} 25%{opacity:1; transform:scale(1.05) rotate(20deg)} 100%{opacity:0; transform:scale(1.3) rotate(60deg)} }
  @keyframes introSkipHint { from{opacity:0} to{opacity:1} }
  @keyframes dotBeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
  @keyframes bonusFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes bagDrop { 0%{transform:translate(-8px,-7px) rotate(-8deg)} 100%{transform:translate(0,0) rotate(0)} }
  @keyframes sparkleTwinkle { 0%,100%{transform:scale(1) rotate(0)} 50%{transform:scale(0.6) rotate(25deg)} }
  @keyframes badgeDrop { 0%{opacity:0;transform:translateX(-50%) translateY(-160px)} 5%{opacity:1;transform:translateX(-50%) translateY(6px)} 7.5%,89.5%{opacity:1;transform:translateX(-50%) translateY(0)} 100%{opacity:0;transform:translateX(-50%) translateY(-160px)} }
  @keyframes fameStamp { 0%{opacity:0; transform:translate(-50%,-50%) scale(2.6) rotate(-40deg)} 70%{opacity:1; transform:translate(-50%,-50%) scale(0.9) rotate(-8deg)} 100%{opacity:1; transform:translate(-50%,-50%) scale(1) rotate(-12deg)} }
  @keyframes raysSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes bulbChase { 0%{background:#FFFDF0; box-shadow:0 0 12px 5px rgba(255,226,110,0.95), 0 0 24px 8px rgba(255,200,60,0.45)} 35%,100%{background:#B88A2A; box-shadow:0 0 4px 1px rgba(255,216,77,0.35)} }
  @keyframes decorSway { 0%,100%{transform:translateX(-50%) rotate(-6deg)} 50%{transform:translateX(-50%) rotate(6deg)} }
  @keyframes vhsPress { 0%,49%{transform:translateY(0); box-shadow:0 7px 0 #0B0C10} 50%,100%{transform:translateY(6px); box-shadow:0 1px 0 #0B0C10} }
  @keyframes laserReady { 0%,100%{filter:brightness(0.6) saturate(0.8)} 50%{filter:brightness(1.6) saturate(1.2)} }
  @keyframes laserHalo { 0%,100%{opacity:0.1; transform:scale(0.55)} 50%{opacity:1; transform:scale(1)} }
  @keyframes zapCoach { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.15)} }
  @keyframes speedLines { 0%{opacity:0; transform:scale(1.3) rotate(0deg)} 12%{opacity:0.95} 65%{opacity:0.95} 100%{opacity:0; transform:scale(1) rotate(5deg)} }
  @keyframes speedSymbol { 0%{opacity:0; transform:scale(0.2) rotate(-20deg)} 25%{opacity:1; transform:scale(1.15) rotate(0deg)} 40%{transform:scale(1)} 80%{opacity:1; transform:scale(1)} 100%{opacity:0; transform:scale(1.4)} }
  @keyframes arcadeShakeA { 0%,100%{transform:translate(0,0)} 15%{transform:translate(-7px,3px)} 30%{transform:translate(6px,-4px)} 45%{transform:translate(-5px,-2px)} 60%{transform:translate(4px,3px)} 75%{transform:translate(-2px,1px)} }
  @keyframes arcadeShakeB { 0%,100%{transform:translate(0,0)} 15%{transform:translate(-7px,3px)} 30%{transform:translate(6px,-4px)} 45%{transform:translate(-5px,-2px)} 60%{transform:translate(4px,3px)} 75%{transform:translate(-2px,1px)} }
  @keyframes audienceInLong { 0%{transform:translateY(100%)} 10%{transform:translateY(0)} 88%{transform:translateY(0)} 100%{transform:translateY(100%)} }
  @keyframes tomatoThrow { 0%{opacity:1; transform:translate(0,0) scale(0.6) rotate(0)} 96%{opacity:1; transform:translate(-44px,-46vh) scale(2.2) rotate(300deg)} 100%{opacity:0; transform:translate(-44px,-46vh) scale(2.4) rotate(310deg)} }
  @keyframes tomatoSplat { 0%,33%{opacity:0; transform:scale(0.2)} 36%{opacity:1; transform:scale(1.12)} 42%{transform:scale(1)} 80%{opacity:1} 100%{opacity:0; transform:scale(1) translateY(14px)} }
  @keyframes tomatoDrip { 0%,40%{stroke-dasharray:0 200} 100%{stroke-dasharray:200 0} }
  @keyframes booShake { 0%{opacity:0; transform:translateX(-50%) scale(0.6)} 10%{opacity:1; transform:translateX(-50%) scale(1.1)} 14%,22%,30%{transform:translateX(-52%) scale(1)} 18%,26%{transform:translateX(-48%) scale(1)} 85%{opacity:1} 100%{opacity:0; transform:translateX(-50%)} }
  @keyframes audienceIn { 0%{transform:translateY(100%)} 14%{transform:translateY(0)} 84%{transform:translateY(0)} 100%{transform:translateY(100%)} }
  @keyframes audienceCheer { 0%,100%{transform:translateY(0)} 30%{transform:translateY(-12px)} 60%{transform:translateY(0)} 80%{transform:translateY(-6px)} }
  @keyframes audienceGroan { 0%{transform:translateY(0)} 40%,100%{transform:translateY(7px) rotate(-4deg)} }
  @keyframes popcornToss { 0%{opacity:0; transform:translate(0,0) rotate(0)} 10%{opacity:1} 100%{opacity:0; transform:translate(-60px,-260px) rotate(540deg)} }
  @keyframes usherDim { 0%,100%{opacity:0} 12%,85%{opacity:1} }
  @keyframes usherSweep { 0%{transform:translateX(-40vw)} 50%{transform:translateX(40vw)} 100%{transform:translateX(-10vw)} }
  @keyframes flashPop { 0%{opacity:0; transform:translate(-50%,-50%) scale(0.3)} 8%{opacity:1; transform:translate(-50%,-50%) scale(1)} 26%,100%{opacity:0; transform:translate(-50%,-50%) scale(1.2)} }
  @keyframes spoilerTear { 0%{transform:rotate(-6deg)} 25%{transform:rotate(-6deg) translateX(4px)} 100%{opacity:0; transform:translate(130%,-24px) rotate(18deg)} }
  @keyframes spoilerTearL { 0%{transform:rotate(5deg)} 25%{transform:rotate(5deg) translateX(-4px)} 100%{opacity:0; transform:translate(-130%,-18px) rotate(-16deg)} }
  @keyframes postCreditsIn { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
  @keyframes boomBurst { 0%{opacity:1; transform:translate(-50%,-50%) scale(0.25)} 60%{opacity:1} 100%{opacity:0; transform:translate(-50%,-50%) scale(1.5)} }
  @keyframes boomSpark { 0%{opacity:1; transform:translate(-50%,-50%)} 100%{opacity:0; transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3)} }
  @keyframes laserBeam { 0%{opacity:1; transform:scaleX(1.6)} 100%{opacity:0; transform:scaleX(0.4)} }
  @keyframes clapperIn { 0%{opacity:0; transform:translateX(-50%) translateY(10px) scale(0.9)} 12%{opacity:1; transform:translateX(-50%) translateY(0) scale(1)} 82%{opacity:1; transform:translateX(-50%) translateY(0) scale(1)} 100%{opacity:0; transform:translateX(-50%) translateY(-8px) scale(0.98)} }
  @keyframes clapSnap { 0%{transform:rotate(-30deg)} 55%{transform:rotate(0deg)} 70%{transform:rotate(-5deg)} 100%{transform:rotate(0deg)} }
  @keyframes popcornSpill { 0%{opacity:1; transform:translate(0,0) rotate(0) scale(0.6)} 55%{opacity:1; transform:translate(var(--dx),var(--dy)) rotate(var(--rot)) scale(1)} 100%{opacity:0; transform:translate(calc(var(--dx) * 1.5),calc(var(--dy) * -0.6)) rotate(var(--rot)) scale(0.9)} }
  @keyframes bossHit { 0%{transform:scale(1.18,0.86) rotate(-6deg)} 40%{transform:scale(0.92,1.1) rotate(5deg)} 100%{transform:scale(1) rotate(0)} }
  @keyframes bossSway { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
  @keyframes trexPeek { 0%{transform:translateX(-105%)} 55%{transform:translateX(-14%)} 70%{transform:translateX(-22%)} 85%{transform:translateX(-16%) rotate(-2deg)} 100%{transform:translateX(-18%)} }
  @keyframes trexRoar { 0%{transform:translateX(-30%) scale(0.92)} 18%{transform:translateX(0) scale(1.06) rotate(-3deg)} 30%{transform:translateX(-2%) scale(1.02) rotate(2deg)} 45%{transform:translateX(1%) rotate(-2deg)} 60%{transform:translateX(-1%) rotate(1deg)} 100%{transform:translateX(0) scale(1)} }
  @keyframes trexLeave { 0%{transform:translateX(0)} 100%{transform:translateX(-110%)} }
  @keyframes soundWave { 0%{opacity:0.95; transform:translate(-50%,-50%) scale(0.15)} 80%{opacity:0.5} 100%{opacity:0; transform:translate(-50%,-50%) scale(1)} }
  @keyframes bulbA { 0%,49%{background:#FFF6C2; box-shadow:0 0 8px 3px rgba(255,226,120,0.95)} 50%,100%{background:#B9862A; box-shadow:none} }
  @keyframes bulbB { 0%,49%{background:#B9862A; box-shadow:none} 50%,100%{background:#FFF6C2; box-shadow:0 0 8px 3px rgba(255,226,120,0.95)} }
  @keyframes cornDogIn { 0%{transform:translateY(60px) rotate(-30deg) scale(0.4); opacity:0} 55%{transform:translateY(-8px) rotate(10deg) scale(1.1); opacity:1} 75%{transform:translateY(2px) rotate(-4deg) scale(0.97)} 100%{transform:translateY(0) rotate(0) scale(1)} }
  @keyframes cornDogDance { 0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)} }
  @keyframes comingLine { 0%{opacity:0; transform:scale(1.25); letter-spacing:0.3em; filter:blur(4px)} 100%{opacity:1; transform:scale(1); letter-spacing:0.06em; filter:blur(0)} }
  @keyframes trailerOut { 0%,92%{opacity:1} 100%{opacity:0} }
  @keyframes smearFade { 0%{opacity:1; transform:scaleX(0.6)} 12%{opacity:1; transform:scaleX(1.05)} 65%{opacity:0.9; transform:scaleX(1)} 100%{opacity:0; transform:scaleX(0.9)} }
  @keyframes calloutPop { 0%{transform:scale(0.2) rotate(-6deg); opacity:0} 60%{transform:scale(1.15) rotate(2deg); opacity:1} 100%{transform:scale(1) rotate(0)} }
  @keyframes calloutLife { 0%,80%{opacity:1; transform:translateY(0)} 100%{opacity:0; transform:translateY(-18px)} }
  @keyframes butterGlint { 0%{opacity:0; transform:scale(0.2) rotate(0)} 40%{opacity:1; transform:scale(1.2) rotate(45deg)} 100%{opacity:0; transform:scale(0.4) rotate(90deg)} }
  @keyframes bannerIn { 0%{transform:translateX(-50%) translateY(-24px) scale(0.6); opacity:0} 60%{transform:translateX(-50%) translateY(3px) scale(1.04); opacity:1} 100%{transform:translateX(-50%) translateY(0) scale(1)} }
  @keyframes burnLife { 0%{transform:translate(-50%,-50%) scale(0) rotate(0)} 12%{transform:translate(-50%,-50%) scale(1) rotate(10deg)} 88%{transform:translate(-50%,-50%) scale(1.04) rotate(40deg)} 100%{transform:translate(-50%,-50%) scale(0) rotate(50deg)} }
  @keyframes burnFlicker { 0%,100%{opacity:1} 50%{opacity:0.82} }
  @keyframes chipDrop { 0%{transform:translate(var(--cx),-70px) rotate(var(--cr)); opacity:0} 60%{opacity:1; transform:translate(var(--cx),3px) rotate(var(--cr))} 100%{transform:translate(var(--cx),0) rotate(var(--cr))} }
  @keyframes chipWobble { 0%,100%{transform:rotate(-2.5deg)} 50%{transform:rotate(2.5deg)} }
  @keyframes chipFly { 0%{opacity:1; transform:translate(0,0) rotate(0)} 100%{opacity:0; transform:translate(var(--dx),var(--dy)) rotate(var(--rot))} }
  @keyframes reelStop { 0%{transform:translateY(0)} 100%{transform:translateY(var(--end))} }
  @keyframes jackpotIn { 0%{transform:translateX(-50%) scale(0.3); opacity:0} 60%{transform:translateX(-50%) scale(1.08); opacity:1} 100%{transform:translateX(-50%) scale(1)} }
  @keyframes jackpotWin { 0%,100%{box-shadow:0 0 0 3px #1C1D21, 0 0 18px 6px rgba(255,216,77,0.6)} 50%{box-shadow:0 0 0 3px #1C1D21, 0 0 34px 14px rgba(255,236,140,1)} }
  @keyframes janitorWalk { 0%{transform:translateX(0)} 100%{transform:translateX(calc(100vw + 170px))} }
  @keyframes janitorBob { 0%,100%{transform:translateY(0) rotate(-1.5deg)} 50%{transform:translateY(-4px) rotate(1.5deg)} }
  @keyframes butterShine { 0%,100%{filter:drop-shadow(0 2px 0 rgba(0,0,0,0.25)) brightness(1)} 50%{filter:drop-shadow(0 2px 0 rgba(0,0,0,0.25)) brightness(1.18)} }
  @keyframes twinPop { 0%{transform:scale(0.55,0.75); transform-origin:50% 100%} 100%{transform:scale(1); transform-origin:50% 100%} }
  @keyframes armReach { 0%{opacity:0; transform:scaleX(0.05) scaleY(0.6)} 20%{opacity:1} 100%{opacity:1; transform:none} }
  @keyframes armHide { to{opacity:0} }
  @keyframes armShow { from{opacity:0} to{opacity:1} }
  @keyframes armRetract { 0%{opacity:1; transform:none} 100%{opacity:0; transform:scaleX(0.05) scaleY(0.6)} }
  @keyframes rocketFlight { 0%{transform:translate(-50%,-50%) rotate(0deg) scale(0.9)} 25%{transform:translate(calc(-50% + var(--dx) * 0.08),calc(-50% + var(--dy) * 0.12)) rotate(var(--rot)) scale(1)} 100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(var(--rot)) scale(1)} }
  @keyframes exhaustPuff { 0%{opacity:0; transform:scale(0.4)} 20%{opacity:1} 100%{opacity:0; transform:scale(1.15) translateY(6px)} }
  @keyframes bigBoom { 0%{opacity:1; transform:translate(-50%,-50%) scale(0.15) rotate(-8deg)} 35%{opacity:1; transform:translate(-50%,-50%) scale(1.05) rotate(3deg)} 70%{opacity:1; transform:translate(-50%,-50%) scale(1) rotate(0)} 100%{opacity:0; transform:translate(-50%,-50%) scale(1.15)} }
  @keyframes lassoLine { 0%{opacity:1; stroke-dashoffset:1} 50%{opacity:1; stroke-dashoffset:0} 100%{opacity:0; stroke-dashoffset:0} }
  @keyframes kernelPop { 0%{opacity:1; transform:translate(0,0) scale(0.4)} 70%{opacity:1} 100%{opacity:0; transform:translate(var(--dx),var(--dy)) scale(1)} }
  @keyframes leaderSweep { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes curtainLeft { 0%{transform:translateX(0) scaleX(1) skewX(0deg)} 30%{transform:translateX(0) scaleX(0.72) skewX(7deg)} 62%{transform:translateX(0) scaleX(0.2) skewX(3deg)} 78%{transform:translateX(0) scaleX(0.17) skewX(-1.5deg)} 100%{transform:translateX(-102%) scaleX(0.17) skewX(0deg)} }
  @keyframes curtainRight { 0%{transform:translateX(0) scaleX(1) skewX(0deg)} 30%{transform:translateX(0) scaleX(0.72) skewX(-7deg)} 62%{transform:translateX(0) scaleX(0.2) skewX(-3deg)} 78%{transform:translateX(0) scaleX(0.17) skewX(1.5deg)} 100%{transform:translateX(102%) scaleX(0.17) skewX(0deg)} }
  @keyframes curtainSwag { 0%{transform:translateY(0) scaleY(1)} 35%{transform:translateY(-6%) scaleY(0.82)} 100%{transform:translateY(-130%) scaleY(0.45)} }
  @keyframes curtainValance { from{transform:translateY(0)} to{transform:translateY(-110%)} }
  @keyframes trailerLine { 0%{opacity:0; transform:scale(0.96)} 25%{opacity:1; transform:scale(1)} 80%{opacity:1} 100%{opacity:0; transform:scale(1.04)} }
  @keyframes filmBurn { 0%{opacity:0; transform:scale(0.2)} 30%{opacity:1} 100%{opacity:0; transform:scale(3.2)} }
  @keyframes badgeToast { 0%{opacity:0; transform:translateX(-50%) translateY(-12px)} 10%{opacity:1; transform:translateX(-50%) translateY(0)} 85%{opacity:1} 100%{opacity:0; transform:translateX(-50%) translateY(-6px)} }
  @keyframes irisSlide { 0%{transform:translateY(-130px)} 46%,54%{transform:translateY(0)} 100%{transform:translateY(-130px)} }
  @keyframes irisTurn { 0%{transform:rotate(0deg)} 46%,54%{transform:rotate(-70deg)} 100%{transform:rotate(0deg)} }
  @keyframes slamDrop { 0%{transform:translateY(-120vh)} 22%{transform:translateY(0)} 26%{transform:translateY(-6px)} 30%,78%{transform:translateY(0)} 100%{transform:translateY(-120vh)} }
  @keyframes slamArm { 0%,30%{transform:rotate(-24deg)} 42%,100%{transform:rotate(0deg)} }
  @keyframes leaderFade { 0%{opacity:0} 6%{opacity:1} 72%{opacity:1} 100%{opacity:0} }
  @keyframes leaderBlip { 0%{opacity:0.95} 100%{opacity:0} }
  @keyframes filmRoll { from{background-position:0 0} to{background-position:0 720px} }
  @keyframes filmRollH { from{background-position:0 0} to{background-position:-720px 0} }
  @keyframes filmSideInL { 0%{transform:translateX(-110%)} 18%{transform:translateX(0)} 82%{transform:translateX(0)} 100%{transform:translateX(-110%)} }
  @keyframes filmSideInR { 0%{transform:translateX(110%)} 18%{transform:translateX(0)} 82%{transform:translateX(0)} 100%{transform:translateX(110%)} }
  @keyframes filmFlyAcross { 0%{transform:translateX(-100%) rotate(-14deg);opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{transform:translateX(100%) rotate(-8deg);opacity:0} }
  @keyframes tileWinFlipOld { 0%{transform:perspective(300px) rotateY(0);color:#1C1D21} 49%{color:#1C1D21} 50%{transform:perspective(300px) rotateY(90deg);color:#15803D} 75%{transform:perspective(300px) rotateY(-12deg) scale(1.06)} 100%{transform:perspective(300px) rotateY(0) scale(1);color:#15803D} }
  @keyframes tileWinFlipNew { 0%{transform:perspective(300px) rotateY(0);color:transparent} 49%{color:transparent} 50%{transform:perspective(300px) rotateY(90deg);color:#15803D} 75%{transform:perspective(300px) rotateY(-12deg) scale(1.06)} 100%{transform:perspective(300px) rotateY(0) scale(1);color:#15803D} }
  @keyframes reelAdvance { from{background-position:center 0} to{background-position:center 168px} }
  @keyframes projectorFlicker { 0%,100%{opacity:0} 10%{opacity:0.55} 18%{opacity:0.1} 30%{opacity:0.45} 40%{opacity:0.05} 52%{opacity:0.5} 64%{opacity:0.15} 78%{opacity:0.35} 90%{opacity:0.08} }
  @keyframes filmScratch { 0%{opacity:0;background-position:0 0} 15%{opacity:1} 50%{background-position:-23px 0} 85%{opacity:1} 100%{opacity:0;background-position:31px 0} }
  @keyframes filmJitter { 0%,100%{transform:translate(0,0)} 25%{transform:translate(1px,-2px)} 50%{transform:translate(-1px,2px)} 75%{transform:translate(1px,1px)} }
  @keyframes badgeIn { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @keyframes ptsShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(calc(var(--amp) * -1))} 40%{transform:translateX(var(--amp))} 60%{transform:translateX(calc(var(--amp) * -0.6))} 80%{transform:translateX(calc(var(--amp) * 0.4))} }
  @keyframes tileFlip { 0%{transform:rotateX(90deg) scale(0.9)} 60%{transform:rotateX(-12deg) scale(1.06)} 100%{transform:rotateX(0) scale(1)} }
  @keyframes itemSpin { from{transform:rotate(var(--r0))} to{transform:rotate(var(--r1))} }
  @keyframes kernelArc { 0%{transform:translateY(0) scale(0.5);opacity:0} 10%{opacity:1} 50%{transform:translateY(-46vh) scale(1)} 90%{opacity:1} 100%{transform:translateY(-6vh) scale(0.9);opacity:0} }
  @keyframes creditsRoll { from{transform:translateY(118px)} to{transform:translateY(-100%)} }
`;

//
// FILM VAULT, STUBS, ARCADE, THEMED WEEKS, DAILY STREAK (owner request 2026-10-22)
//
// (Ticket stubs and the Film Vault were removed, owner decision 2026-10-25.)
function readJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || "null"); return v ?? fallback; } catch { return fallback; }
}
function writeJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
const LS_PRIZES = "plotmix_prizes";
const LS_DSTREAK = "plotmix_dstreak"; // not "plotmix_daily_…": that prefix is reserved for daily results

// Single-use power-ups won in the arcade (owner request 2026-10-25), used in Standard and
// Speed Run (not the Daily, so shared Daily results stay comparable):
//   Free Hint     reveals the next hint at no point cost
//   Popcorn Peek  fills in every third letter of the title
const LS_POWERUPS = "plotmix_powerups";
function loadPowerups() { const v = readJSON(LS_POWERUPS, null); return { hint: v?.hint || 0, peek: v?.peek || 0 }; }
function addPowerups(add) { const p = loadPowerups(); const next = { hint: p.hint + (add.hint || 0), peek: p.peek + (add.peek || 0) }; writeJSON(LS_POWERUPS, next); return next; }
function usePowerup(kind) { const p = loadPowerups(); if (!p[kind]) return false; writeJSON(LS_POWERUPS, { ...p, [kind]: p[kind] - 1 }); return true; }

// Arcade prizes: curtain colours for the Daily and end-screen curtains.
const CURTAINS = [
  { id: "red",     name: "Red Velvet",    colors: ["#8E0F1F", "#C21E32"], prize: null },
  { id: "blue",    name: "Midnight Blue", colors: ["#0E1A4F", "#2A3FA8"], prize: "bronze" },
  { id: "emerald", name: "Emerald Green",       colors: ["#0B4A33", "#16875C"], prize: "silver" },
  // The hardest to get (owner decision 2026-10-25): 3 Dailies in a row with no wrong guess at all.
  { id: "gold",    name: "Gold Lamé",     colors: ["#8A5A00", "#E0A82E"], prize: "perfectDaily3" },
];
const PRIZE_TIERS = [
  { id: "gold",   min: 150, name: "Gold Reel",   emoji: "🥇", powerups: { hint: 1, peek: 1 }, reward: "a Free Hint and a Popcorn Peek" },
  { id: "silver", min: 90,  name: "Silver Reel", emoji: "🥈", powerups: { peek: 1 },          reward: "a Popcorn Peek" },
  { id: "bronze", min: 40, name: "Bronze Reel", emoji: "🥉", powerups: { hint: 1 },          reward: "a Free Hint" },
];
function loadPrizes() {
  const v = readJSON(LS_PRIZES, null);
  return v && Array.isArray(v.won) ? v : { won: [], best: 0, curtain: "red" };
}
function prizeForScore(score) { return PRIZE_TIERS.find((p) => score >= p.min) || null; }
function curtainColors() {
  const p = loadPrizes();
  const c = CURTAINS.find((x) => x.id === p.curtain && (!x.prize || p.won.includes(x.prize)));
  return (c || CURTAINS[0]).colors;
}

// Holiday weeks (owner request 2026-10-26): major holidays get decorations around the edges and
// themed curtains for about a week around the day. Lunar and lunisolar dates follow the real
// Chinese, Hebrew and Islamic calendars (built into the browser), so they move with the years.
// Fright Week also draws the Daily from horror and thriller cards.
const CAL_FORMATS = {};
function calendarParts(date, cal, monthStyle = "numeric") {
  try {
    const key = `${cal}-${monthStyle}`;
    CAL_FORMATS[key] = CAL_FORMATS[key] || new Intl.DateTimeFormat(`en-u-ca-${cal}`, { month: monthStyle, day: "numeric", timeZone: "UTC" });
    const parts = CAL_FORMATS[key].formatToParts(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12)));
    return { month: parts.find((x) => x.type === "month")?.value, day: Number(parts.find((x) => x.type === "day")?.value) };
  } catch { return { month: null, day: null }; }
}
// Western Easter Sunday (anonymous Gregorian algorithm).
function easterSunday(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, month - 1, day);
}
const isDay = (d, month, day) => d.getMonth() === month && d.getDate() === day;
// Each holiday: its main day, and how many days before/after it the theme runs.
const HOLIDAYS = [
  { id: "newyear", name: "New Year", emoji: "🎆", decor: "newyear", before: 3, after: 3,
    isMain: (d) => isDay(d, 0, 1), curtains: ["#0E1A4F", "#C9A227"],
    lines: ["Out with the old films… in with the mashup.", "New year. New mashups. Same popcorn."] },
  { id: "lunar", name: "Lunar New Year", emoji: "🏮", decor: "lanterns", before: 2, after: 5,
    isMain: (d) => { const p = calendarParts(d, "chinese"); return p.month === "1" && p.day === 1; }, curtains: ["#7A0A10", "#D9A21B"],
    lines: ["A new year… a new mashup. Fortune favours the film buff.", "Lanterns lit. Popcorn ready. Name both films."] },
  { id: "easter", name: "Easter", emoji: "🐣", decor: "eggs", before: 3, after: 3,
    isMain: (d) => { const e = easterSunday(d.getFullYear()); return isDay(d, e.getMonth(), e.getDate()); }, curtains: ["#6B4FA0", "#E9A3C0"],
    lines: ["This spring… the mashups hatch.", "Hidden somewhere in this plot… two films."] },
  { id: "eid", name: "Eid al-Fitr", emoji: "🌙", decor: "crescents", before: 2, after: 4,
    isMain: (d) => { const p = calendarParts(d, "islamic-umalqura"); return p.month === "10" && p.day === 1; }, curtains: ["#0B3D2E", "#C9A227"],
    lines: ["Eid Mubarak! Tonight's double feature…", "Lanterns up. Lights down. Name both films."] },
  { id: "fright", name: "Fright Week", emoji: "🎃", decor: "pumpkins", before: 7, after: 0,
    isMain: (d) => isDay(d, 9, 31), genres: /horror|thriller/i, curtains: ["#2B0A3D", "#E8650A"],
    lines: ["In a town… where nobody sleeps tonight…", "This week… the mashups bite back…", "Lock the doors. Dim the lights. Name both films."] },
  { id: "hanukkah", name: "Hanukkah", emoji: "🕎", decor: "dreidels", before: 1, after: 7,
    isMain: (d) => { const p = calendarParts(d, "hebrew", "long"); return p.month === "Kislev" && p.day === 25; }, curtains: ["#0E3A8A", "#C9D6F2"],
    lines: ["Eight nights. Two films. One mashup.", "Spin the dreidel… name both films."] },
  { id: "christmas", name: "Christmas", emoji: "🎄", decor: "lights", before: 5, after: 1,
    isMain: (d) => isDay(d, 11, 25), curtains: ["#0B4A33", "#B3192C"],
    lines: ["This holiday season… two films, one stocking.", "Deck the halls. Dim the lights. Name both films."] },
];
// The holiday whose week covers this date (the nearest main day wins if two overlap), or null.
function activeHoliday(date = new Date()) {
  let best = null;
  for (const h of HOLIDAYS) {
    for (let o = -h.after; o <= h.before; o++) {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + o);
      if (h.isMain(d) && (!best || Math.abs(o) < best.dist)) best = { holiday: h, dist: Math.abs(o) };
    }
  }
  return best ? best.holiday : null;
}
function themedDailyCard(sourceDeck, date) {
  const week = activeHoliday(date);
  if (!week || !week.genres) return null;
  const pool = sourceDeck
    .filter((c) => (c.hintData?.films || []).some((f) => week.genres.test(f.genre || "")))
    .sort((a, b) => a.id - b.id);
  if (!pool.length) return null;
  // Consecutive days take consecutive cards, so the same card never runs two days in a row.
  return pool[localDayNumber(date) % pool.length];
}

// Daily streak: days in a row with the Daily played. One missed day a week is forgiven.
function weekNumber(dayNum) { return Math.floor((dayNum + 3) / 7); }
function loadDailyStreak() { const v = readJSON(LS_DSTREAK, null); return v && typeof v.count === "number" ? v : { count: 0, best: 0, lastDay: null, saverWeek: null }; }
// Perfect Dailies in a row (solved with no wrong guess); 3 unlock the Gold Lamé curtains.
const LS_PERFECT_DAILY = "plotmix_perfect_daily";
const PERFECT_DAILY_FOR_GOLD = 3;
function loadPerfectDaily() { const v = readJSON(LS_PERFECT_DAILY, null); return v && typeof v.count === "number" ? v : { count: 0, lastDay: null }; }
function recordPerfectDaily(perfect, date = new Date()) {
  const today = localDayNumber(date);
  const st = loadPerfectDaily();
  if (st.lastDay === today) return st;
  const count = !perfect ? 0 : st.lastDay === today - 1 ? st.count + 1 : 1;
  const next = { count, lastDay: today };
  writeJSON(LS_PERFECT_DAILY, next);
  if (count >= PERFECT_DAILY_FOR_GOLD) unlockGoldCurtains(date);
  return next;
}
// Gold Lamé curtains: won by 3 perfect Dailies in a row, or by one perfect Standard or Speed
// Run (every card solved, no hints or power-ups, no wrong guesses; owner decision 2026-10-26).
// Returns true the first time they are won.
function unlockGoldCurtains(date = new Date()) {
  const p = loadPrizes();
  if (p.won.includes("perfectDaily3")) return false;
  writeJSON(LS_PRIZES, { ...p, won: [...p.won, "perfectDaily3"], curtain: "gold", goldJustWon: localDayNumber(date) });
  return true;
}
function isPerfectRun(mode, results) {
  return !mode.isDaily && results.length === mode.roundCount &&
    results.every((r) => r && r.solved && !r.skipped && (r.wrong || 0) === 0 && (r.hints || 0) === 0 && !r.peek);
}

function recordDailyPlayed(date = new Date()) {
  const today = localDayNumber(date);
  const st = loadDailyStreak();
  if (st.lastDay === today) return { ...st, saverUsedToday: false };
  let count = 1, saverWeek = st.saverWeek, saverUsedToday = false;
  if (st.lastDay === today - 1) count = st.count + 1;
  else if (st.lastDay === today - 2 && st.saverWeek !== weekNumber(today)) {
    count = st.count + 1; saverWeek = weekNumber(today); saverUsedToday = true;
  }
  const next = { count, best: Math.max(st.best || 0, count), lastDay: today, saverWeek, saverDay: saverUsedToday ? today : (st.saverDay ?? null) };
  writeJSON(LS_DSTREAK, next);
  return { ...next, saverUsedToday };
}

// The "Director's Whisper" hint shows the card's first written clue with title words and actors blanked.
function maskTitleWords(text, card) {
  const keep = new Set(["the","a","an","and","of","in","on","at","to","for","with","is","it","or","from","by"]);
  // Title words and lead actors' names are blanked: the actors are the 3-point hint.
  const actors = (card.hintData?.films || []).flatMap((f) => f.actors || []);
  const words = new Set([...card.movies, ...actors].flatMap((m) => normWord(m).split(" ")).filter((w) => w && w.length > 1 && !keep.has(w)));
  return text.replace(/[A-Za-z0-9'’]+/g, (w) => (words.has(normWord(w)) ? "▢".repeat(Math.min(w.length, 6)) : w));
}

// A popcorn box overflowing with popcorn (menu button for Popcorn Panic).
function PopcornBucketIcon({size=34}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      {[[11,13],[18,9],[26,11],[31,15],[15,16],[23,15],[8,17]].map(([x,y],i)=>(
        <g key={i}><circle cx={x} cy={y} r="5.2" fill="#FFF8E6" stroke="#1C1D21" strokeWidth="1.2"/><circle cx={x+1.3} cy={y-1} r="1.6" fill="#FFD84D"/></g>
      ))}
      <path d="M5 18 H35 L31 38 H9 Z" fill="#F7F4EE" stroke="#1C1D21" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M11 18 L13 38 M20 18 V38 M29 18 L27 38" stroke="#D8262F" strokeWidth="4"/>
      <path d="M5 18 H35 L31 38 H9 Z" fill="none" stroke="#1C1D21" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}

// Curtain colours won in Popcorn Panic; shown in the arcade only once one has been won
// (the Film Vault was removed, owner decision 2026-10-25).
// A little stage curtain in the given colours (for the curtain picker).
function CurtainSwatch({colors}) {
  const [c0, c1] = colors;
  const id = `cs-${c0.slice(1)}-${c1.slice(1)}`;
  return (
    <svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0" spreadMethod="repeat" gradientTransform="scale(0.14 1)">
          <stop offset="0" stopColor={c0}/><stop offset="0.5" stopColor={c1}/><stop offset="1" stopColor={c0}/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="48" rx="4" fill="#120C26"/>
      <path d="M2 6 H30 C30 20 22 30 14 34 C10 36 8 42 10 47 H2 Z" fill={`url(#${id})`} stroke="#1C1D21" strokeWidth="1"/>
      <path d="M62 6 H34 C34 20 42 30 50 34 C54 36 56 42 54 47 H62 Z" fill={`url(#${id})`} stroke="#1C1D21" strokeWidth="1"/>
      <path d="M12 33 q4 2 8 0 M44 33 q4 2 8 0" stroke="#F6A507" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <rect x="0" y="0" width="64" height="8" rx="2" fill={c0} stroke="#1C1D21" strokeWidth="1"/>
      <path d="M0 8 Q4 12 8 8 Q12 12 16 8 Q20 12 24 8 Q28 12 32 8 Q36 12 40 8 Q44 12 48 8 Q52 12 56 8 Q60 12 64 8" fill={c1} stroke="#1C1D21" strokeWidth="0.8"/>
    </svg>
  );
}

function CurtainPicker() {
  const [prizes, setPrizes] = useState(loadPrizes);
  if (!prizes.won.length) return null;
  const pick = (id) => { const next = { ...prizes, curtain: id }; writeJSON(LS_PRIZES, next); setPrizes(next); };
  return (
    <div style={{marginTop:18}}>
      <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,margin:"0 0 8px"}}>Your curtains</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
        {CURTAINS.filter((c) => !c.prize || prizes.won.includes(c.prize)).map((c) => (
          <button key={c.id} onClick={() => pick(c.id)} aria-pressed={prizes.curtain === c.id} aria-label={`Curtains: ${c.name}`}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"6px 8px",borderRadius:10,cursor:"pointer",
              background:prizes.curtain === c.id ? "#FFD84D" : "rgba(255,255,255,0.12)",border:"2px solid #1C1D21"}}>
            <CurtainSwatch colors={c.colors}/>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:prizes.curtain === c.id ? "#1C1D21" : "#fff"}}>{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Arcade side-quest: "Popcorn Panic" (owner design 2026-10-25).
// Catch good pieces in the box; bad ones cost a life (3 lives). A play lasts 45 seconds at most,
// and every 5 seconds it gets faster with more bad pieces. Good catches without a bad one in
// between build a combo (x2 at 5, x3 at 10); 15 regular catches in a row start a Popcorn Frenzy.
// Chocolate candies give a boost: an extra life, a 5-second shield, or 5 seconds of double points.
// A play is earned by solving 5 mashups in a row (no paying to replay).
const ARCADE_LIVES = 3;
const ARCADE_LEVEL_MS = 5000;
const ARCADE_GAME_MS = 45000;                            // each play lasts 45 seconds at most
const ARCADE_BASE_SPAWN = 480, ARCADE_MIN_SPAWN = 170;   // ms between pieces
const ARCADE_BASE_FALL = 2600, ARCADE_MIN_FALL = 1050;   // ms for a piece to fall the whole way
const BUCKET_W = 96, BUCKET_H = 118, ARCADE_ITEM = 46; // BUCKET_H: the bucket art is taller than wide
// A Popcorn Frenzy can no longer feed itself (owner report 2026-10-25: it chained forever):
// the next one needs another 15 regular catches in a row; frenzy popcorn doesn't count.
const FRENZY_AT = 15, FRENZY_MS = 2500, FRENZY_SPAWN_MS = 150;
// Laser: tap to fire straight up from the box. 3 charges; one comes back every 3 seconds.
const LASER_MAX = 3, LASER_RECHARGE_MS = 3000, LASER_HALF_W = 26;
const SLOWMO_MS = 4000;
// Rocket (owner idea 2026-11-05): catch one to load it; the next tap launches it instead of the
// laser. It blows up the first piece in its path and everything within ROCKET_RADIUS of it.
const ROCKET_MAX = 3, ROCKET_RADIUS = 95;
// Rocket launch, drawn by the owner (public/stickers/rocket/): a hatch opens on the bucket, a
// robot arm swings out holding the rocket, lets go, and the rocket homes in on the lowest bad
// piece. Sizes are the owner's art scaled so its bucket matches ours (775 px wide there).
const RK = (BUCKET_W + 6) / 775;
const ROCKET_ART = {
  hatchDx: (598 - 427.5) * RK, armBottom: (966 - 760) * RK,
  holdW: 891 * RK, holdH: 617 * RK, emptyW: 758 * RK, emptyH: 430 * RK,
  handDx: (1365 - 427.5) * RK, handUp: (966 - 392) * RK,
  rocketW: 200 * RK, rocketH: 345 * RK, exhaustW: 636 * RK, exhaustH: 724 * RK, exhaustFlameX: 475 * RK,
};
const ROCKET_REACH_MS = 220, ROCKET_FLIGHT_MS = 300, ROCKET_RETRACT_MS = 260;
const VIP_MS = 5000, FREEZE_MS = 3000, GUMMY_MS = 5000, LICORICE_PULLS = 3;
const ARCADE_STREAK_FOR_PASS = 5;
function comboMultiplier(c) { return c >= 10 ? 3 : c >= 5 ? 2 : 1; }
const LS_ARCADE_PASSES = "plotmix_arcade_passes";
function arcadePasses() { const n = Number(readJSON(LS_ARCADE_PASSES, 0)); return Number.isFinite(n) && n > 0 ? n : 0; }
function addArcadePass() { writeJSON(LS_ARCADE_PASSES, arcadePasses() + 1); }
// Developer shortcut (owner request 2026-10-25): adding ?popcorn to a preview or local link
// opens Popcorn Panic with 3 plays. Never on the live site (plotmix-app.vercel.app).
function isTestBuildHost(host) { return host === "localhost" || host === "127.0.0.1" || host.includes("-git-"); }
function openPopcornForTesting() {
  if (typeof window === "undefined" || !isTestBuildHost(window.location.hostname)) return false;
  if (!new URLSearchParams(window.location.search).has("popcorn")) return false;
  if (arcadePasses() < 3) writeJSON(LS_ARCADE_PASSES, 3);
  return true;
}
function useArcadePass() { const n = arcadePasses(); if (n < 1) return false; writeJSON(LS_ARCADE_PASSES, n - 1); return true; }
const BOOST_MS = 5000;
// Good pieces score (points × combo), bad ones cost a life if caught, and the rest are boosts.
// Cinema extras are generic objects (no film's characters, logos or designs).
const ARCADE_ITEMS = [
  // Concession-stand specials (owner art 2026-11-06).
  { kind: "butter",   weight: 1.4, label: "Butter drop",      good: 2 },
  { kind: "nacho",    weight: 1.4, label: "Nacho cheese",     good: 2 },
  { kind: "canister", weight: 0.8, label: "Golden film canister", good: 3 },
  { kind: "popcorn",  weight: 38.9, label: "Popcorn",       good: 1 },
  { kind: "ticket",   weight: 4,  label: "Golden ticket",    good: 5 },
  { kind: "reel",     weight: 6,  label: "Film reel",       good: 3 },
  { kind: "burnt",    weight: 18, label: "Burnt popcorn",   bad: true },
  { kind: "unpopped", weight: 14, label: "Unpopped kernel", bad: true },
  { kind: "phone",    weight: 5,  label: "Ringing phone",   bad: true },
  { kind: "bat",      weight: 3,  label: "Vampire bat",     bad: true },
  { kind: "candy",    weight: 3,  label: "Chocolate candy" },
  { kind: "glasses",  weight: 1.5, label: "3D glasses" },
  { kind: "clapper",  weight: 1.5, label: "Clapperboard" },
  { kind: "rocket",   weight: 1.5, label: "Rocket" },
  // Concession-stand power-ups (owner picks 2026-11-05).
  { kind: "slushie",  weight: 1.5, label: "Blue raspberry slushie" },
  { kind: "gummy",    weight: 1.5, label: "Sour gummy worm" },
  { kind: "licorice", weight: 1.5, label: "Licorice whip" },
  { kind: "jaw",      weight: 1.5, label: "Jawbreaker" },
];
// Pieces that only arrive through events, never from the random spawn table.
const ARCADE_SPECIALS = [
  { kind: "corndog", label: "Corn dog", good: 2 },
  { kind: "boss",    label: "Kernel boss", bad: true },
];
const ARCADE_KIND = Object.fromEntries([...ARCADE_ITEMS, ...ARCADE_SPECIALS].map((it) => [it.kind, it]));
const ARCADE_ART = "/stickers/arcade/";
const ARCADE_ART_FILES = ["butter-drop", "popcorn-butter", "nacho-cup", "nacho-chip", "film-canister", "corn-dog",
  "kernel-boss-0", "kernel-boss-1", "kernel-boss-2", "trex-peek", "trex-roar", "trex-janitor"];
// Owner picks 2026-11-06 (art by the owner):
const BUTTER_CATCHES = 10;              // butter: the next 10 catches score double, on a slippery bucket
const NACHO_MS = 8000, NACHO_MAX = 8, NACHO_PTS = 3; // nacho tower: chips stack, cash in at the end
const BOSS_AT_MS = 30000, BOSS_HP = 3, BOSS_SIZE = 116, BOSS_FALL_MS = 10000;
const TREX_PEEK_MS = 1100, TREX_ROAR_MS = 1300;
// The trailer is a banner over the top of the arena that stays up for the whole corn dog rain
// (owner feedback 2026-11-07: pausing the game was annoying, and the card went by too fast to read).
const TRAILER_RAIN_MS = 3500, TRAILER_SPAWN_MS = 230;
const BURN_MS = 4200, BURN_R = 74;
const CALLOUT_MS = 1700; // how long a power-up's big name stays on screen
// Each play gets the T-rex, a trailer and a film burn, in a random order, then the boss.
const ARCADE_EVENT_SLOTS = [9000, 17000, 24000];
const TRAILER_LINES = [
  ["In a world…", "…where it rains corn dogs"],
  ["This summer…", "…one snack will rise"],
  ["From the makers of nachos…", "…comes a hero on a stick"],
  ["They came from the concession stand…", "…and they are delicious"],
];
// Box office jackpot reels: three of a kind wins big.
const JACKPOT_SYMBOLS = ["popcorn", "ticket", "reel", "rocket"];
const CANDY_COLORS = ["#20B46A"]; // green (owner request 2026-11-05)

// Higher levels bring more bad pieces (capped at level 7).
function pickArcadeItem(level = 1) {
  const extra = Math.min(12, (level - 1) * 2);
  const weights = ARCADE_ITEMS.map((it) => it.kind === "popcorn" ? it.weight - 2 * extra : it.bad ? it.weight + extra : it.weight);
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < ARCADE_ITEMS.length; i++) { if ((r -= weights[i]) < 0) return ARCADE_ITEMS[i]; }
  return ARCADE_KIND.popcorn;
}

// Drawn in code, modelled on photos of real popcorn (owner request 2026-10-25): puffy cream
// lobes shaded like soft spheres, golden hull showing in the gaps, and a few lobes curled
// open around a yellow hollow. 4 popped shapes; burnt pieces reuse 3 of them, toasted on one
// side. Every piece also gets its own random angle and spin, so no two look alike.
// Lobes are [cx, cy, rx, ry, angle, curl] in a 48×48 box; curl lobes show the yellow hollow.
const POPCORN_SHAPES = [
  [[16,19,10,9,-20,1],[30,15,10,8.5,15,0],[35,28,8.5,9,0,1],[16,32,9,8,20,0],[25,26,10,9.5,0,0]],
  [[24,12,9,8,0,1],[13,23,8.5,9.5,-10,0],[35,23,8.5,9.5,10,1],[23,35,10,8.5,0,0],[24,24,8,8,0,0]],
  [[14,17,8,7.5,-30,0],[26,12,9,8,0,1],[37,21,8,8.5,20,0],[30,33,10,9,10,1],[17,31,9.5,9,-15,0]],
  [[20,15,11,9,-10,1],[34,22,9,8.5,25,0],[29,35,8.5,8,0,1],[13,30,8,8.5,-20,0],[22,26,9,8.5,0,0]],
];
const BURNT_SHAPES = [POPCORN_SHAPES[0], POPCORN_SHAPES[2], POPCORN_SHAPES[3]];
const POPCORN_DEFS = (
  <>
    <radialGradient id="pc-lobe" cx="0.38" cy="0.32" r="0.75">
      <stop offset="0" stopColor="#FFFFFB"/><stop offset="0.5" stopColor="#FCF3DC"/>
      <stop offset="0.82" stopColor="#F0DCA8"/><stop offset="1" stopColor="#DDBE7A"/>
    </radialGradient>
    <radialGradient id="pc-hull" cx="0.45" cy="0.4" r="0.7">
      <stop offset="0" stopColor="#FFD965"/><stop offset="0.6" stopColor="#F2A92C"/><stop offset="1" stopColor="#C2741A"/>
    </radialGradient>
    <radialGradient id="pc-kernel" cx="0.4" cy="0.28" r="0.85">
      <stop offset="0" stopColor="#FFD24A"/><stop offset="0.45" stopColor="#F5A91E"/><stop offset="1" stopColor="#D97C0E"/>
    </radialGradient>
    <linearGradient id="pc-tip" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FBE3A0" stopOpacity="0"/><stop offset="0.55" stopColor="#F6E7C4" stopOpacity="0.9"/><stop offset="1" stopColor="#EFE3CB"/>
    </linearGradient>
    <radialGradient id="pc-kernel-burnt" cx="0.4" cy="0.28" r="0.85">
      <stop offset="0" stopColor="#8A4E1C"/><stop offset="0.5" stopColor="#4E2A10"/><stop offset="1" stopColor="#24130A"/>
    </radialGradient>
  </>
);
// A lumpy, cauliflower-like outline instead of a plain ellipse.
function blobPath(cx, cy, rx, ry, seed) {
  const n = 16, pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const k = 1 + 0.07 * Math.sin(seed + 3 * t) + 0.05 * Math.sin(seed * 2 + 7 * t);
    pts.push([cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k]);
  }
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = `M${mid(pts[n - 1], pts[0]).map((v) => v.toFixed(1)).join(" ")}`;
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  return d + " Z";
}
function PopcornLobe({l, i, burntId}) {
  const [cx, cy, rx, ry, rot, curl] = l;
  const r = Math.min(rx, ry);
  const outline = blobPath(cx, cy, rx, ry, i * 1.7 + cx * 0.1);
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <path d={outline} fill="url(#pc-lobe)" stroke="#BE9A55" strokeWidth="0.7"/>
      {curl ? (
        // A petal curled open: a golden hollow under a cream lip.
        <>
          <ellipse cx={cx} cy={cy + r * 0.22} rx={r * 0.62} ry={r * 0.45} fill="url(#pc-hull)"/>
          <path d={blobPath(cx, cy - r * 0.12, r * 0.7, r * 0.45, i + 2)} fill="url(#pc-lobe)"/>
          <path d={`M${cx - r * 0.55} ${cy + r * 0.12} Q${cx} ${cy + r * 0.42} ${cx + r * 0.55} ${cy + r * 0.12}`} fill="none" stroke="#D9B66E" strokeWidth="0.6"/>
        </>
      ) : (
        <path d={`M${cx - r * 0.45} ${cy + r * 0.35} Q${cx} ${cy + r * 0.6} ${cx + r * 0.4} ${cy + r * 0.3}`} fill="none" stroke="#E2C88E" strokeWidth="0.6"/>
      )}
      {burntId && <path d={outline} fill={`url(#${burntId})`}/>}
    </g>
  );
}
const ARCADE_IMG_KINDS = { butter: "butter-drop", nacho: "nacho-cup", canister: "film-canister", corndog: "corn-dog" };
function ArcadeItemArt({kind, color, variant=0}) {
  if (ARCADE_IMG_KINDS[kind] || kind === "boss") {
    const file = kind === "boss" ? `kernel-boss-${Math.min(2, variant)}` : ARCADE_IMG_KINDS[kind];
    return <img src={`${ARCADE_ART}${file}.webp`} alt="" aria-hidden="true" draggable="false" style={{width:"100%",height:"100%",objectFit:"contain",display:"block",userSelect:"none"}}/>;
  }
  if (kind === "popcorn" || kind === "burnt") {
    const burnt = kind === "burnt";
    const shapes = burnt ? BURNT_SHAPES : POPCORN_SHAPES;
    const lobes = shapes[variant % shapes.length];
    // Semi-burnt: still popcorn, but toasted brown from one side, with a few charred specks.
    const scorch = [[0.2, 0.25], [0.8, 0.7], [0.35, 0.85]][variant % 3];
    const burntId = burnt ? `pc-scorch-${variant % 3}` : null;
    const hull = lobes.slice(0, 4).map(([x, y]) => [(x + 24) / 2, (y + 24) / 2]);
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <defs>
          {POPCORN_DEFS}
          {burnt && (
            <radialGradient id={burntId} gradientUnits="userSpaceOnUse" cx={48 * scorch[0]} cy={48 * scorch[1]} r="44">
              <stop offset="0" stopColor="#24110A" stopOpacity="0.95"/><stop offset="0.3" stopColor="#5E3214" stopOpacity="0.9"/>
              <stop offset="0.6" stopColor="#9A6028" stopOpacity="0.75"/><stop offset="1" stopColor="#C08A4C" stopOpacity="0.55"/>
            </radialGradient>
          )}
        </defs>
        {hull.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="6" ry="5" fill="url(#pc-hull)" stroke="#A8661A" strokeWidth="0.6"/>)}
        {lobes.map((l, i) => <PopcornLobe key={i} i={i} l={l} burntId={burntId}/>)}
        {burnt && (
          <g fill="#2A1406" opacity="0.85">
            <ellipse cx={8 + scorch[0] * 32} cy={8 + scorch[1] * 30} rx="1.8" ry="1.1"/>
            <ellipse cx={12 + scorch[0] * 26} cy={5 + scorch[1] * 28} rx="1" ry="0.7"/>
          </g>
        )}
      </svg>
    );
  }
  if (kind === "unpopped") {
    // A real kernel: glossy rounded crown, narrowing to a pale, slightly see-through tip.
    // Every third kernel is a burnt one (owner request 2026-10-25).
    const burnt = variant % 3 === 2;
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <defs>{POPCORN_DEFS}</defs>
        <path d="M24 5 C36 5 40 14 38 23 C36 31 30 37 27 41.5 C25.8 43.3 22.2 43.3 21 41.5 C18 37 12 31 10 23 C8 14 12 5 24 5 Z"
          fill={burnt ? "url(#pc-kernel-burnt)" : "url(#pc-kernel)"} stroke={burnt ? "#140A04" : "#9A5A0A"} strokeWidth="1"/>
        {!burnt && <path d="M24 21 C27.5 23 28 29 27 33 C26 36 22 36 21 33 C20 29 20.5 23 24 21 Z" fill="#FFE3A0" opacity="0.45"/>}
        {!burnt && <path d="M16.5 32 C19 37 21 41 22 42 C23 43.4 25 43.4 26 42 C27 41 29 37 31.5 32 C28 35 20 35 16.5 32 Z" fill="url(#pc-tip)"/>}
        {burnt && <path d="M14 14 C18 10 22 12 20 17 C18 21 13 19 14 14 Z" fill="#0E0703" opacity="0.8"/>}
        {burnt && <circle cx="30" cy="26" r="2.2" fill="#0E0703" opacity="0.75"/>}
        <ellipse cx="17.5" cy="12.5" rx="4.5" ry="2.6" transform="rotate(-30 17.5 12.5)" fill="#FFFFFF" opacity={burnt ? 0.22 : 0.55}/>
      </svg>
    );
  }
  if (kind === "ticket") {
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <defs><linearGradient id="golden-ticket" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE58A"/><stop offset="0.45" stopColor="#F4B92A"/><stop offset="1" stopColor="#C8860D"/>
        </linearGradient></defs>
        <path d="M4 14 H44 V20 A4 4 0 0 0 44 28 V34 H4 V28 A4 4 0 0 0 4 20 Z" fill="url(#golden-ticket)" stroke="#1C1D21" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M33 15 V33" stroke="#8A5A00" strokeWidth="1.2" strokeDasharray="2 2"/>
        <rect x="8" y="18" width="21" height="12" rx="1.5" fill="#FFF3D6"/>
        <text x="18.5" y="23.3" textAnchor="middle" fontSize="4.6" fontWeight="800" fill="#8E0F1F" fontFamily="Arial, sans-serif">ADMIT</text>
        <text x="18.5" y="28.3" textAnchor="middle" fontSize="4.6" fontWeight="800" fill="#8E0F1F" fontFamily="Arial, sans-serif">ONE</text>
        <path d="M38.5 21 l1.2 2.4 2.6 .4 -1.9 1.8 .5 2.6 -2.4 -1.2 -2.4 1.2 .5 -2.6 -1.9 -1.8 2.6 -.4 Z" fill="#FFFFFF" stroke="#8A5A00" strokeWidth="0.6"/>
      </svg>
    );
  }
  if (kind === "reel") {
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="#3A3D46" stroke="#1C1D21" strokeWidth="1.8"/>
        <circle cx="24" cy="24" r="16.5" fill="none" stroke="#5B606C" strokeWidth="1.2"/>
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={24 + 10 * Math.cos((a - 90) * Math.PI / 180)} cy={24 + 10 * Math.sin((a - 90) * Math.PI / 180)} r="4.6" fill="#1C1D21"/>
        ))}
        <circle cx="24" cy="24" r="3.4" fill="#C9CCD3" stroke="#1C1D21" strokeWidth="1"/>
        <path d="M40 30 Q46 38 44 46" stroke="#1C1D21" strokeWidth="4" fill="none"/>
        <ellipse cx="17" cy="11" rx="5" ry="2" transform="rotate(-25 17 11)" fill="#fff" opacity="0.3"/>
      </svg>
    );
  }
  if (kind === "phone") {
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <path d="M5 14 Q2 24 5 34 M10 17 Q8 24 10 31 M43 14 Q46 24 43 34 M38 17 Q40 24 38 31" stroke="#FF5A5A" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <rect x="14" y="5" width="20" height="38" rx="4" fill="#1C1D21"/>
        <rect x="16" y="9" width="16" height="28" rx="1.5" fill="#7FD6FF"/>
        <rect x="16" y="9" width="16" height="28" rx="1.5" fill="url(#pc-hull)" opacity="0.25"/>
        <circle cx="24" cy="19" r="4" fill="#fff"/>
        <rect x="18.5" y="27" width="11" height="3" rx="1.5" fill="#20B46A"/>
        <rect x="18.5" y="31.5" width="11" height="3" rx="1.5" fill="#E4444F"/>
        <circle cx="24" cy="40" r="1.3" fill="#5B606C"/>
        <defs>{POPCORN_DEFS}</defs>
      </svg>
    );
  }
  if (kind === "bat") {
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <path d="M24 18 C21 18 20 21 20 23 C16 18 10 16 3 18 C7 20 8 23 7 27 C10 25 13 26 14 29 C16 26 19 27 21 29 L24 33 L27 29 C29 27 32 26 34 29 C35 26 38 25 41 27 C40 23 41 20 45 18 C38 16 32 18 28 23 C28 21 27 18 24 18 Z"
          fill="#2B1840" stroke="#0E0716" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M21.5 18.5 L21 15 L23 17.5 M26.5 18.5 L27 15 L25 17.5" fill="#2B1840" stroke="#0E0716" strokeWidth="1"/>
        <circle cx="22.4" cy="22" r="1.2" fill="#FF4D4D"/><circle cx="25.6" cy="22" r="1.2" fill="#FF4D4D"/>
        <path d="M23 25.5 l.6 1.4 .6 -1.4 M24.4 25.5 l.6 1.4 .6 -1.4" stroke="#fff" strokeWidth="0.6" fill="#fff"/>
      </svg>
    );
  }
  if (kind === "glasses") {
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <path d="M3 18 H45 V30 Q45 34 41 34 H30 Q27 34 26 30 L24 27 L22 30 Q21 34 18 34 H7 Q3 34 3 30 Z" fill="#F7F4EE" stroke="#1C1D21" strokeWidth="1.6" strokeLinejoin="round"/>
        <rect x="7" y="21" width="14" height="10" rx="2.5" fill="#E4444F" opacity="0.9"/>
        <rect x="27" y="21" width="14" height="10" rx="2.5" fill="#2EC4E6" opacity="0.9"/>
        <path d="M9 23 l4 0 M29 23 l4 0" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.7"/>
      </svg>
    );
  }
  if (kind === "clapper") {
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <rect x="6" y="19" width="36" height="23" rx="2" fill="#1C1D21"/>
        <path d="M10 26 H38 M10 32 H38 M10 38 H30" stroke="#F7F4EE" strokeWidth="1.2"/>
        <g transform="rotate(-14 6 17)">
          <rect x="6" y="11" width="36" height="7" rx="1" fill="#F7F4EE" stroke="#1C1D21" strokeWidth="1.4"/>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${9 + i * 9} 11 l5 0 -4 7 -5 0 Z`} fill="#1C1D21"/>)}
        </g>
        <rect x="6" y="18" width="36" height="5" fill="#F7F4EE" stroke="#1C1D21" strokeWidth="1.4"/>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${10 + i * 9} 18 l5 0 -4 5 -5 0 Z`} fill="#1C1D21"/>)}
      </svg>
    );
  }
  if (kind === "rocket") return <img src="/stickers/rocket/rocket.webp" alt="" aria-hidden="true" draggable="false" style={{display:"block",height:"100%",margin:"0 auto"}}/>;
  if (kind === "slushie") {
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <path d="M27 2 L23 16" stroke="#1C1D21" strokeWidth="4.4" strokeLinecap="round"/>
        <path d="M27 2 L23 16" stroke="#FF4FA3" strokeWidth="2.6" strokeLinecap="round"/>
        <path d="M12 17 Q24 6 36 17 Z" fill="#E9F7FF" fillOpacity="0.85" stroke="#1C1D21" strokeWidth="1.6" strokeLinejoin="round"/>
        <rect x="10" y="16" width="28" height="4" rx="2" fill="#F7F4EE" stroke="#1C1D21" strokeWidth="1.6"/>
        <path d="M12 20 L15 44 H33 L36 20 Z" fill="#1E7BFF" stroke="#1C1D21" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M13 24 L35 24" stroke="#5FB4FF" strokeWidth="2"/>
        <path d="M15.5 29 Q24 33 32.5 29 L31.4 38 Q24 41 16.6 38 Z" fill="#F7F4EE" stroke="#1C1D21" strokeWidth="1.2"/>
        <text x="24" y="36.4" textAnchor="middle" fontSize="5.4" fontWeight="900" fill="#1E7BFF" fontFamily="Arial, sans-serif">ICE</text>
        <path d="M16 22 L18 41" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.55"/>
      </svg>
    );
  }
  if (kind === "gummy") {
    const segs = ["#FF3B5C", "#FFD84D", "#27C46B", "#FF3B5C", "#FFD84D", "#27C46B"];
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <path d="M6 30 C10 18 18 18 22 26 C26 34 34 34 40 20" fill="none" stroke="#1C1D21" strokeWidth="11.5" strokeLinecap="round"/>
        {segs.map((c, i) => {
          const t0 = i / segs.length, t1 = (i + 1) / segs.length;
          return <path key={i} d="M6 30 C10 18 18 18 22 26 C26 34 34 34 40 20" fill="none" stroke={c} strokeWidth="8.5" strokeLinecap={i === 0 || i === segs.length - 1 ? "round" : "butt"}
            pathLength="1" strokeDasharray={`${t1 - t0} 1`} strokeDashoffset={-t0}/>;
        })}
        {[[9,27],[16,22],[24,30],[31,31],[37,24]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.9" fill="#FFFFFF" opacity="0.9"/>)}
        <circle cx="40.5" cy="18.8" r="1.1" fill="#1C1D21"/><circle cx="37.6" cy="17.6" r="1.1" fill="#1C1D21"/>
      </svg>
    );
  }
  if (kind === "licorice") {
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <path d="M24 24 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 M24 24 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M37 24 C42 30 44 38 40 45" fill="none" stroke="#1C1D21" strokeWidth="7" strokeLinecap="round"/>
        <path d="M24 24 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 M24 24 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M37 24 C42 30 44 38 40 45" fill="none" stroke="#D3122F" strokeWidth="4.6" strokeLinecap="round"/>
        <path d="M24 24 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 M24 24 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M37 24 C42 30 44 38 40 45" fill="none" stroke="#FF6B7F" strokeWidth="1.4" strokeDasharray="2 3" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === "jaw") {
    return (
      <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
        <defs><clipPath id="jaw-clip"><circle cx="24" cy="24" r="18"/></clipPath></defs>
        <g clipPath="url(#jaw-clip)">
          <rect x="0" y="0" width="48" height="48" fill="#FF4FA3"/>
          <circle cx="34" cy="34" r="30" fill="none" stroke="#FFD84D" strokeWidth="6"/>
          <circle cx="34" cy="34" r="22" fill="none" stroke="#2F6BFF" strokeWidth="6"/>
          <circle cx="34" cy="34" r="14" fill="none" stroke="#27C46B" strokeWidth="6"/>
          <circle cx="34" cy="34" r="6" fill="#FF8A1C"/>
        </g>
        <circle cx="24" cy="24" r="18" fill="none" stroke="#1C1D21" strokeWidth="1.8"/>
        <ellipse cx="17" cy="15" rx="5.5" ry="3.2" transform="rotate(-35 17 15)" fill="#FFFFFF" opacity="0.7"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
      <ellipse cx="24" cy="26" rx="17" ry="13" fill="#5A2E1A"/>
      <ellipse cx="24" cy="23" rx="17" ry="13" fill={color || CANDY_COLORS[0]} stroke="#1C1D21" strokeWidth="1.8"/>
      <ellipse cx="18" cy="18" rx="6" ry="3" fill="rgba(255,255,255,0.55)"/>
    </svg>
  );
}

// The owner's rocket launcher: the hatch and arm swing out holding the rocket, the rocket
// leaves (the arena draws its flight), the empty claw lingers, then everything folds back in.
function RocketArm({side = 1, cx, reducedMotion = false}) {
  const A = ROCKET_ART;
  const total = ROCKET_REACH_MS + ROCKET_RETRACT_MS + 120;
  const base = {position:"absolute",left:cx + A.hatchDx,bottom:A.armBottom,transformOrigin:"0% 60%",pointerEvents:"none"};
  return (
    <div data-rocket-arm="" aria-hidden="true" style={{position:"absolute",left:0,bottom:0,width:0,height:0,transformOrigin:`${cx}px 0`,transform:side < 0 ? "scaleX(-1)" : "none"}}>
      <img src="/stickers/rocket/arm-hold.webp" alt="" draggable="false" style={{...base,width:A.holdW,height:A.holdH,
        animation:reducedMotion ? "none" : `armReach ${ROCKET_REACH_MS}ms cubic-bezier(.2,1.4,.5,1) both, armHide 1ms linear ${ROCKET_REACH_MS}ms both`}}/>
      <img src="/stickers/rocket/arm-empty.webp" alt="" draggable="false" style={{...base,width:A.emptyW,height:A.emptyH,
        animation:reducedMotion ? "none" : `armShow 1ms linear ${ROCKET_REACH_MS}ms both, armRetract ${ROCKET_RETRACT_MS}ms ease-in ${total - ROCKET_RETRACT_MS}ms both`}}/>
    </div>
  );
}

// The catching box is the same popcorn bucket art as the run streak (owner request 2026-11-05),
// starting empty and filling up as the score climbs. A small lens on the front glows while the
// laser has a shot ready. Every stage is drawn on the same 306x283 canvas with the bucket at
// x 54-256 and its base on the bottom edge, so the bucket stays put as it fills.
const BUCKET_ART_W = 306, BUCKET_ART_BODY_L = 54, BUCKET_ART_BODY_W = 202, BUCKET_ART_MID = 155;
// Every good catch fills it one stage (owner request 2026-11-05): full after 6, spilling from 7,
// and from then on every catch sends popcorn flying over the rim.
function bucketStage(catches) { return Math.max(0, Math.min(POPCORN_STAGES.length - 1, catches)); }
const SPILL_KERNELS = [[-44,-30,-120],[-24,-52,-60],[0,-62,40],[22,-50,90],[42,-28,160]];
function PopcornBox({x = null, charged = false, catches = 0, reducedMotion = false, wide = false, launch = null, jaw = false, buttered = false, chips = 0}) {
  const k = (BUCKET_W + 6) / BUCKET_ART_BODY_W;   // scale so the bucket body is the catch width
  const w = BUCKET_ART_W * k;
  const mid = BUCKET_ART_MID * k;
  const left = x === null ? "50%" : x;
  // Sour gummy worm (owner 2026-11-05): two real buckets side by side, not one stretched bucket.
  // Together they cover the doubled catch width, centred where the single bucket was.
  const half = (BUCKET_W + 6) / 2;
  const twins = wide ? [-half, half] : [0];
  // Buttered (owner art 2026-11-06): the owner's buttered bucket, sized and lined up to match.
  const stage = buttered ? `${ARCADE_ART}popcorn-butter.webp` : POPCORN_STAGES[bucketStage(catches)];
  const imgH = w * 283 / 306;                   // the bucket art's drawn height
  return (
    <div role="img" aria-label="Popcorn box"
      style={{position:"absolute",left,bottom:2,width:w,height:BUCKET_H,transform:`translateX(${-mid}px)`,pointerEvents:"none"}}>
      {launch && <RocketArm key={launch.key} side={launch.side} cx={mid + twins[0]} reducedMotion={reducedMotion}/>}
      {twins.map((dx, b) => (
        <div key={`${wide ? "twin" : "solo"}-${b}`} data-bucket="" style={{position:"absolute",left:dx,bottom:0,width:w,height:BUCKET_H,
          animation:wide && !reducedMotion ? `twinPop 0.3s cubic-bezier(.3,1.6,.5,1) both` : "none"}}>
          <img src={stage} alt="" aria-hidden="true" draggable="false" data-butter={buttered ? "" : undefined}
            style={{position:"absolute",left:0,bottom:0,width:w,height:"auto",userSelect:"none",filter:"drop-shadow(0 3px 0 rgba(0,0,0,0.35))",
              animation:buttered && !reducedMotion ? "butterShine 1.2s ease-in-out infinite" : "none"}}/>
          {charged && <span aria-hidden="true" style={{position:"absolute",left:mid - 62,bottom:BUCKET_H * 0.32 + 13 - 62,width:124,height:124,borderRadius:"50%",
            background:"radial-gradient(circle, #FFFFFF 0 14%, rgba(255,250,170,1) 24%, rgba(255,226,80,0.85) 38%, rgba(255,190,60,0.45) 54%, rgba(255,170,60,0) 70%)",
            animation:"laserHalo 1.4s ease-in-out infinite"}}/>}
          <span aria-hidden="true" data-laser-light={charged ? "on" : "off"} style={{position:"absolute",left:mid - 13,bottom:BUCKET_H * 0.32,width:26,height:26,borderRadius:"50%",
            background:charged ? "radial-gradient(circle at 40% 40%, #FFFFFF 0 22%, #FF6F93 42%, #FF2E63 70%, #D3104A 100%)" : "radial-gradient(circle at 35% 35%, #BFC3CC 0 18%, #5B5F6A 45%, #2A2D35 100%)",
            border:"2px solid #1C1D21",boxSizing:"border-box",animation:charged ? "laserReady 1.4s ease-in-out infinite" : "none"}}/>
          {catches >= POPCORN_STAGES.length - 2 && !reducedMotion && SPILL_KERNELS.map(([sx, sy, rot], i) => (
            <span key={`${catches}-${i}`} data-spill="" aria-hidden="true" style={{position:"absolute",left:mid - 9,bottom:BUCKET_H - 14,width:18,height:16,
              "--dx":`${sx}px`,"--dy":`${sy}px`,"--rot":`${rot}deg`,animation:`popcornSpill 0.8s cubic-bezier(.2,.8,.3,1) ${i * 35}ms both`}}>
              <ArcadeItemArt kind="popcorn" variant={i}/>
            </span>
          ))}
        </div>
      ))}
      {/* Nacho tower (owner pick 2026-11-06): every catch stacks a cheesy chip on the bucket. */}
      {chips > 0 && (
        <div aria-label={`Nacho tower: ${chips}`} style={{position:"absolute",left:mid - 24,bottom:imgH * 0.86,width:48,height:chips * 12 + 40,pointerEvents:"none",
          transformOrigin:"50% 100%",animation:reducedMotion || chips < 3 ? "none" : `chipWobble ${Math.max(0.5, 1.4 - chips * 0.1)}s ease-in-out infinite`}}>
          {Array.from({length:chips}).map((_, i) => (
            <img key={i} src={`${ARCADE_ART}nacho-chip.webp`} alt="" aria-hidden="true" draggable="false"
              style={{position:"absolute",left:0,bottom:i * 12,width:48,height:45,"--cx":`${[0, 9, -8, 6, -10, 8, -4, 10][i % 8]}px`,"--cr":`${180 + [0, 22, -20, 14, -24, 18, -10, 26][i % 8]}deg`,
                transform:`translate(var(--cx),0) rotate(var(--cr))`,filter:"drop-shadow(0 2px 0 rgba(0,0,0,0.3))",
                animation:reducedMotion ? "none" : "chipDrop 0.32s cubic-bezier(.3,1.4,.5,1) both"}}/>
          ))}
        </div>
      )}
      {jaw && <span aria-label="Jawbreaker ready" style={{position:"absolute",left:mid - 13,bottom:BUCKET_H - 10,width:26,height:26,
        animation:reducedMotion ? "none" : "pulse 1s ease-in-out infinite"}}><ArcadeItemArt kind="jaw"/></span>}
    </div>
  );
}

// Popcorn Panic logo (owner 2026-11-05): the overflowing bucket with POPCORN PANIC! on a
// yellow label, as on the main-menu button, without the plays badge.
function PopcornPanicLogo({height = 128}) {
  return (
    <div role="img" aria-label="Popcorn Panic" style={{position:"relative",height,aspectRatio:"306 / 283",
      background:"url(/stickers/popcorn-8.webp) center / contain no-repeat",filter:"drop-shadow(0 4px 0 rgba(28,29,33,0.55))"}}>
      <span style={{position:"absolute",left:"50%",top:"56%",transform:"translate(-50%,-50%) rotate(-5deg)",display:"flex",flexDirection:"column",alignItems:"center",
        background:"#FFD84D",border:"2px solid #1C1D21",borderRadius:6,padding:"3px 6px 2px",boxShadow:"0 2px 0 #1C1D21",whiteSpace:"nowrap"}}>
        <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:height * 0.115,lineHeight:1.05,color:"#1C1D21"}}>POPCORN</span>
        <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:height * 0.135,lineHeight:1.05,color:"#E8344E"}}>PANIC!</span>
      </span>
    </div>
  );
}
// Lives as hearts: full red ones left, faded empty ones for each life lost.
function ArcadeHearts({lives, size = 15}) {
  return Array.from({length:ARCADE_LIVES}).map((_, i) => (
    <span key={i} aria-hidden="true" style={{fontSize:size,lineHeight:1,opacity:i < lives ? 1 : 0.3,filter:i < lives ? "none" : "grayscale(1) brightness(1.6)"}}>{i < lives ? "❤️" : "🤍"}</span>
  ));
}
const ARCADE_PILL = { ...HUD_STAT_PILL, minHeight:34, padding:"0 9px", gap:4 };
const ARCADE_PILL_TEXT = { ...HUD_COUNTER_TEXT, fontSize:14, display:"inline-flex", alignItems:"center", gap:4, transform:"none" };
const ARCADE_PILL_ICON = { fontSize:15, WebkitTextStroke:"0", textShadow:"none" };
const ARCADE_TILE_VALUE = { ...HUD_COUNTER_TEXT, fontSize:18, transform:"none" };
function ResultTile({label, ariaLabel, children}) {
  return (
    <div aria-label={ariaLabel} style={{background:"#241D66",border:"2px solid #1C1D21",borderRadius:10,boxShadow:"0 2px 0 #1C1D21",padding:"9px 4px 7px",
      display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <div style={{display:"flex",gap:1,alignItems:"center",minHeight:22}}>{children}</div>
      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:"#C9C4F2"}}>{label}</span>
    </div>
  );
}

// embedded: opened straight from a round (5 in a row); starts at once and returns to the game.
function ArcadeScreen({onBack, reducedMotion=false, embedded=false}) {
  const [phase, setPhase] = useState("lobby"); // lobby | playing | done
  // Fetch every bucket stage and the rocket art while the lobby is up, so the bucket is
  // on screen the moment play starts and never blinks out when it fills (owner 2026-11-05).
  useEffect(() => {
    const urls = [...POPCORN_STAGES, ...["arm-hold", "arm-empty", "rocket", "exhaust", "explosion"].map((n) => `/stickers/rocket/${n}.webp`),
      ...ARCADE_ART_FILES.map((n) => `${ARCADE_ART}${n}.webp`)];
    const imgs = urls.map((u) => { const im = new Image(); im.decoding = "async"; im.src = u; return im; });
    return () => { imgs.length = 0; };
  }, []);
  const [passes, setPasses] = useState(arcadePasses);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(ARCADE_LIVES);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [frenzy, setFrenzy] = useState(false);
  const [items, setItems] = useState([]);
  const [boost, setBoost] = useState(null);   // {type: "shield"|"double", until}
  const [flash, setFlash] = useState(null);   // {key, text, bad}
  const [callout, setCallout] = useState(null); // big power-up name in mid-screen {key, big, small, color}
  const [result, setResult] = useState(null);
  const scoreRef = useRef(0);
  const livesRef = useRef(ARCADE_LIVES);
  const boostRef = useRef(null);
  const comboRef = useRef(0);
  const itemsRef = useRef([]);
  const arenaRef = useRef(null);
  const bucketXRef = useRef(null);
  const [bucketX, setBucketX] = useState(null);
  const [showSlideHint, setShowSlideHint] = useState(true);
  const frenzyUntilRef = useRef(0);
  const frenzyRunRef = useRef(0); // regular good catches in a row toward the next frenzy
  const idRef = useRef(0);
  const finishRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(Math.ceil(ARCADE_GAME_MS / 1000));
  const [laser, setLaser] = useState(LASER_MAX);
  const laserRef = useRef({ charges: LASER_MAX, nextAt: 0 });
  const [beams, setBeams] = useState([]);   // laser shots on screen: {id, x}
  const [booms, setBooms] = useState([]);   // explosions on screen: {id, x, y}
  const pointerStartRef = useRef(null);
  // The zap coach comes back every play until the first zap of that play (owner question
  // 2026-11-05: "where is the thing that showed you to shoot the laser?").
  const [zapLearned, setZapLearned] = useState(false);
  const [catches, setCatches] = useState(0);  // good catches this play: fills the bucket
  const catchesRef = useRef(0);
  const [rockets, setRockets] = useState(0);
  const rocketsRef = useRef(0);
  const [rocketShots, setRocketShots] = useState([]); // rockets in flight: {id, x, y, dx, dy, rot}
  const [launch, setLaunch] = useState(null);         // {key, side}: the arm swinging out
  const aliveRef = useRef(false);                     // a play is running (guards delayed effects)
  const freezeUntilRef = useRef(0);
  const [frozen, setFrozen] = useState(false);
  const gummyUntilRef = useRef(0);
  const [wide, setWide] = useState(false);
  const jawRef = useRef(0);
  const [jaw, setJaw] = useState(0);
  const [lassos, setLassos] = useState([]);           // licorice pulls on screen: {id, x1, y1, x2, y2}
  const [levelUp, setLevelUp] = useState(null); // {key, lv}: "LEVEL 3" banner
  // Owner picks 2026-11-06, with the owner's art.
  const butterRef = useRef(0);                        // buttered catches left
  const [butter, setButter] = useState(0);
  const slideRef = useRef({ v: 0, t: 0, x: null });   // bucket momentum while buttered
  const smearRef = useRef({ x: null, list: [] });       // the butter trail the bucket leaves behind
  const [smears, setSmears] = useState([]);
  const nachoRef = useRef({ until: 0, chips: 0 });
  const [nacho, setNacho] = useState(null);           // {chips, until}
  const [toppled, setToppled] = useState(null);       // {key, x, chips}: a knocked-over tower
  const [jackpot, setJackpot] = useState(null);       // {key, reels, win, done}
  const [trex, setTrex] = useState(null);             // {key, side, stage: peek|roar|leave}
  const [trailer, setTrailer] = useState(null);       // {key, lines}
  const trailerRef = useRef({ from: 0, until: 0 }); // the corn dog rain under the trailer banner
  const [burn, setBurn] = useState(null);             // {key, x, y}
  const burnRef = useRef(null);                       // {x, y, start, until}
  const [shake, setShake] = useState(null);           // {key}: the arena shakes
  const [postCredits, setPostCredits] = useState(false);
  useEffect(() => {
    if (!levelUp) return;
    const t = setTimeout(() => setLevelUp(null), 1400);
    return () => clearTimeout(t);
  }, [levelUp]);

  const start = () => {
    if (!useArcadePass()) return;
    setPasses(arcadePasses());
    scoreRef.current = 0; livesRef.current = ARCADE_LIVES; boostRef.current = null;
    comboRef.current = 0; frenzyUntilRef.current = 0; frenzyRunRef.current = 0;
    laserRef.current = { charges: LASER_MAX, nextAt: 0 };
    catchesRef.current = 0; setCatches(0); rocketsRef.current = 0; setRockets(0); setRocketShots([]); setZapLearned(false);
    setLaunch(null); freezeUntilRef.current = 0; setFrozen(false); gummyUntilRef.current = 0; setWide(false);
    jawRef.current = 0; setJaw(0); setLassos([]);
    butterRef.current = 0; setButter(0); slideRef.current = { v: 0, t: 0, x: null }; smearRef.current = { x: null, list: [] }; setSmears([]);
    nachoRef.current = { until: 0, chips: 0 }; setNacho(null); setToppled(null); setJackpot(null);
    setTrex(null); setTrailer(null); trailerRef.current = { from: 0, until: 0 }; burnRef.current = null; setBurn(null);
    setShake(null); setPostCredits(false);
    setLaser(LASER_MAX); setBeams([]); setBooms([]); setTimeLeft(Math.ceil(ARCADE_GAME_MS / 1000));
    setScore(0); setLives(ARCADE_LIVES); setLevel(1); setCombo(0); setFrenzy(false);
    setBoost(null); setFlash(null); setItems([]); setResult(null);
    bucketXRef.current = null; setBucketX(null); setShowSlideHint(true);
    setPhase("playing");
  };

  // Opened from a round: start straight away (the play was just earned).
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (!embedded || autoStartedRef.current) return;
    autoStartedRef.current = true;
    start();
  }, [embedded]);

  // Catch game (owner design 2026-10-25): pieces fall from the top and the player slides the
  // popcorn box under them. Good pieces in the box score; bad ones cost a life and break the
  // combo. Several pieces fall at once, so dropped popcorn only costs points. Made much harder
  // after play-testing (owner request 2026-10-25): 45-second timer, smaller box, faster and
  // drifting pieces, more bad ones, and a laser to blast bad pieces before they land.
  useEffect(() => {
    if (phase !== "playing") return;
    const startedAt = Date.now();
    let done = false, raf = null, last = performance.now(), nextSpawnAt = Date.now() + 400, shownLevel = 1;
    itemsRef.current = [];
    // The T-rex, a trailer and a film burn, in a random order, then the kernel boss.
    const order = ["trex", "trailer", "burn"].map((t) => [Math.random(), t]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    const events = order.map((type, i) => ({ type, at: ARCADE_EVENT_SLOTS[i] + Math.round((Math.random() * 2 - 1) * 1000) }));
    events.push({ type: "boss", at: BOSS_AT_MS });
    let eventBusyUntil = 0;
    if (typeof window !== "undefined" && window.__noArcadeEvents) events.length = 0; // tests that need a quiet play
    const levelNow = () => 1 + Math.floor((Math.min(Date.now(), startedAt + ARCADE_GAME_MS) - startedAt) / ARCADE_LEVEL_MS);
    aliveRef.current = true;
    const finish = (reason = "lives") => {
      if (done) return;
      done = true; aliveRef.current = false;
      if (raf) cancelAnimationFrame(raf);
      const final = scoreRef.current;
      const prize = prizeForScore(final);
      const p = loadPrizes();
      const isNew = !!prize && !p.won.includes(prize.id);
      const isRecord = final > (p.best || 0) && final > 0;
      writeJSON(LS_PRIZES, { ...p, best: Math.max(p.best || 0, final), won: prize && isNew ? [...p.won, prize.id] : p.won });
      if (prize) addPowerups(prize.powerups);
      if (prize || isRecord) SFX.complete();
      setPostCredits(Math.random() < 0.5);   // sometimes there's a scene after the credits
      setResult({ score: final, prize, isNew, isRecord, level: levelNow(), reason,
        seconds: Math.min(ARCADE_GAME_MS / 1000, Math.round((Date.now() - startedAt) / 1000)) });
      itemsRef.current = [];
      setItems([]);
      setPhase("done");
    };
    finishRef.current = finish;
    const step = (t) => {
      if (done) return;
      const dt = Math.min(50, t - last); last = t;
      const arena = arenaRef.current;
      const W = arena?.clientWidth || 360, H = arena?.clientHeight || 500;
      if (bucketXRef.current === null) { bucketXRef.current = W / 2; setBucketX(W / 2); }
      const now = Date.now();
      const left = startedAt + ARCADE_GAME_MS - now;
      if (left <= 0) { setTimeLeft(0); finish("time"); return; }
      setTimeLeft(Math.ceil(left / 1000));
      const lv = levelNow();
      // Every 5 seconds survived is a new level: announce it, since it's faster from here.
      if (lv > shownLevel) {
        shownLevel = lv;
        setLevelUp({ key: now, lv });
        SFX.leaderBeep?.(); buzz([10, 40, 10]);
      }
      // One surprise at a time: a due one waits until the last has cleared.
      for (const ev of events) if (!ev.done && now - startedAt >= ev.at && (now >= eventBusyUntil || ev.type === "boss")) {
        ev.done = true; runEvent(ev.type, W, H);
        eventBusyUntil = now + ({ trex: TREX_PEEK_MS + TREX_ROAR_MS + 600, trailer: TRAILER_RAIN_MS + 400, burn: BURN_MS }[ev.type] || 0);
      }
      // Butter makes the bucket slippery: it keeps sliding a little after the finger stops.
      if (butterRef.current > 0) {
        const S = slideRef.current;
        if (now - S.t > 60 && Math.abs(S.v) > 0.02 && bucketXRef.current !== null) {
          const hw = (now < gummyUntilRef.current ? 2 : 1) * BUCKET_W / 2 + 6;
          const nx = Math.max(hw, Math.min(W - hw, bucketXRef.current + S.v * dt));
          if (nx === hw || nx === W - hw) S.v = 0; else S.v *= Math.pow(0.985, dt);
          bucketXRef.current = nx; setBucketX(nx);
        }
      }
      // A buttered bucket leaves a yellow butter trail behind it as it slides (owner request 2026-11-07).
      {
        const M = smearRef.current, bxNow = bucketXRef.current;
        let changed = false;
        if (butterRef.current > 0 && bxNow !== null) {
          if (M.x === null) M.x = bxNow;
          const step = bxNow - M.x;
          if (Math.abs(step) >= 12) {
            const n = Math.min(6, Math.floor(Math.abs(step) / 12));
            const offs = now < gummyUntilRef.current ? [-BUCKET_W / 2, BUCKET_W / 2] : [0];
            for (let k = 1; k <= n; k++) for (const o of offs)
              {
                // Flat, uneven smears: varied widths and thickness, odd corners, and the odd stray drop.
                const r = () => 30 + Math.round(Math.random() * 60);
                M.list.push({ id: ++idRef.current, x: M.x + (step * k) / n + o + (Math.random() * 2 - 1) * 4, born: now,
                  w: 18 + Math.random() * 30, h: 4 + Math.random() * 6, lift: Math.random() * 3,
                  shape: `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`,
                  drop: Math.random() < 0.3 ? { dx: (Math.random() * 2 - 1) * 16, dy: 7 + Math.random() * 6, d: 3 + Math.random() * 3 } : null,
                  shine: { at: 0.15 + Math.random() * 0.4, len: 0.25 + Math.random() * 0.3 }, glint: Math.random() < 0.22 });
              }
            M.x = bxNow; changed = true;
          }
        } else M.x = null;
        const before = M.list.length;
        M.list = M.list.filter((m) => now - m.born < 1500).slice(-60);
        if (changed || M.list.length !== before) setSmears(M.list.slice());
      }
      // The nacho tower cashes in when its time is up.
      if (nachoRef.current.until && now >= nachoRef.current.until) {
        const n = nachoRef.current.chips;
        const dbl = boostRef.current?.type === "double" && now <= boostRef.current.until ? 2 : 1;
        nachoRef.current = { until: 0, chips: 0 }; setNacho(null);
        if (n > 0) { scoreRef.current += n * NACHO_PTS * dbl; setScore(scoreRef.current); showFlash(`🧀 Nacho tower: ${n} chip${n === 1 ? "" : "s"} cashed in! +${n * NACHO_PTS * dbl}`); SFX.complete(); }
        else showFlash("🧀 No chips stacked… nacho day");
      }
      const inFrenzy = now < frenzyUntilRef.current;
      const slow = boostRef.current?.type === "slow" && now <= boostRef.current.until;
      const moveDt = slow ? dt * 0.5 : dt;
      // The laser recharges one shot at a time.
      const L = laserRef.current;
      if (L.charges < LASER_MAX && now >= L.nextAt) {
        L.charges += 1; L.nextAt = now + LASER_RECHARGE_MS; setLaser(L.charges);
      }
      // Spawn: faster each level; a Popcorn Frenzy rains popcorn only. From level 3 pieces
      // drift sideways, and bats always swoop from side to side.
      if (now >= nextSpawnAt) {
        const vip = boostRef.current?.type === "vip" && now <= boostRef.current.until;
        const raining = now >= trailerRef.current.from && now < trailerRef.current.until;
        const it = raining ? ARCADE_KIND.corndog : inFrenzy || vip ? ARCADE_KIND.popcorn : pickArcadeItem(lv);
        const fall = Math.max(ARCADE_MIN_FALL, ARCADE_BASE_FALL * Math.pow(0.9, lv - 1));
        const drift = lv >= 3 ? (Math.random() * 2 - 1) * 0.012 * (lv - 2) : 0;
        const x = ARCADE_ITEM / 2 + Math.random() * (W - ARCADE_ITEM);
        itemsRef.current.push({ id: ++idRef.current, kind: it.kind, label: it.label, frenzy: inFrenzy,
          x, baseX: x, y: -ARCADE_ITEM, vy: (H + ARCADE_ITEM) / fall, vx: drift, born: now,
          color: CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)],
          variant: Math.floor(Math.random() * 12), angle: it.kind === "bat" ? 0 : Math.floor(Math.random() * 360),
          spin: it.kind === "bat" ? 0 : (Math.random() * 2 - 1) * 0.25 });
        nextSpawnAt = now + (raining ? TRAILER_SPAWN_MS : inFrenzy ? FRENZY_SPAWN_MS : Math.max(ARCADE_MIN_SPAWN, ARCADE_BASE_SPAWN * Math.pow(0.86, lv - 1)));
      }
      // Move, catch, or drop.
      const catchY = H - BUCKET_H + 18;
      const catchHalf = (now < gummyUntilRef.current ? 2 : 1) * BUCKET_W / 2;
      // The twin buckets need twice the room: nudge them in from the wall so neither is cut off.
      const bxRaw = bucketXRef.current ?? W / 2;
      const bx = Math.max(catchHalf + 6, Math.min(W - catchHalf - 6, bxRaw));
      if (bx !== bxRaw) { bucketXRef.current = bx; setBucketX(bx); }
      const keep = [];
      const half = ARCADE_ITEM / 2;
      const freezing = now < freezeUntilRef.current;
      for (const it of itemsRef.current) {
        const prevY = it.y;
        // A jawbreaker bounce: the piece flies back up and away under gravity, harmless.
        if (it.bounced) {
          it.y += it.vy * moveDt; it.x += it.vx * moveDt; it.vy += 0.0028 * moveDt; it.angle += 0.6 * moveDt;
          if (it.y - ARCADE_ITEM > H || it.x < -ARCADE_ITEM || it.x > W + ARCADE_ITEM) continue;
          keep.push(it); continue;
        }
        // Brain freeze: bad pieces hang in mid-air.
        if (freezing && ARCADE_KIND[it.kind]?.bad) { it.frozen = true; keep.push(it); continue; }
        it.frozen = false;
        // The kernel boss lumbers down, swaying; reaching the bottom costs a life.
        if (it.boss) {
          it.y += it.vy * moveDt;
          it.x = Math.max(BOSS_SIZE / 2, Math.min(W - BOSS_SIZE / 2, it.baseX + Math.sin((now - it.born) / 800) * 46));
          if (it.y + BOSS_SIZE * 0.3 >= catchY) { bossLands(); continue; }
          keep.push(it); continue;
        }
        // A film burn: anything that falls into the hole is gone.
        const B = burnRef.current;
        if (B && now < B.until) {
          const r = BURN_R * Math.min(1, (now - B.start) / 500, (B.until - now) / 500);
          if (Math.hypot(it.x - B.x, it.y - B.y) < r * 0.85) continue;
        }
        it.y += it.vy * moveDt;
        // The T-rex's roar shoves everything away from him.
        if (it.push) {
          it.x += it.push * moveDt; it.baseX += it.push * moveDt;
          it.push *= Math.pow(0.996, moveDt); if (Math.abs(it.push) < 0.01) it.push = 0;
          if (it.x < half || it.x > W - half) { it.push = -it.push * 0.6; it.x = Math.max(half, Math.min(W - half, it.x)); it.baseX = it.x; }
        }
        it.angle += it.spin * moveDt;
        if (it.kind === "bat") {
          // Keep room for the full swoop, so a bat near the edge isn't pinned against the wall.
          it.baseX = Math.max(half + 48, Math.min(W - half - 48, it.baseX));
          it.x = it.baseX + Math.sin((now - it.born) / 260) * 48;
        } else if (it.vx) {
          it.x += it.vx * moveDt;
          if (it.x < half || it.x > W - half) { it.vx = -it.vx; it.x = Math.max(half, Math.min(W - half, it.x)); }
        }
        if (prevY < catchY && it.y >= catchY && Math.abs(it.x - bx) <= catchHalf) { if (catchItem(it) === "bounce") keep.push(it); continue; }
        if (it.y - ARCADE_ITEM / 2 > H) continue; // dropped: no points, no penalty
        keep.push(it);
      }
      itemsRef.current = keep;
      setItems(keep.map((it) => ({ ...it })));
      setLevel(lv);
      if (boostRef.current && now > boostRef.current.until) { boostRef.current = null; setBoost(null); }
      setFrozen(now < freezeUntilRef.current);
      setWide(now < gummyUntilRef.current);
      if (burnRef.current && now >= burnRef.current.until) { burnRef.current = null; setBurn(null); }
      if (frenzyUntilRef.current && now > frenzyUntilRef.current) { frenzyUntilRef.current = 0; setFrenzy(false); }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { done = true; aliveRef.current = false; if (raf) cancelAnimationFrame(raf); };
  }, [phase]);

  // Slide the box: it follows the finger (or mouse); arrow keys work too.
  const moveBucket = (clientX) => {
    const arena = arenaRef.current; if (!arena) return;
    const r = arena.getBoundingClientRect();
    const half = (Date.now() < gummyUntilRef.current ? 2 : 1) * BUCKET_W / 2 + 6;
    const x = Math.max(half, Math.min(r.width - half, clientX - r.left));
    const S = slideRef.current, t = Date.now();
    if (S.x !== null && t > S.t) S.v = Math.max(-1.2, Math.min(1.2, 0.6 * S.v + 0.4 * (x - S.x) / (t - S.t)));
    S.x = x; S.t = t;
    bucketXRef.current = x; setBucketX(x);
    if (showSlideHint) setShowSlideHint(false);
  };
  // Tap (rather than slide) to fire the laser straight up from the box.
  const fireLaser = () => {
    if (phase === "playing" && rocketsRef.current > 0) { fireRocket(); return; }
    const L = laserRef.current;
    if (phase !== "playing" || L.charges < 1) { if (phase === "playing") showFlash("🔋 Laser recharging…", true); return; }
    if (L.charges === LASER_MAX) L.nextAt = Date.now() + LASER_RECHARGE_MS;
    L.charges -= 1; setLaser(L.charges);
    const bx = bucketXRef.current ?? 0;
    const H = arenaRef.current?.clientHeight || 500;
    const shotId = ++idRef.current;
    setBeams((b) => [...b, { id: shotId, x: bx }]);
    setTimeout(() => setBeams((b) => b.filter((x) => x.id !== shotId)), 220);
    SFX.laser(); buzz(10);
    // It hits the lowest piece in its path that is still above the box.
    const target = itemsRef.current.filter((it) => Math.abs(it.x - bx) <= LASER_HALF_W + (it.boss ? BOSS_SIZE * 0.32 : 0) && it.y < H - BUCKET_H + 18)
      .sort((a, b) => b.y - a.y)[0];
    if (!target) return;
    if (target.boss) { if (!zapLearned) setZapLearned(true); hitBoss(target, 1); return; }
    itemsRef.current = itemsRef.current.filter((it) => it !== target);
    explode(target.x, target.y);
    if (ARCADE_KIND[target.kind]?.bad) {
      if (!zapLearned) setZapLearned(true);
      const pts = 2 * (boostRef.current?.type === "double" && Date.now() <= boostRef.current.until ? 2 : 1);
      scoreRef.current += pts; setScore(scoreRef.current);
      showFlash(`💥 Zapped! +${pts}`);
    } else {
      showFlash(target.kind === "popcorn" ? "Oops, you zapped the popcorn!" : "Oops, wrong target!", true);
    }
  };
  const fireRocket = () => {
    rocketsRef.current -= 1; setRockets(rocketsRef.current);
    const arena = arenaRef.current;
    const W = arena?.clientWidth || 360;
    const side = (bucketXRef.current ?? W / 2) < W / 2 ? 1 : -1; // the arm swings toward open space
    const key = ++idRef.current;
    setLaunch({ key, side });
    SFX.slate?.(); buzz(10);
    setTimeout(() => setLaunch((l) => (l && l.key === key ? null : l)), ROCKET_REACH_MS + ROCKET_RETRACT_MS + 140);
    // The arm lets go: the rocket homes in on the lowest bad piece (or anything, or straight up).
    setTimeout(() => {
      if (!aliveRef.current) return;
      const H = arenaRef.current?.clientHeight || 500;
      const bx = bucketXRef.current ?? W / 2;
      const hx = bx + side * ROCKET_ART.handDx, hy = H - 2 - ROCKET_ART.handUp;
      const live = itemsRef.current.filter((it) => !it.bounced && it.y > 0 && it.y < hy);
      const target = live.find((it) => it.boss) || live.filter((it) => ARCADE_KIND[it.kind]?.bad).sort((p, q) => q.y - p.y)[0]
        || live.sort((p, q) => q.y - p.y)[0];
      const lead = (it) => (it.frozen ? 0 : it.vy * ROCKET_FLIGHT_MS);
      const tx = target ? target.x : hx, ty = target ? Math.max(30, target.y + lead(target)) : 60;
      const dx = tx - hx, dy = ty - hy;
      const shotId = ++idRef.current;
      setRocketShots((rs) => [...rs, { id: shotId, x: hx, y: hy, dx, dy, rot: Math.atan2(dx, -dy) * 180 / Math.PI }]);
      SFX.laser(); buzz(15);
      setTimeout(() => {
        setRocketShots((rs) => rs.filter((x) => x.id !== shotId));
        if (!aliveRef.current) return;
        const hit = itemsRef.current.filter((it) => !it.boss && Math.hypot(it.x - tx, it.y - ty) <= ROCKET_RADIUS);
        itemsRef.current = itemsRef.current.filter((it) => !hit.includes(it));
        // A rocket counts as two hits on the kernel boss.
        itemsRef.current.filter((it) => it.boss && Math.hypot(it.x - tx, it.y - ty) <= ROCKET_RADIUS + BOSS_SIZE * 0.4).forEach((b) => hitBoss(b, 2, true));
        const bad = hit.filter((it) => ARCADE_KIND[it.kind]?.bad).length;
        const dbl = boostRef.current?.type === "double" && Date.now() <= boostRef.current.until ? 2 : 1;
        const pts = 2 * bad * dbl;
        if (bad) setZapLearned(true);
        scoreRef.current += pts; setScore(scoreRef.current);
        explode(tx, ty, true);
        showFlash(bad ? `🚀 KABOOM! ${bad} blasted +${pts}` : "🚀 KABOOM! …missed everything");
      }, ROCKET_FLIGHT_MS);
    }, ROCKET_REACH_MS);
  };
  const explode = (x, y, big = false) => {
    const boomId = ++idRef.current;
    setBooms((b) => [...b, { id: boomId, x, y, big }]);
    setTimeout(() => setBooms((b) => b.filter((e) => e.id !== boomId)), big ? 900 : 600);
    SFX.boom(); buzz([25, 20, 25]);
  };
  const onArenaDown = (e) => { pointerStartRef.current = { x: e.clientX, y: e.clientY, t: Date.now() }; moveBucket(e.clientX); };
  const onArenaUp = (e) => {
    const st = pointerStartRef.current; pointerStartRef.current = null;
    if (st && Math.hypot(e.clientX - st.x, e.clientY - st.y) < 14 && Date.now() - st.t < 350) fireLaser();
  };

  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e) => {
      if (e.key === " " || e.key === "ArrowUp") { fireLaser(); e.preventDefault(); return; }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const r = arenaRef.current?.getBoundingClientRect(); if (!r) return;
      moveBucket(r.left + (bucketXRef.current ?? r.width / 2) + (e.key === "ArrowLeft" ? -36 : 36));
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const showFlash = (text, bad=false) => setFlash({ key: Date.now(), text, bad });
  // Owner request 2026-11-07: every power-up says what it does, big, in the middle of the screen.
  const shout = (big, small = "", color = "#FFD84D") => {
    const key = ++idRef.current;
    setCallout({ key, big, small, color });
    setTimeout(() => setCallout((c) => (c && c.key === key ? null : c)), CALLOUT_MS);
  };

  // A bad catch knocks the nacho tower over: the chips fly off and are lost.
  const toppleNachos = () => {
    const n = nachoRef.current.chips;
    nachoRef.current = { until: 0, chips: 0 }; setNacho(null);
    if (n > 0) setToppled({ key: ++idRef.current, x: bucketXRef.current ?? 0, chips: n });
    return n > 0;
  };
  const shakeArena = () => setShake({ key: ++idRef.current });
  // Timed surprises (owner picks 2026-11-06).
  const runEvent = (type, W, H) => {
    const now = Date.now();
    if (type === "trex") {
      // The T-rex peeks in from one side, then roars: the sound wave shoves everything away.
      const side = Math.random() < 0.5 ? "left" : "right";
      const key = ++idRef.current;
      setTrex({ key, side, stage: "peek" });
      showFlash("🦖 Uh oh… something's peeking in");
      setTimeout(() => {
        if (!aliveRef.current) return;
        setTrex({ key, side, stage: "roar" });
        const dir = side === "left" ? 1 : -1;
        for (const it of itemsRef.current) if (!it.boss && !it.bounced) it.push = dir * (0.55 + Math.random() * 0.25);
        shakeArena(); SFX.boom(); buzz([80, 40, 80]);
        showFlash("🦖 ROOOAAAR! Everything got blown away!");
        setTimeout(() => {
          setTrex((t) => (t && t.key === key ? { ...t, stage: "leave" } : t));
          setTimeout(() => setTrex((t) => (t && t.key === key ? null : t)), 450);
        }, TREX_ROAR_MS);
      }, TREX_PEEK_MS);
    } else if (type === "trailer") {
      // Coming attractions: a trailer card, then a corn dog rain worth double points.
      const key = ++idRef.current;
      setTrailer({ key, lines: TRAILER_LINES[Math.floor(Math.random() * TRAILER_LINES.length)] });
      trailerRef.current = { from: now, until: now + TRAILER_RAIN_MS };
      SFX.projector?.();
      setTimeout(() => setTrailer((t) => (t && t.key === key ? null : t)), TRAILER_RAIN_MS);
    } else if (type === "burn") {
      // The film catches fire: a hole burns open, and pieces fall through it.
      const x = 70 + Math.random() * Math.max(10, W - 140), y = H * (0.22 + Math.random() * 0.25);
      burnRef.current = { x, y, start: now, until: now + BURN_MS };
      setBurn({ key: ++idRef.current, x, y });
      showFlash("🔥 Film burn! Pieces fall through the hole"); buzz(30);
    } else if (type === "boss") {
      const x = W / 2;
      itemsRef.current.push({ id: ++idRef.current, kind: "boss", label: "Kernel boss", boss: true, hp: BOSS_HP, variant: 0,
        x, baseX: x, y: -BOSS_SIZE / 2, vy: (H + BOSS_SIZE) / BOSS_FALL_MS, vx: 0, born: now, angle: 0, spin: 0, hitAt: 0 });
      shakeArena(); SFX.wrong(); buzz([60, 30, 60]);
      showFlash("👊 KERNEL BOSS! Zap it 3 times before it lands!", true);
    }
  };
  const hitBoss = (b, dmg, byRocket = false) => {
    b.hp -= dmg; b.hitAt = Date.now(); b.variant = Math.min(2, BOSS_HP - Math.max(0, b.hp));
    const dbl = boostRef.current?.type === "double" && Date.now() <= boostRef.current.until ? 2 : 1;
    if (b.hp > 0) {
      if (!byRocket) explode(b.x, b.y);
      scoreRef.current += 2 * dbl; setScore(scoreRef.current);
      showFlash(`💥 Crack! ${b.hp} more hit${b.hp === 1 ? "" : "s"}! +${2 * dbl}`);
      return;
    }
    // Defeated: it bursts into a shower of popcorn to catch.
    itemsRef.current = itemsRef.current.filter((it) => it !== b);
    if (!byRocket) explode(b.x, b.y, true);
    shakeArena();
    const H = arenaRef.current?.clientHeight || 500;
    for (let i = 0; i < 12; i++) {
      itemsRef.current.push({ id: ++idRef.current, kind: "popcorn", label: "Popcorn", x: b.x + (Math.random() * 2 - 1) * 40, baseX: b.x,
        y: b.y + (Math.random() * 2 - 1) * 30, vy: (H / 3200) * (0.7 + Math.random() * 0.6), vx: (Math.random() * 2 - 1) * 0.12, born: Date.now(),
        variant: Math.floor(Math.random() * 12), angle: Math.floor(Math.random() * 360), spin: (Math.random() * 2 - 1) * 0.3 });
    }
    scoreRef.current += 10 * dbl; setScore(scoreRef.current);
    showFlash(`🍿 KERNEL BOSS POPPED! +${10 * dbl}`); SFX.complete(); buzz([30, 30, 30, 30, 60]);
  };
  const bossLands = () => {
    itemsRef.current = itemsRef.current.filter((it) => !it.boss);
    shakeArena();
    comboRef.current = 0; setCombo(0); frenzyRunRef.current = 0;
    if (boostRef.current?.type === "shield" && Date.now() <= boostRef.current.until) { showFlash("🛡️ Shield blocked the kernel boss!"); SFX.hint(); return; }
    const fell = toppleNachos();
    livesRef.current -= 1; setLives(livesRef.current);
    showFlash("👊 The kernel boss smashed through! −1 life" + (fell ? " · Nacho tower toppled!" : ""), true);
    SFX.wrong(); buzz([120, 60, 120]);
    if (livesRef.current <= 0) finishRef.current?.();
  };
  // Box office jackpot: three reels spin; three of a kind wins big.
  const spinJackpot = () => {
    const pick = () => JACKPOT_SYMBOLS[Math.floor(Math.random() * JACKPOT_SYMBOLS.length)];
    const a = pick(), b = Math.random() < 0.5 ? a : pick(), c = Math.random() < 0.5 ? a : pick();
    const reels = [a, b, c];
    const same = a === b && b === c ? 3 : a === b || b === c || a === c ? 2 : 1;
    const key = ++idRef.current;
    setJackpot({ key, reels, win: same, done: false });
    showFlash("🎰 Box office jackpot! Spinning…");
    setTimeout(() => {
      if (!aliveRef.current) return;
      const now = Date.now();
      const dbl = boostRef.current?.type === "double" && now <= boostRef.current.until ? 2 : 1;
      let pts = same === 3 ? 25 : same === 2 ? 8 : 3, extra = "";
      if (same === 3) {
        if (a === "popcorn") { frenzyUntilRef.current = now + FRENZY_MS; setFrenzy(true); extra = " + Popcorn Frenzy"; }
        if (a === "ticket") { boostRef.current = { type: "vip", until: now + VIP_MS }; setBoost(boostRef.current);
          for (const p of itemsRef.current) if (ARCADE_KIND[p.kind]?.bad && !p.boss) { p.kind = "popcorn"; p.label = "Popcorn"; p.vip = true; } extra = " + VIP"; }
        if (a === "reel") { if (livesRef.current < ARCADE_LIVES) { livesRef.current += 1; setLives(livesRef.current); extra = " + 1 life"; } }
        if (a === "rocket") { rocketsRef.current = Math.min(ROCKET_MAX, rocketsRef.current + 1); setRockets(rocketsRef.current); extra = " + a rocket"; }
        SFX.complete(); buzz([20, 30, 20, 30, 60]);
      } else SFX.badge();
      scoreRef.current += pts * dbl; setScore(scoreRef.current);
      showFlash(same === 3 ? `🎰 JACKPOT! Blockbuster! +${pts * dbl}${extra}` : same === 2 ? `🎬 Two of a kind: a hit! +${pts * dbl}` : `🎬 Box office flop… +${pts * dbl}`);
      setJackpot((j) => (j && j.key === key ? { ...j, done: true } : j));
      setTimeout(() => setJackpot((j) => (j && j.key === key ? null : j)), 1400);
    }, 1700);
  };
  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => setShake(null), 500);
    return () => clearTimeout(t);
  }, [shake]);
  useEffect(() => {
    if (!toppled) return;
    const t = setTimeout(() => setToppled(null), 800);
    return () => clearTimeout(t);
  }, [toppled]);

  const catchItem = (it) => {
    const active = boostRef.current && Date.now() <= boostRef.current.until ? boostRef.current.type : null;
    const info = ARCADE_KIND[it.kind] || {};
    if (info.good) {
      const now = Date.now();
      const c = comboRef.current + 1;
      comboRef.current = c;
      setCombo(c);
      // Buttered catches score double (owner pick 2026-11-06).
      const buttered = butterRef.current > 0 && it.kind !== "butter";
      if (buttered) { butterRef.current -= 1; setButter(butterRef.current); }
      const mult = comboMultiplier(c) * (active === "double" ? 2 : 1) * (buttered ? 2 : 1);
      if (nachoRef.current.until > now && it.kind !== "nacho" && nachoRef.current.chips < NACHO_MAX) {
        nachoRef.current.chips += 1; setNacho({ ...nachoRef.current });
      }
      scoreRef.current += info.good * mult;
      setScore(scoreRef.current);
      SFX.comboNote(Math.min(c - 1, 14)); buzz(12);
      catchesRef.current += 1; setCatches(catchesRef.current);
      if (it.kind === "ticket") {
        // VIP screening: everything on screen, and everything that falls for 5 s, is popcorn.
        boostRef.current = { type: "vip", until: now + VIP_MS }; setBoost(boostRef.current);
        for (const p of itemsRef.current) if (ARCADE_KIND[p.kind]?.bad && !p.boss) { p.kind = "popcorn"; p.label = "Popcorn"; p.vip = true; }
        showFlash(`🎟️ Golden ticket! +${info.good * mult} · VIP: it's all popcorn!`);
        shout("VIP!", "Everything turns to popcorn");
      }
      if (it.kind === "butter") {
        butterRef.current = BUTTER_CATCHES; setButter(BUTTER_CATCHES); slideRef.current.v = 0;
        showFlash(`🧈 Buttered! The next ${BUTTER_CATCHES} catches score double… slippery!`);
        shout("2× POINTS!", `${BUTTER_CATCHES} catches · slippery!`); SFX.badge(); buzz([15, 30, 15]);
      }
      if (it.kind === "nacho") {
        nachoRef.current = { until: now + NACHO_MS, chips: 0 }; setNacho({ ...nachoRef.current });
        showFlash("🧀 Nacho tower! Stack chips, but don't let a bad bit knock it over");
        shout("NACHO TOWER!", "Stack chips · dodge bad bits", "#FFB23E"); SFX.badge(); buzz([15, 30, 15]);
      }
      if (it.kind === "canister") spinJackpot();
      if (it.kind === "reel") {
        if (livesRef.current < ARCADE_LIVES) {
          livesRef.current += 1; setLives(livesRef.current);
          showFlash(`🎞️ Film reel! +${info.good * mult} · Rewind: +1 life`);
          shout("+1 LIFE!", "Film reel rewind", "#FF8FA3");
        } else showFlash(`🎞️ Film reel! +${info.good * mult}`);
      }
      if (!it.frenzy && now >= frenzyUntilRef.current) frenzyRunRef.current += 1;
      if (frenzyRunRef.current >= FRENZY_AT) {
        frenzyRunRef.current = 0;
        frenzyUntilRef.current = now + FRENZY_MS;
        setFrenzy(true);
        showFlash("🍿 POPCORN FRENZY!");
        shout("POPCORN FRENZY!", "It's raining popcorn");
        SFX.complete(); buzz([20, 30, 20, 30, 20]);
      }
      return;
    }
    if (it.kind === "candy") {
      const options = livesRef.current < ARCADE_LIVES ? ["life", "shield", "double"] : ["shield", "double"];
      const pick = options[Math.floor(Math.random() * options.length)];
      if (pick === "life") { livesRef.current += 1; setLives(livesRef.current); showFlash("🍫 Extra life!"); shout("+1 LIFE!", "", "#FF8FA3"); }
      else {
        boostRef.current = { type: pick, until: Date.now() + BOOST_MS };
        setBoost(boostRef.current);
        showFlash(pick === "shield" ? "🍫 Shield: bad bits can't hurt you!" : "🍫 Sugar rush: double points!");
        if (pick === "shield") shout("SHIELD!", "Bad bits can't hurt you", "#9FE0FF"); else shout("2× POINTS!", "Sugar rush");
      }
      SFX.badge(); buzz([15, 30, 15]);
      return;
    }
    if (it.kind === "glasses") {
      boostRef.current = { type: "slow", until: Date.now() + SLOWMO_MS };
      setBoost(boostRef.current);
      showFlash("🕶️ 3D glasses: slow motion!");
      shout("SLOW-MO!", "3D glasses on", "#C9A7FF"); SFX.badge(); buzz([15, 30, 15]);
      return;
    }
    if (it.kind === "slushie") {
      freezeUntilRef.current = Date.now() + FREEZE_MS; setFrozen(true);
      showFlash("🥶 Brain freeze! Bad bits frozen solid");
      shout("BRAIN FREEZE!", "Bad bits frozen solid", "#9FE0FF"); SFX.badge(); buzz([15, 30, 15]);
      return;
    }
    if (it.kind === "gummy") {
      gummyUntilRef.current = Date.now() + GUMMY_MS; setWide(true);
      showFlash("🪱 Sour power! Mega bucket");
      shout("DOUBLE BUCKET!", "Twice the catch", "#8CF07A"); SFX.badge(); buzz([15, 30, 15]);
      return;
    }
    if (it.kind === "licorice") {
      // Lasso the nearest good pieces (up to 3) straight into the bucket.
      const H = arenaRef.current?.clientHeight || 500;
      const bx = bucketXRef.current ?? 0, by = H - BUCKET_H + 18;
      const goods = itemsRef.current.filter((p) => ARCADE_KIND[p.kind]?.good && !p.bounced)
        .sort((p, q) => Math.hypot(p.x - bx, p.y - by) - Math.hypot(q.x - bx, q.y - by)).slice(0, LICORICE_PULLS);
      itemsRef.current = itemsRef.current.filter((p) => !goods.includes(p));
      const lid = ++idRef.current;
      setLassos((ls) => [...ls, { id: lid, from: { x: bx, y: by }, to: goods.map((p) => ({ x: p.x, y: p.y })) }]);
      setTimeout(() => setLassos((ls) => ls.filter((l) => l.id !== lid)), 600);
      showFlash(goods.length ? `🍬 Yee-haw! Licorice lasso` : "🍬 Licorice lasso… nothing to rope");
      shout("YEE-HAW!", goods.length ? "Licorice lasso" : "Nothing to rope…", "#FF6B6B");
      SFX.badge(); buzz([15, 30, 15]);
      goods.forEach((p) => catchItem(p));
      return;
    }
    if (it.kind === "jaw") {
      jawRef.current = 1; setJaw(1);
      showFlash("🍭 Jawbreaker! The next bad bit bounces off");
      shout("BOUNCE!", "Next bad bit bounces off", "#FF9BE0"); SFX.badge(); buzz([15, 30, 15]);
      return;
    }
    if (it.kind === "rocket") {
      rocketsRef.current = Math.min(ROCKET_MAX, rocketsRef.current + 1); setRockets(rocketsRef.current);
      showFlash("🚀 Rocket loaded! Tap to launch");
      shout("ROCKET!", "Tap to launch"); SFX.badge(); buzz([15, 30, 15]);
      return;
    }
    if (it.kind === "clapper") {
      laserRef.current = { charges: LASER_MAX, nextAt: 0 }; setLaser(LASER_MAX);
      showFlash("🎬 Action! Laser fully charged");
      shout("ACTION!", "Laser fully charged"); SFX.clap?.(); buzz([15, 30, 15]);
      return;
    }
    // A jawbreaker in the bucket: this bad piece bounces off and nothing is lost.
    if (jawRef.current > 0) {
      jawRef.current = 0; setJaw(0);
      it.bounced = true; it.vy = -0.55; it.vx = (it.x < (arenaRef.current?.clientWidth || 360) / 2 ? -1 : 1) * 0.28;
      showFlash("🍭 BOING! Bounced right off"); SFX.hint(); buzz(20);
      return "bounce";
    }
    // A bad piece: the combo breaks, and a life is lost unless shielded.
    comboRef.current = 0; setCombo(0); frenzyRunRef.current = 0;
    if (active === "shield") { showFlash("🛡️ Blocked!"); SFX.hint(); return; }
    const fell = toppleNachos();
    livesRef.current -= 1;
    setLives(livesRef.current);
    showFlash(({ burnt: "Burnt! −1 life", unpopped: "Unpopped! −1 life", phone: "📵 Phones off in the theatre! −1 life", bat: "🦇 Bitten! −1 life" }[it.kind] || "Ouch! −1 life") + (fell ? " · Nacho tower toppled!" : ""), true);
    // Negative haptic: a long, harsh double buzz (Android; iPhones don't allow web vibration).
    SFX.wrong(); buzz([120, 60, 120]);
    if (livesRef.current <= 0) finishRef.current?.();
  };

  const best = loadPrizes().best || 0;
  const mult = comboMultiplier(combo);
  return (
    <div style={{minHeight:"100dvh",...CHECKER_BG,color:T.textOnDark,position:"relative",overflow:"hidden",boxSizing:"border-box",
      boxShadow:frenzy && !reducedMotion ? "inset 0 0 60px 10px rgba(255,216,77,0.55)" : "none",transition:"box-shadow 0.3s ease",
      // Camera shake on each speed-up (two identical keyframes so it restarts every time).
      animation:levelUp && levelUp.lv > 1 && !reducedMotion ? `${levelUp.lv % 2 ? "arcadeShakeA" : "arcadeShakeB"} 0.45s ease` : "none"}}>
      {phase === "lobby" && (
        <button onClick={onBack} aria-label="Back" style={{position:"absolute",top:20,left:16,zIndex:5,...BTN.cyan,padding:"8px 14px"}}>
          <span style={{...WHITE_STICKER_TEXT,fontSize:11,textTransform:"uppercase"}}>← Back</span>
        </button>
      )}
      <div style={{maxWidth:402,margin:"0 auto",padding:"72px 16px 24px",textAlign:"center"}}>
        {phase === "playing"
          ? <div style={{...WHITE_STICKER_TEXT,fontSize:24,textTransform:"uppercase"}}>Popcorn Panic</div>
          : <div style={{display:"flex",justifyContent:"center",marginTop:phase === "done" ? -34 : -40,marginBottom:phase === "done" ? 10 : 0}}><PopcornPanicLogo height={phase === "done" ? 128 : 150}/></div>}
        {phase === "lobby" && (
          <div style={{marginTop:14}}>
            {/* Owner decision 2026-10-25: no rules or prize list up front; players learn by playing
                and prizes are revealed only when won. */}
            <div style={{width:96,height:96,margin:"6px auto 14px"}}><ArcadeItemArt kind="popcorn" variant={1}/></div>
            <p style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:700,margin:"0 0 16px"}}>The popcorn machine has gone rogue!</p>
            <button onClick={start} disabled={passes < 1} aria-label="Play Popcorn Panic"
              style={{...BTN.primary,width:"100%",padding:"14px 0",opacity:passes < 1 ? 0.5 : 1,cursor:passes < 1 ? "not-allowed" : "pointer"}}>
              <span style={{...WHITE_STICKER_TEXT,fontSize:14,textTransform:"uppercase"}}>{passes > 0 ? "Play" : "Locked"}</span>
            </button>
            <div aria-label="Arcade passes" style={{...YELLOW_STICKER_TEXT,fontSize:12,marginTop:10,textTransform:"uppercase",lineHeight:1.5}}>
              {passes > 0 ? `You have ${passes} play${passes === 1 ? "" : "s"}` : "🔒 Solve 5 mashups in a row in Standard or Speed Run to unlock a play"}
            </div>
            {best > 0 && <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,marginTop:8,opacity:0.85}}>Best score: {best}</div>}
            <CurtainPicker/>
          </div>
        )}
        {/* In-play HUD (owner 2026-11-05: symbols were tiny, and lost lives as black hearts read
            as nonsense): bigger icons and numbers, and a lost life is a faded, empty heart. */}
        {phase === "playing" && (
          <div style={{display:"flex",justifyContent:"center",gap:6,margin:"10px 0",flexWrap:"nowrap"}}>
            <div style={ARCADE_PILL}><span aria-label={`Score: ${score}`} style={ARCADE_PILL_TEXT}><span style={ARCADE_PILL_ICON}>🍿</span>{score}</span></div>
            <div style={ARCADE_PILL}><span aria-label={`Lives: ${lives}`} style={{display:"flex",gap:1}}><ArcadeHearts lives={lives} size={15}/></span></div>
            <div style={ARCADE_PILL}><span aria-label={`Speed ${level}`} style={ARCADE_PILL_TEXT}><span style={ARCADE_PILL_ICON}>⏩</span>{level}</span></div>
            <div style={ARCADE_PILL}><span aria-label={`Time left: ${timeLeft}`} style={{...ARCADE_PILL_TEXT,color:timeLeft <= 10 ? "#FF6B6B" : "#FFFFFF"}}><span style={ARCADE_PILL_ICON}>⏱️</span>{timeLeft}</span></div>
            <div style={ARCADE_PILL}><span aria-label={`Laser charges: ${laser}`} style={{...ARCADE_PILL_TEXT,gap:1}}><span style={ARCADE_PILL_ICON}>🔫</span>
              {Array.from({length:LASER_MAX}).map((_, i) => <span key={i} style={{fontSize:13,opacity:i < laser ? 1 : 0.25,filter:i < laser ? "none" : "grayscale(1)"}}>⚡</span>)}</span></div>
          </div>
        )}
        {phase === "playing" && (
          <div style={{minHeight:20,display:"flex",justifyContent:"center",gap:10}}>
            {rockets > 0 && <span aria-label={`Rockets: ${rockets}`} style={{...YELLOW_STICKER_TEXT,fontSize:12,textTransform:"uppercase"}}>🚀 ×{rockets} tap to launch</span>}
            {mult > 1 && <span aria-label={`Combo ×${mult}`} style={{...YELLOW_STICKER_TEXT,fontSize:13}}>×{mult} combo</span>}
            {boost && <span aria-label="Active boost" style={{...YELLOW_STICKER_TEXT,fontSize:12,textTransform:"uppercase"}}>{boost.type === "shield" ? "🛡️ Shield" : boost.type === "slow" ? "🕶️ Slow-mo" : boost.type === "vip" ? "🎟️ VIP" : "⚡ Double"}</span>}
            {frozen && <span aria-label="Brain freeze" style={{...YELLOW_STICKER_TEXT,fontSize:12,textTransform:"uppercase",color:"#9FE0FF"}}>🥶 Freeze</span>}
            {wide && <span aria-label="Mega bucket" style={{...YELLOW_STICKER_TEXT,fontSize:12,textTransform:"uppercase"}}>🪱 Mega</span>}
            {butter > 0 && <span aria-label={`Buttered catches: ${butter}`} style={{...YELLOW_STICKER_TEXT,fontSize:12,textTransform:"uppercase"}}>🧈 ×2 for {butter}</span>}
            {nacho && <span aria-label={`Nacho chips: ${nacho.chips}`} style={{...YELLOW_STICKER_TEXT,fontSize:12,textTransform:"uppercase",color:"#FFB23E"}}>🧀 {nacho.chips} chip{nacho.chips === 1 ? "" : "s"}</span>}
          </div>
        )}
        {phase === "playing" && flash && (
          <div key={flash.key} role="status" aria-label="Arcade event" style={{...WHITE_STICKER_TEXT,fontSize:flash.text.includes("FRENZY")?20:14,marginTop:6,color:flash.bad?"#FFB4B4":"#fff",animation:reducedMotion?"none":"fadeIn 0.25s ease both"}}>
            {flash.text}
          </div>
        )}
        {phase === "done" && result && (
          <div role="status" aria-label="Arcade result" style={{position:"relative",marginTop:6,padding:"16px 14px 18px",background:T.bgDeep,border:"2px solid #1C1D21",borderRadius:14,boxShadow:T.shadow}}>
            {result.isRecord && !reducedMotion && (
              <LottieOverlay src={LOTTIE_ASSETS.roundWin} loop={false} style={{position:"absolute",left:"50%",top:-60,width:280,height:280,transform:"translateX(-50%)",pointerEvents:"none",opacity:0.8}}/>
            )}
            {result.isRecord && (
              <div aria-label="New record" style={{...YELLOW_STICKER_TEXT,fontSize:22,textTransform:"uppercase",marginBottom:8,animation:reducedMotion?"none":"titlePop 0.5s ease both"}}>🏆 New record!</div>
            )}
            {/* The final tally (owner 2026-11-05): big, labelled numbers instead of tiny pills. */}
            <div aria-label={`Score: ${result.score}`} style={{display:"flex",flexDirection:"column",alignItems:"center",margin:"2px 0 12px"}}>
              <span style={{...YELLOW_STICKER_TEXT,fontSize:52,lineHeight:1}}>{result.score}</span>
              <span style={{...WHITE_STICKER_TEXT,fontSize:12,letterSpacing:"0.12em",marginTop:4}}>POINTS</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:8,marginBottom:14}}>
              <ResultTile label="Survived" ariaLabel={`Survived ${result.seconds} seconds`}><span style={ARCADE_TILE_VALUE}>0:{String(result.seconds).padStart(2, "0")}</span></ResultTile>
              <ResultTile label="Top speed" ariaLabel={`Top speed ${result.level}`}><span style={ARCADE_TILE_VALUE}>⏩{result.level}</span></ResultTile>
              <ResultTile label="Lives left" ariaLabel={`Lives: ${lives}`}><ArcadeHearts lives={lives} size={17}/></ResultTile>
            </div>
            <div style={{...YELLOW_STICKER_TEXT,fontSize:16,textTransform:"uppercase"}}>
              {result.prize ? `${result.prize.emoji} ${result.prize.name}!` : "No prize this time"}
            </div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,margin:"8px 0 14px"}}>
              {result.reason === "time" ? "Time's up! You lasted all 45 seconds." : `Out of lives after ${result.seconds} second${result.seconds === 1 ? "" : "s"}!`} You scored {result.score} point{result.score === 1 ? "" : "s"}.
              {result.prize ? ` You won ${result.prize.reward} to use in Standard or Speed Run.` : " Keep popping!"}
              {result.prize && result.isNew && CURTAINS.some((c) => c.prize === result.prize.id) ? ` New curtains unlocked: ${CURTAINS.find((c) => c.prize === result.prize.id).name} (choose them on the Popcorn Panic screen).` : ""}
            </div>
            <button onClick={onBack} style={{...BTN.cyan,width:"100%",padding:"12px 0"}}>
              <span style={{...WHITE_STICKER_TEXT,fontSize:12,textTransform:"uppercase"}}>{embedded ? "Back to the game" : "Done"}</span>
            </button>
          </div>
        )}
      </div>
      {/* Post-credits scene (owner pick 2026-11-06): sometimes the T-rex sweeps up after the show. */}
      {phase === "done" && postCredits && (
        <div role="img" aria-label="Post-credits scene" style={{position:"absolute",left:-150,bottom:6,width:130,height:122,pointerEvents:"none",zIndex:1,
          animation:reducedMotion ? "none" : "janitorWalk 9s linear 1.2s both"}}>
          <img src={`${ARCADE_ART}trex-janitor.webp`} alt="" draggable="false" style={{width:"100%",height:"100%",objectFit:"contain",
            animation:reducedMotion ? "none" : "janitorBob 0.5s ease-in-out infinite"}}/>
        </div>
      )}
      {phase === "playing" && (
        <div ref={arenaRef} aria-label="Popcorn arena"
          onPointerDown={onArenaDown} onPointerMove={(e) => moveBucket(e.clientX)} onPointerUp={onArenaUp}
          style={{position:"absolute",left:0,right:0,top:210,bottom:0,touchAction:"none",overflow:"hidden",cursor:"grab",
            animation:shake && !reducedMotion ? `${shake.key % 2 ? "arcadeShakeA" : "arcadeShakeB"} 0.45s ease` : "none"}}>
          {items.map((it) => {
            const size = it.boss ? BOSS_SIZE : it.kind === "unpopped" ? 36 : ARCADE_IMG_KINDS[it.kind] ? 56 : 46;
            return (
            <div key={it.id} role="img" aria-label={it.label} data-boss-hp={it.boss ? it.hp : undefined}
              style={{position:"absolute",left:it.x - size / 2,top:it.y - size / 2,
                width:size,height:size,pointerEvents:"none",zIndex:it.boss ? 3 : undefined,
                transform:it.boss ? "none" : `rotate(${ARCADE_IMG_KINDS[it.kind] ? Math.sin(it.angle / 40) * 18 : it.angle}deg)`,filter:it.frozen ? "drop-shadow(0 0 6px #9FE0FF) saturate(0.4) brightness(1.15) hue-rotate(170deg)" : "drop-shadow(0 3px 0 rgba(28,29,33,0.6))"}}>
              {it.boss ? (
                <div key={`${it.variant}-${it.hitAt}`} style={{width:"100%",height:"100%",animation:reducedMotion ? "none" : it.hitAt ? "bossHit 0.35s ease-out both" : "bossSway 1.6s ease-in-out infinite"}}>
                  <ArcadeItemArt kind="boss" variant={it.variant}/>
                </div>
              ) : <ArcadeItemArt kind={it.kind} color={it.color} variant={it.variant}/>}
              {it.frozen && <span aria-hidden="true" style={{position:"absolute",inset:-4,borderRadius:12,background:"rgba(170,230,255,0.35)",border:"2px solid rgba(220,245,255,0.9)"}}/>}
            </div>
            );
          })}
          {beams.map((b) => (
            <div key={b.id} data-laser="" aria-hidden="true" style={{position:"absolute",left:b.x - 4,top:0,bottom:BUCKET_H - 8,width:8,borderRadius:4,
              background:"linear-gradient(90deg, rgba(255,40,80,0.2), #FF2E63 30%, #FFF 50%, #FF2E63 70%, rgba(255,40,80,0.2))",
              boxShadow:"0 0 14px 4px rgba(255,46,99,0.7)",pointerEvents:"none",animation:reducedMotion ? "none" : "laserBeam 0.22s ease-out both"}}/>
          ))}
          {rocketShots.map((r) => (
            <div key={r.id} data-rocket-shot="" aria-hidden="true" style={{position:"absolute",left:r.x,top:r.y,width:0,height:0,pointerEvents:"none",zIndex:4}}>
              {!reducedMotion && <img src="/stickers/rocket/exhaust.webp" alt="" draggable="false" style={{position:"absolute",left:-ROCKET_ART.exhaustFlameX,top:ROCKET_ART.rocketH * 0.3,
                width:ROCKET_ART.exhaustW,height:ROCKET_ART.exhaustH,transformOrigin:`${ROCKET_ART.exhaustFlameX}px 0`,animation:"exhaustPuff 0.7s ease-out both"}}/>}
              <img src="/stickers/rocket/rocket.webp" alt="" draggable="false" style={{position:"absolute",left:0,top:0,width:ROCKET_ART.rocketW,height:ROCKET_ART.rocketH,
                "--dx":`${r.dx}px`,"--dy":`${r.dy}px`,"--rot":`${r.rot}deg`,transform:"translate(-50%,-50%)",
                animation:reducedMotion ? "none" : `rocketFlight ${ROCKET_FLIGHT_MS}ms cubic-bezier(.5,0,.9,.6) both`}}/>
            </div>
          ))}
          {lassos.map((l) => (
            <svg key={l.id} aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:4,overflow:"visible"}}>
              {l.to.map((t, i) => (
                <g key={i}>
                  <path d={`M${l.from.x} ${l.from.y} Q${(l.from.x + t.x) / 2 + 30} ${(l.from.y + t.y) / 2} ${t.x} ${t.y}`} fill="none" stroke="#1C1D21" strokeWidth="7" strokeLinecap="round"
                    pathLength="1" strokeDasharray="1" style={{animation:"lassoLine 0.6s ease-out both"}}/>
                  <path d={`M${l.from.x} ${l.from.y} Q${(l.from.x + t.x) / 2 + 30} ${(l.from.y + t.y) / 2} ${t.x} ${t.y}`} fill="none" stroke="#D3122F" strokeWidth="4" strokeLinecap="round"
                    pathLength="1" strokeDasharray="1" style={{animation:"lassoLine 0.6s ease-out both"}}/>
                  <circle cx={t.x} cy={t.y} r="16" fill="none" stroke="#D3122F" strokeWidth="3.5" style={{animation:"lassoLine 0.6s ease-out both"}}/>
                </g>
              ))}
            </svg>
          ))}
          {booms.map((b) => b.big ? (
            <div key={b.id} data-boom="big" aria-hidden="true" style={{position:"absolute",left:b.x,top:b.y,width:0,height:0,pointerEvents:"none",zIndex:4}}>
              <img src="/stickers/rocket/explosion.webp" alt="" draggable="false" style={{position:"absolute",left:0,top:0,width:ROCKET_RADIUS * 2.7,height:"auto",
                transform:"translate(-50%,-50%)",animation:reducedMotion ? "none" : "bigBoom 0.85s ease-out both"}}/>
            </div>
          ) : (
            <div key={b.id} data-boom="" aria-hidden="true" style={{position:"absolute",left:b.x,top:b.y,width:0,height:0,pointerEvents:"none",zIndex:4}}>
              <svg viewBox="0 0 100 100" width={b.big ? ROCKET_RADIUS * 2.1 : 96} height={b.big ? ROCKET_RADIUS * 2.1 : 96} style={{position:"absolute",left:0,top:0,animation:reducedMotion ? "none" : "boomBurst 0.55s ease-out both",transform:"translate(-50%,-50%)"}}>
                <polygon points="50,2 61,32 95,22 70,48 98,70 64,68 58,98 46,70 14,92 30,62 2,50 30,38 12,10 42,30" fill="#FF7A1A" stroke="#1C1D21" strokeWidth="2.5" strokeLinejoin="round"/>
                <polygon points="50,20 57,38 78,34 64,50 80,64 60,62 54,80 46,64 26,74 36,56 20,48 38,42 28,24 46,36" fill="#FFD84D"/>
                <circle cx="50" cy="50" r="9" fill="#FFF8E6"/>
              </svg>
              {!reducedMotion && [0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <span key={a} style={{position:"absolute",left:0,top:0,width:7,height:7,borderRadius:"50%",background:a % 90 ? "#FFD84D" : "#FF5A1F",
                  "--dx":`${Math.cos(a * Math.PI / 180) * 54}px`,"--dy":`${Math.sin(a * Math.PI / 180) * 54}px`,animation:"boomSpark 0.5s ease-out both"}}/>
              ))}
            </div>
          ))}
          {/* Every 5 seconds it speeds up (owner request 2026-10-26: no "levels" wording): a
              fast-forward symbol with anime speed lines, while the screen shakes. */}
          {levelUp && levelUp.lv > 1 && (
            <div key={levelUp.key} role="status" aria-label="Speeding up" style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:5}}>
              {!reducedMotion && (
                <div style={{position:"absolute",inset:"-20%",
                  background:"repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0) 0deg 3deg, #FFFFFF 3deg 4.6deg, rgba(255,255,255,0) 4.6deg 7deg, #1C1D21 7deg 7.8deg, rgba(255,255,255,0) 7.8deg 11deg, #FFE9A8 11deg 12.2deg)",
                  WebkitMaskImage:"radial-gradient(circle at 50% 50%, transparent 0 22%, #000 50%)",maskImage:"radial-gradient(circle at 50% 50%, transparent 0 22%, #000 50%)",
                  animation:"speedLines 0.9s ease-out both"}}/>
              )}
              {/* A VCR fast-forward key being pressed again and again (owner request 2026-10-26). */}
              <div style={{position:"absolute",left:"50%",top:"38%",width:150,height:110,marginLeft:-75,marginTop:-55,animation:reducedMotion ? "none" : "speedSymbol 1.1s ease both"}}>
                <div style={{position:"absolute",inset:0,borderRadius:12,background:"#2A2D35",border:"3px solid #0B0C10",boxShadow:"inset 0 2px 0 rgba(255,255,255,0.18)"}}/>
                <div data-vhs-key="" style={{position:"absolute",left:16,right:16,top:12,height:72,borderRadius:8,border:"3px solid #0B0C10",
                  background:"linear-gradient(180deg,#D9DCE3 0%,#AEB3BE 100%)",boxShadow:"0 7px 0 #0B0C10",
                  display:"flex",alignItems:"center",justifyContent:"center",animation:reducedMotion ? "none" : "vhsPress 0.28s steps(1) infinite"}}>
                  <svg viewBox="0 0 60 30" width="64" height="32" aria-hidden="true"><path d="M4 2 L28 15 L4 28 Z M30 2 L54 15 L30 28 Z" fill="#1C1D21"/></svg>
                </div>
                <div style={{position:"absolute",left:0,right:0,bottom:4,textAlign:"center",fontFamily:FONT_FIGMA_STICKER,fontSize:10,letterSpacing:"0.2em",color:"#C9CCD3"}}>FF</div>
              </div>
            </div>
          )}
          {/* Learn the laser by doing (owner question 2026-10-26: how would anyone know?): until the
              first zap of each play, the lowest bad piece gets a target and a "tap" bubble. */}
          {!zapLearned && (() => {
            const target = items.filter((it) => ARCADE_KIND[it.kind]?.bad && it.y > 30).sort((a, b) => b.y - a.y)[0];
            if (!target) return null;
            return (
              <div aria-label="Zap coach" role="status" style={{position:"absolute",left:target.x,top:target.y,width:0,height:0,pointerEvents:"none",zIndex:4}}>
                <div style={{position:"absolute",left:0,top:0,width:66,height:66,borderRadius:"50%",border:"3px dashed #FF2E63",boxShadow:"0 0 10px rgba(255,46,99,0.8)",
                  transform:"translate(-50%,-50%)",animation:reducedMotion ? "none" : "zapCoach 0.8s ease-in-out infinite"}}/>
                <div style={{position:"absolute",left:Math.max(72 - target.x, Math.min(0, (arenaRef.current?.clientWidth || 402) - 72 - target.x)),top:-58,transform:"translateX(-50%)",whiteSpace:"nowrap",padding:"4px 10px",borderRadius:10,
                  background:"#FF2E63",border:"2px solid #1C1D21",...WHITE_STICKER_TEXT,fontSize:12,textTransform:"uppercase"}}>Tap it to zap it! 🔫</div>
              </div>
            );
          })()}
          <div aria-hidden="true" style={{position:"absolute",width:1,height:1,overflow:"hidden",opacity:0,pointerEvents:"none"}}>
            {["arm-hold", "arm-empty", "rocket", "exhaust", "explosion"].map((n) => <img key={n} src={`/stickers/rocket/${n}.webp`} alt="" width="1" height="1"/>)}
          </div>
          {burn && (
            <div key={burn.key} data-film-burn="" aria-label="Film burn" role="img" style={{position:"absolute",left:burn.x,top:burn.y,width:0,height:0,pointerEvents:"none",zIndex:2}}>
              <svg viewBox="-100 -100 200 200" width={BURN_R * 2.7} height={BURN_R * 2.7}
                style={{position:"absolute",left:0,top:0,overflow:"visible",animation:reducedMotion ? "none" : `burnLife ${BURN_MS}ms ease-in-out both`,transform:"translate(-50%,-50%)"}}>
                <defs>
                  <filter id={`burn-edge-${burn.key}`} x="-30%" y="-30%" width="160%" height="160%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed={burn.key % 97}/>
                    <feDisplacementMap in="SourceGraphic" scale="34" xChannelSelector="R" yChannelSelector="G"/>
                  </filter>
                  <radialGradient id={`burn-glow-${burn.key}`}>
                    <stop offset="0" stopColor="#FFFFFF"/><stop offset="0.42" stopColor="#FFF7DA"/><stop offset="0.56" stopColor="#FFD45C"/>
                    <stop offset="0.66" stopColor="#FF8A1F"/><stop offset="0.74" stopColor="#C2380E"/><stop offset="0.8" stopColor="#3B1606"/>
                    <stop offset="0.9" stopColor="#1C0C04" stopOpacity="0.85"/><stop offset="1" stopColor="#1C0C04" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <g filter={`url(#burn-edge-${burn.key})`} style={{animation:reducedMotion ? "none" : "burnFlicker 0.18s steps(2) infinite"}}>
                  <circle r="78" fill={`url(#burn-glow-${burn.key})`}/>
                </g>
              </svg>
            </div>
          )}
          {/* Coming attractions: a marquee banner across the top while corn dogs rain. The game keeps
              running underneath (owner feedback 2026-11-07), and the banner stays up the whole rain. */}
          {trailer && (() => {
            const BW = 330, BH = 92, bulbs = [];
            const per = 2 * (BW + BH), n = 32;
            for (let i = 0; i < n; i++) {
              let d = (i / n) * per, x, y;
              if (d < BW) { x = d; y = 0; } else if ((d -= BW) < BH) { x = BW; y = d; } else if ((d -= BH) < BW) { x = BW - d; y = BH; } else { d -= BW; x = 0; y = BH - d; }
              bulbs.push([x, y]);
            }
            return (
              <div key={trailer.key} role="status" aria-label="Coming attractions" style={{position:"absolute",left:"50%",top:12,width:BW,height:BH,zIndex:6,pointerEvents:"none",
                transform:"translateX(-50%)",animation:reducedMotion ? "none" : `bannerIn 0.5s cubic-bezier(.3,1.4,.5,1) both, trailerOut ${TRAILER_RAIN_MS}ms ease both`}}>
                <div style={{position:"absolute",inset:0,borderRadius:16,background:"linear-gradient(180deg,#C8173A 0%,#8E0C25 100%)",
                  border:"4px solid #1C1D21",boxShadow:"inset 0 0 0 5px #E9B23A, inset 0 0 0 8px #1C1D21, 0 6px 0 #1C1D21, 0 12px 26px rgba(0,0,0,0.45)"}}/>
                {bulbs.map(([x, y], i) => (
                  <span key={i} aria-hidden="true" style={{position:"absolute",left:x - 4.5,top:y - 4.5,width:9,height:9,borderRadius:"50%",border:"1.5px solid #1C1D21",
                    background:"#FFF6C2",animation:reducedMotion ? "none" : `${i % 2 ? "bulbA" : "bulbB"} 0.36s steps(1) infinite`}}/>
                ))}
                <img src={`${ARCADE_ART}corn-dog.webp`} alt="" draggable="false" style={{position:"absolute",left:12,top:8,width:76,height:76,objectFit:"contain",
                  filter:"drop-shadow(0 3px 0 rgba(0,0,0,0.45))",animation:reducedMotion ? "none" : "cornDogIn 0.55s cubic-bezier(.3,1.4,.5,1) 0.2s both, cornDogDance 0.5s ease-in-out 0.75s infinite"}}/>
                <div style={{position:"absolute",left:92,right:16,top:12,bottom:12,display:"flex",flexDirection:"column",justifyContent:"center",gap:3,textAlign:"left"}}>
                  <div style={{...YELLOW_STICKER_TEXT,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",whiteSpace:"nowrap"}}>★ Coming attractions ★</div>
                  <div style={{...WHITE_STICKER_TEXT,fontSize:15,lineHeight:1.1,textTransform:"uppercase",animation:reducedMotion ? "none" : "comingLine 0.5s ease-out 0.25s both"}}>{trailer.lines[0]}</div>
                  <div style={{...YELLOW_STICKER_TEXT,fontSize:13,lineHeight:1.1,textTransform:"uppercase",animation:reducedMotion ? "none" : "comingLine 0.5s ease-out 0.9s both"}}>{trailer.lines[1]}</div>
                </div>
              </div>
            );
          })()}
          {trex && (() => {
            const roar = trex.stage !== "peek";
            const h = roar ? 200 : 196, w = roar ? h * 520 / 408 : h * 482 / 520;
            return (
              <div key={trex.key} role="img" aria-label={roar ? "T-rex roaring" : "T-rex peeking"} data-trex={trex.stage}
                style={{position:"absolute",top:"20%",[trex.side]:0,width:w,height:h,zIndex:5,pointerEvents:"none",transform:trex.side === "right" ? "scaleX(-1)" : "none"}}>
                {roar && !reducedMotion && trex.stage === "roar" && [0, 1, 2, 3, 4].map((i) => (
                  <span key={i} aria-hidden="true" style={{position:"absolute",left:w * 0.72,top:h * 0.4,width:640,height:640,borderRadius:"50%",
                    border:"14px solid #FFFFFF",boxShadow:"0 0 0 5px #FFD84D, inset 0 0 0 5px #FFD84D, 0 0 30px 8px rgba(255,255,255,0.6)",
                    clipPath:"polygon(50% 50%, 100% 8%, 100% 92%)",animation:`soundWave 0.85s cubic-bezier(.2,.7,.4,1) ${i * 0.16}s both`}}/>
                ))}
                <img src={`${ARCADE_ART}${roar ? "trex-roar" : "trex-peek"}.webp`} alt="" draggable="false"
                  style={{position:"absolute",left:0,top:0,width:w,height:h,filter:"drop-shadow(0 4px 0 rgba(28,29,33,0.5))",
                    animation:reducedMotion ? "none" : trex.stage === "peek" ? `trexPeek ${TREX_PEEK_MS}ms cubic-bezier(.3,1.2,.5,1) both`
                      : trex.stage === "roar" ? "trexRoar 0.6s ease-out both" : "trexLeave 0.45s ease-in both"}}/>
              </div>
            );
          })()}
          {jackpot && (
            <div key={jackpot.key} role="status" aria-label={jackpot.done ? `Jackpot: ${jackpot.reels.join(", ")}` : "Jackpot spinning"}
              style={{position:"absolute",left:"50%",top:14,zIndex:6,pointerEvents:"none",padding:"8px 10px 10px",borderRadius:16,
                background:"linear-gradient(180deg,#FFE27A,#E7A51C)",border:"3px solid #1C1D21",
                animation:reducedMotion ? "none" : `jackpotIn 0.35s cubic-bezier(.3,1.5,.5,1) both${jackpot.done && jackpot.win === 3 ? ", jackpotWin 0.5s ease-in-out infinite" : ""}`,
                transform:"translateX(-50%)"}}>
              <img src={`${ARCADE_ART}film-canister.webp`} alt="" draggable="false" style={{position:"absolute",left:-30,top:-26,width:58,height:54,transform:"rotate(-14deg)"}}/>
              <div style={{display:"flex",gap:6}}>
                {jackpot.reels.map((sym, i) => {
                  const strip = [...Array.from({length:7}, (_, k) => JACKPOT_SYMBOLS[(k + i * 2 + jackpot.key) % JACKPOT_SYMBOLS.length]), sym];
                  return (
                    <div key={i} style={{width:52,height:52,overflow:"hidden",borderRadius:9,background:"#FFF8E6",border:"2.5px solid #1C1D21",boxShadow:"inset 0 6px 8px rgba(0,0,0,0.25)"}}>
                      <div style={{"--end":`${-(strip.length - 1) * 52}px`,transform:`translateY(${-(strip.length - 1) * 52}px)`,
                        animation:reducedMotion ? "none" : `reelStop ${0.9 + i * 0.35}s cubic-bezier(.15,.6,.25,1.06) both`}}>
                        {strip.map((k, j) => <div key={j} style={{width:52,height:52,padding:7,boxSizing:"border-box"}}><ArcadeItemArt kind={k} variant={j}/></div>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {toppled && !reducedMotion && Array.from({length:toppled.chips}).map((_, i) => (
            <img key={`${toppled.key}-${i}`} src={`${ARCADE_ART}nacho-chip.webp`} alt="" aria-hidden="true" draggable="false"
              style={{position:"absolute",left:toppled.x - 24,bottom:BUCKET_H + i * 12,width:48,height:45,pointerEvents:"none",zIndex:4,
                "--dx":`${(i % 2 ? 1 : -1) * (60 + i * 18)}px`,"--dy":`${-40 + i * 25}px`,"--rot":`${(i % 2 ? 1 : -1) * (200 + i * 40)}deg`,
                animation:"chipFly 0.75s cubic-bezier(.2,.7,.4,1) both"}}/>
          ))}
          {callout && (
            <div key={callout.key} role="status" aria-label={`Power-up: ${callout.big}`} style={{position:"absolute",left:0,right:0,top:"34%",zIndex:8,pointerEvents:"none",
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,textAlign:"center",
              animation:reducedMotion ? "none" : `calloutLife ${CALLOUT_MS}ms ease both`}}>
              <div style={{...WHITE_STICKER_TEXT,fontSize:callout.big.length > 12 ? 30 : 40,lineHeight:1,color:callout.color,letterSpacing:"0.02em",whiteSpace:"nowrap",
                WebkitTextStroke:"2px #1C1D21",textShadow:"0 5px 0 #1C1D21, 2px 2px 0 #1C1D21, -2px -2px 0 #1C1D21, 2px -2px 0 #1C1D21, -2px 2px 0 #1C1D21",animation:reducedMotion ? "none" : "calloutPop 0.45s cubic-bezier(.3,1.6,.5,1) both"}}>{callout.big}</div>
              {callout.small && <div style={{...WHITE_STICKER_TEXT,fontSize:15,textTransform:"uppercase",animation:reducedMotion ? "none" : "comingLine 0.4s ease-out 0.15s both"}}>{callout.small}</div>}
            </div>
          )}
          {/* The butter trail: overlapping blobs share one outline, so they read as a single smear. */}
          {smears.length > 0 && (
            <div aria-hidden="true" style={{position:"absolute",left:0,right:0,bottom:0,height:40,zIndex:3,pointerEvents:"none",
              filter:"drop-shadow(1.5px 0 0 #1C1D21) drop-shadow(-1.5px 0 0 #1C1D21) drop-shadow(0 1.5px 0 #1C1D21) drop-shadow(0 -1.5px 0 #1C1D21)"}}>
              {smears.map((m) => (
                <Fragment key={m.id}>
                  <span data-smear="" style={{position:"absolute",left:m.x - m.w / 2,bottom:2 + m.lift,width:m.w,height:m.h,borderRadius:m.shape,
                    background:"linear-gradient(180deg, #FFF09A 0%, #FFF09A 38%, #FFD43B 38%, #FFC72C 100%)",animation:reducedMotion ? "none" : "smearFade 1.5s ease-in both"}}>
                    <span style={{position:"absolute",left:`${m.shine.at * 100}%`,top:1,width:`${m.shine.len * 100}%`,height:Math.max(1.5, m.h * 0.28),borderRadius:99,background:"#FFFFFF"}}/>
                  </span>
                  {m.drop && <span style={{position:"absolute",left:m.x + m.drop.dx - m.drop.d / 2,bottom:2 + m.drop.dy,width:m.drop.d,height:m.drop.d * 0.7,borderRadius:"50%",
                    background:"#FFD43B",animation:reducedMotion ? "none" : "smearFade 1.5s ease-in both"}}/>}
                </Fragment>
              ))}
            </div>
          )}
          {/* Glints sit outside the outlined layer so they stay pure white sparkles. */}
          {smears.filter((m) => m.glint).map((m) => (
            <span key={`g${m.id}`} aria-hidden="true" style={{position:"absolute",left:m.x - 6,bottom:6 + m.lift + m.h,width:12,height:12,zIndex:3,pointerEvents:"none",
              background:"#FFFFFF",filter:"drop-shadow(0 0 3px #FFE97A)",clipPath:"polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%)",
              animation:reducedMotion ? "none" : "butterGlint 0.9s ease-in-out both"}}/>
          ))}
          {bucketX !== null && <PopcornBox x={bucketX} charged={laser > 0} catches={catches} reducedMotion={reducedMotion} wide={wide} launch={launch} jaw={jaw > 0}
            buttered={butter > 0} chips={nacho ? nacho.chips : 0}/>}
          {bucketX !== null && showSlideHint && (
            <div aria-hidden="true" style={{position:"absolute",left:bucketX,bottom:BUCKET_H + 14,transform:"translateX(-50%)",...WHITE_STICKER_TEXT,fontSize:13,whiteSpace:"nowrap",pointerEvents:"none",animation:reducedMotion?"none":"pulse 1.2s ease-in-out infinite"}}>
              ← slide · tap to zap →
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 
// HANGMAN TITLE — dashes that reveal as films are found
// 
function HangmanTitle({card, found, guesses=[], reducedMotion=false, peek=false}) {
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

  // Naming a film shows its part of the title (owner report 2026-10-25: "good fellas" turned
  // green but showed nothing in "Goodfellowship"). Words of a named film open whole title words
  // they equal, and the shared start or end (4+ letters) of a blended word.
  const filmPartSet = new Set();
  {
    const clean = (t) => t.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9 ]/g, " ");
    const filmWords = new Set();
    card.movies.forEach((m, i) => {
      if (!found[i]) return;
      const ws = clean(m).split(" ").filter(Boolean);
      ws.forEach((w) => filmWords.add(w));
      filmWords.add(ws.join(""));
    });
    if (filmWords.size) {
      let pos = 0;
      title.split(" ").forEach((w) => {
        const idx = [];
        for (let k = 0; k < w.length; k++) if (/[a-z0-9]/i.test(w[k])) idx.push(pos + k);
        const wl = idx.map((k) => title[k].toLowerCase()).join("");
        filmWords.forEach((fw) => {
          if (fw === wl) { idx.forEach((k) => filmPartSet.add(k)); return; }
          if (fw.length < 4 || wl.length < 4) return;
          let p = 0; while (p < fw.length && p < wl.length && fw[p] === wl[p]) p++;
          if (p >= 4) idx.slice(0, p).forEach((k) => filmPartSet.add(k));
          let q = 0; while (q < fw.length && q < wl.length && fw[fw.length - 1 - q] === wl[wl.length - 1 - q]) q++;
          if (q >= 4) idx.slice(idx.length - q).forEach((k) => filmPartSet.add(k));
        });
        pos += w.length + 1;
      });
    }
  }

  // Popcorn Peek: every third letter or digit of the title (3rd, 6th, 9th...).
  const peekSet = new Set();
  if (peek) {
    let n = 0;
    for (let i = 0; i < title.length; i++) if (/[a-z0-9]/i.test(title[i]) && ++n % 3 === 0) peekSet.add(i);
  }

  function shouldReveal(charIdx) {
    if (found[0] && found[1]) return true;          // solved: show the whole title
    if (peekSet.has(charIdx) || filmPartSet.has(charIdx)) return true;
    // Each part of a joined word reveals on its own (owner report 2026-10-26: typing "off"
    // showed all of "Scarface/Off" without solving it).
    const re = /[a-z0-9'’]+/gi;
    let m;
    while ((m = re.exec(title))) {
      if (charIdx >= m.index && charIdx < m.index + m[0].length) {
        return normWord(m[0]).split(" ").filter(Boolean).map(normalizeToken).some((token) => typed.has(token));
      }
    }
    return false;
  }

  const allRevealed = found[0] && found[1];

  // Tiles flip over one by one when a guess reveals them, each with a rising tick
  // (owner request 2026-10-22). Tiles already showing when a card opens don't animate.
  const revealedKey = Array.from(title).map((_, i) => (shouldReveal(i) ? "1" : "0")).join("");
  const prevRevealRef = useRef(null);
  const [freshOrder, setFreshOrder] = useState({});
  // Bounce wave when the card is solved while on screen (not when an already-solved card opens).
  const [solvedWave, setSolvedWave] = useState(false);
  const wasSolvedRef = useRef(null);
  useEffect(() => {
    const was = wasSolvedRef.current;
    wasSolvedRef.current = { cardId: card.id, solved: allRevealed };
    setSolvedWave(!!was && was.cardId === card.id && !was.solved && allRevealed);
  }, [allRevealed, card.id]);
  useLayoutEffect(() => {
    const prev = prevRevealRef.current;
    prevRevealRef.current = { cardId: card.id, key: revealedKey };
    if (!prev || prev.cardId !== card.id || reducedMotion) { setFreshOrder({}); return; }
    const order = {};
    let n = 0;
    for (let i = 0; i < revealedKey.length; i++) {
      if (revealedKey[i] === "1" && prev.key[i] !== "1" && /[a-z0-9]/i.test(title[i])) order[i] = n++;
    }
    if (n === 0) return;
    setFreshOrder(order);
    for (let k = 0; k < Math.min(n, 12); k++) SFX.tileTick(k, Math.min(k * 45, 900) / 1000);
    if (found[0] && found[1]) return; // solved: the win flip uses this list to the end
    const id = setTimeout(() => setFreshOrder({}), Math.min(n * 45, 900) + 500);
    return () => clearTimeout(id);
  }, [revealedKey, card.id, reducedMotion]);

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
                // Solved: white tiles flip one by one and come back showing the letter in green
                // (#15803D, contrast about 5:1 on white). The colour changes at the half-turn.
                color: allRevealed ? "#15803D" : T.textPrimary,
                textTransform:"uppercase",
                transition:"color 0.25s ease",
                // Letters found earlier turn from dark to green at the half-turn; letters not found
                // yet stay hidden until the half-turn and appear already green.
                animation: allRevealed && solvedWave && !reducedMotion
                  ? `${freshOrder[word.start + ci] !== undefined ? "tileWinFlipNew" : "tileWinFlipOld"} 0.42s ease-in-out ${Math.min((word.start + ci) * 45, 900)}ms both`
                  : freshOrder[word.start + ci] !== undefined
                    ? `tileFlip 0.42s cubic-bezier(.2,1.3,.4,1) ${Math.min(freshOrder[word.start + ci] * 45, 900)}ms both`
                    : "none",
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
function HintsModal({card, hintsRevealed, onReveal, onClose, hintAnimationSrc, reducedMotion=false, transitionFamily=TRANSITION_FAMILIES.punchy,
  powerups=null, peekUsed=false, freeHints=[], onFreeHint, onPeek, pointsLeft=Infinity}) {
  // A hint that would spend the card's last points would end the card on the spot
  // (it looked like the game skipped it, owner report 2026-11-02), so it is blocked.
  const unaffordable = (cost) => pointsLeft <= cost;
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
  const whisperRevealed = hintsRevealed.includes("whisper");
  const whisperText = card.hints?.[0] ? maskTitleWords(card.hints[0], card) : null;
  const yearGenreOff = yearGenreRevealed || unaffordable(HINT_TIERS[0].rewardPenalty);
  const whisperOff = whisperRevealed || unaffordable(HINT_TIERS[2].rewardPenalty);
  const actorsOff = actorsRevealed || unaffordable(HINT_TIERS[1].rewardPenalty);
  const noPts = (revealed, cost) => !revealed && unaffordable(cost) ? " · over budget" : "";

  const revealWithFx = (tierId) => {
    if (tierId === HINT_TIERS[1].id) SFX.rip();
    setRecentlyUnlocked(tierId);
    onReveal(tierId);
  };

  useEffect(() => {
    if (!recentlyUnlocked) return;
    const id = setTimeout(() => setRecentlyUnlocked(null), 560);
    return () => clearTimeout(id);
  }, [recentlyUnlocked]);

  // Owner 2026-11-05: the hint sheet was "lame and tame". It is now a studio's secret script
  // notes: each film is a kraft-paper reel card, locked clues are blacked-out REDACTED bars,
  // and the Director's Whisper is a speech bubble from the director's megaphone.
  const Redacted = ({w = 190}) => (
    <span aria-hidden="true" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:w,height:20,background:"#141418",borderRadius:2,transform:"rotate(-0.6deg)",
      boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.06)"}}>
      <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:8.5,letterSpacing:"0.22em",color:"#E8344E"}}>REDACTED</span>
    </span>
  );
  const FilmBoxes = ({i}) => {
    const f = hd?.films?.[i];
    const pulse = (id) => !reducedMotion && recentlyUnlocked===id ? "vaultUnlockPulse 0.48s ease" : "none";
    const line = {fontFamily:FONT_FIGMA_STICKER,fontSize:13,color:"#2B1E14",lineHeight:1.2,textAlign:"center"};
    return (
      <div style={{position:"relative",margin:"0 auto 14px",width:"94%",transform:`rotate(${i ? 1.6 : -1.6}deg)`,filter:"drop-shadow(0 4px 0 #1C1D21)"}}>
        <div style={{position:"relative",background:"linear-gradient(180deg,#E4D3AE,#D3BD93)",padding:"10px 26px 12px",WebkitMask:TICKET_EDGES,mask:TICKET_EDGES,display:"flex",flexDirection:"column",alignItems:"center",gap:7}}>
          <div style={{position:"absolute",inset:"5px 11px",border:"2px solid #B0463E",borderRadius:3,pointerEvents:"none"}}/>
          <div style={{fontFamily:FONT_FIGMA_STICKER,fontSize:10,color:"#B0463E",letterSpacing:"0.12em"}}>REEL {i+1}</div>
          <div style={{...line,animation:pulse(HINT_TIERS[0].id)}}>
            {yearGenreRevealed&&f ? `${f.year} ${f.genre.toUpperCase()}` : <Redacted/>}
          </div>
          <div style={{position:"relative",width:"100%",display:"flex",justifyContent:"center",overflow:"hidden",animation:pulse(HINT_TIERS[1].id)}}>
            {/* Owner request 2026-10-26: "SPOILER" tape rips off the Lead Actors as they're revealed. */}
            {actorsRevealed && recentlyUnlocked===HINT_TIERS[1].id && !reducedMotion && (
              <div data-spoiler-tape="" aria-hidden="true" style={{position:"absolute",inset:0,zIndex:2,pointerEvents:"none"}}>
                {[["8%","spoilerTear"],["46%","spoilerTearL"]].map(([top,anim])=>(
                  <div key={anim} style={{position:"absolute",left:-16,right:-16,top,height:15,display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                    background:"#FFD84D",borderTop:"2px solid #1C1D21",borderBottom:"2px solid #1C1D21",animation:`${anim} 0.55s ease-in both`}}>
                    {[0,1,2].map(k=><span key={k} style={{fontFamily:FONT_FIGMA_STICKER,fontSize:8.5,color:"#1C1D21",letterSpacing:"0.08em"}}>SPOILER</span>)}
                  </div>
                ))}
              </div>
            )}
            {actorsRevealed&&f
              ? <span style={{...line,position:"relative",zIndex:1,display:"inline-block",animation:!reducedMotion && recentlyUnlocked===HINT_TIERS[1].id ? "tapePeelReveal 0.45s ease" : "none"}}>★ {f.actors[0].toUpperCase()} ★</span>
              : <Redacted w={150}/>}
          </div>
        </div>
      </div>
    );
  };

  // A clue button: icon chip on the left, a tilted price-tag sticker on the right.
  const ClueButton = ({onClick, off, done, bg, icon, label, cost, warn}) => (
    <button onClick={onClick} disabled={off}
      style={{...BTN.cyan,background:bg,opacity:off&&!done?0.45:1,cursor:off?"not-allowed":"pointer",padding:"9px 10px 9px 8px",display:"flex",alignItems:"center",gap:10,textAlign:"left",
        ...(done ? {filter:"saturate(0.55)"} : {})}}>
      <span aria-hidden="true" style={{flex:"none",width:34,height:34,borderRadius:"50%",background:"#FFF8E6",border:"2px solid #1C1D21",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,lineHeight:1}}>{icon}</span>
      <span style={{...WHITE_STICKER_TEXT,flex:1,fontSize:12.5,letterSpacing:"0.03em",textTransform:"uppercase",lineHeight:1.15}}>{label}{done?" ✓":""}{warn}</span>
      <span style={{flex:"none",fontFamily:FONT_FIGMA_STICKER,fontSize:12,color:"#1C1D21",background:done?"#B9B4D6":"#FFD84D",border:"2px solid #1C1D21",borderRadius:"4px 12px 12px 4px",padding:"5px 8px 5px 12px",transform:"rotate(4deg)",position:"relative",textShadow:"none"}}>
        <span aria-hidden="true" style={{position:"absolute",left:4,top:"50%",width:5,height:5,marginTop:-2.5,borderRadius:"50%",background:"#1C1D21"}}/>
        -{cost}
      </span>
    </button>
  );

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
        <div style={{width:"100%",maxHeight:"85vh",overflowY:"auto",overflowX:"hidden",...SUNBURST_BG,border:`2px solid ${T.border}`,borderRadius:T.rXl,boxShadow:"0 6px 0 #1C1D21, 0 18px 40px rgba(0,0,0,0.45)",padding:"58px 18px 22px",animation:reducedMotion?"none":transitionFamily.hintIn,position:"relative",transformOrigin:"50% 100%"}}>
        <button onClick={onClose} aria-label="Close hints" style={{position:"absolute",top:14,right:14,width:30,height:30,background:"#4845F3",border:`2px solid ${T.border}`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <IconX size={11}/>
        </button>
        <div style={{position:"relative",textAlign:"center",marginBottom:18}}>
          <div style={{...YELLOW_STICKER_TEXT,fontSize:20,textTransform:"uppercase",lineHeight:1.05}}>Hints</div>
          <div style={{...POPUP_PLAIN_WHITE_TEXT,fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:6,opacity:0.9}}>Leaked script notes. Every peek costs the studio.</div>
          <div aria-hidden="true" style={{position:"absolute",left:-2,top:-34,transform:"rotate(-10deg)",border:"2.5px solid #E8344E",borderRadius:5,padding:"3px 8px",fontFamily:FONT_FIGMA_STICKER,fontSize:10,letterSpacing:"0.1em",color:"#E8344E",background:"rgba(255,255,255,0.08)"}}>TOP SECRET</div>
        </div>

        <FilmBoxes i={0}/>
        <FilmBoxes i={1}/>
        {whisperText && (
          <div style={{display:"flex",alignItems:"flex-start",gap:8,margin:"4px 0 4px"}}>
            <span aria-hidden="true" style={{flex:"none",fontSize:30,lineHeight:1,marginTop:8,transform:"scaleX(-1)",filter:"drop-shadow(0 2px 0 #1C1D21)"}}>📣</span>
            <div aria-label="Director's Whisper" style={{position:"relative",flex:1,background:whisperRevealed?"#FFF8E6":"#2A2440",border:"2px solid #1C1D21",borderRadius:14,boxShadow:"0 3px 0 #1C1D21",padding:"10px 12px",minHeight:20,
              animation:!reducedMotion && recentlyUnlocked==="whisper" ? "vaultUnlockPulse 0.48s ease" : "none"}}>
              <span aria-hidden="true" style={{position:"absolute",left:-9,top:16,width:14,height:14,background:whisperRevealed?"#FFF8E6":"#2A2440",borderLeft:"2px solid #1C1D21",borderBottom:"2px solid #1C1D21",transform:"rotate(45deg)"}}/>
              {!whisperRevealed && <div aria-hidden="true" style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"center",gap:6,padding:"0 14px"}}>
                {["92%","70%"].map(w=><span key={w} style={{display:"block",width:w,height:9,background:"#141418",borderRadius:2}}/>)}
              </div>}
              <span style={{position:"relative",fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,lineHeight:1.4,color:T.textPrimary,visibility:whisperRevealed?"visible":"hidden"}}>
                {whisperText}
              </span>
            </div>
          </div>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:16}}>
          <ClueButton onClick={()=>revealWithFx(HINT_TIERS[0].id)} off={yearGenreOff} done={yearGenreRevealed} bg="#1FB5D8" icon="📅"
            label="Year & Genre" cost={money(1)} warn={noPts(yearGenreRevealed,HINT_TIERS[0].rewardPenalty)}/>
          {whisperText && (
            <ClueButton onClick={()=>revealWithFx("whisper")} off={whisperOff} done={whisperRevealed} bg="#8F7BFD" icon="📣"
              label="Director's Whisper" cost={money(2)} warn={noPts(whisperRevealed,HINT_TIERS[2].rewardPenalty)}/>
          )}
          <ClueButton onClick={()=>revealWithFx(HINT_TIERS[1].id)} off={actorsOff} done={actorsRevealed} bg="#F2569B" icon="⭐"
            label="Lead Actors" cost={money(3)} warn={noPts(actorsRevealed,HINT_TIERS[1].rewardPenalty)}/>
          {powerups && (powerups.hint>0 || powerups.peek>0 || freeHints.length>0 || peekUsed) && (
            <div style={{marginTop:6,paddingTop:12,borderTop:"1px dashed rgba(255,255,255,0.35)",display:"flex",flexDirection:"column",gap:8}}>
              <div style={{...YELLOW_STICKER_TEXT,fontSize:11,textAlign:"center",textTransform:"uppercase"}}>Arcade power-ups</div>
              {(() => {
                // With every hint already shown there is nothing for it to reveal: say so and keep
                // it for a later card (owner report 2026-10-26: it looked clickable but did nothing).
                const nothingLeft = yearGenreRevealed && actorsRevealed && (whisperRevealed || !whisperText);
                const usable = powerups.hint > 0 && !nothingLeft;
                return (
                  <button onClick={onFreeHint} disabled={!usable}
                    aria-label={`Use a Free Hint (${powerups.hint} left)`}
                    style={{...BTN.cyan,background:"#FFD84D",padding:"11px 0",opacity:usable?1:0.4,cursor:usable?"pointer":"not-allowed"}}>
                    <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:11.5,color:"#1C1D21",textTransform:"uppercase"}}>
                      {nothingLeft && powerups.hint > 0 ? `🎟️ Free Hint · no hints left to reveal · saved for later (${powerups.hint})` : `🎟️ Free Hint · next hint costs 0 pts · ${powerups.hint} left`}
                    </span>
                  </button>
                );
              })()}
              <button onClick={onPeek} disabled={!powerups.peek || peekUsed}
                aria-label={`Use a Popcorn Peek (${powerups.peek} left)`}
                style={{...BTN.cyan,background:"#FFF8E6",padding:"11px 0",opacity:powerups.peek && !peekUsed?1:0.4,cursor:powerups.peek && !peekUsed?"pointer":"not-allowed"}}>
                <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:11.5,color:"#1C1D21",textTransform:"uppercase"}}>🍿 Popcorn Peek · every 3rd letter{peekUsed?" ✓":""} · {powerups.peek} left</span>
              </button>
            </div>
          )}
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
  // Power-ups used on this card: hints revealed for free, and the Popcorn Peek.
  const [freeHints,setFreeHints]=useState(initialState?.freeHints||[]);
  const [peek,setPeek]=useState(!!initialState?.peek);
  const [phase,setPhase]=useState("playing");
  const [skipped,setSkipped]=useState(false);
  const [showSkipConfirm,setShowSkipConfirm]=useState(false);
  // The run's studio budget at the start of the current card ($M).
  const [budget,setBudget]=useState(initialState?.budget ?? STARTING_BUDGET);
  const [timeLeft,setTimeLeft]=useState(initialState?.timeLeft ?? (mode.timeLimit||0));
  const [timedOut,setTimedOut]=useState(false);
  const [showHints,setShowHints]=useState(false);
  const [showMissShake, setShowMissShake] = useState(false);
  const [cardTransitionPhase, setCardTransitionPhase] = useState("in"); // in | out | idle
  const [genreTransition, setGenreTransition] = useState(null);
  const recentSwapKindsRef = useRef([]);
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
  // The typing box is "docked" when it is pinned against the bottom button bar
  // (short screens); it then gets a backdrop so the plot scrolls cleanly behind it.
  const guessDockRef=useRef(null);
  const footerBarRef=useRef(null);
  // The letter tiles: after each guess the page scrolls them into view (owner request 2026-10-22).
  const hangmanRef=useRef(null);
  const [guessDocked,setGuessDocked]=useState(false);
  const [results,setResults]=useState(initialState?.results||[]);
  const [totalScore,setTotalScore]=useState(initialState?.totalScore||0);
  const [streak,setStreak]=useState(()=>loadStreak());
  const prevFoundRef=useRef([false,false]);
  // Set once a round's result has been applied, so a double tap on Next
  // (the button stays on screen during the card transition) can't apply it twice.
  const resultAppliedRef=useRef(false);
  // Correct guesses in a row on this card climb a musical scale; a miss resets it.
  const comboRef=useRef(0);
  const speedrunDeadlineRef=useRef(null);
  const speedrunRafRef=useRef(null);
  // Cinema extras: Speed Run countdown, clapperboard takes, popcorn meter, badges, Daily curtains.
  const [countingDown,setCountingDown]=useState(()=>!!mode.timeLimit && !initialState);
  const [whichFirst,setWhichFirst]=useState(null); // "Which came first?" bonus answer: {pick, correct}
  const [audience,setAudience]=useState(null);     // {key, mood: "cheer"|"groan"}
  const [usher,setUsher]=useState(null);
  const [boo,setBoo]=useState(null); // 3rd wrong guess: the crowd boos and throws a tomato
  const [clapper,setClapper]=useState(null);
  const clapperTimerRef=useRef(null);
  const [popKey,setPopKey]=useState(0);
  const [badgeToast,setBadgeToast]=useState(null);
  // 5 in a row earns a Popcorn Panic play; on Next the player chooses to play it now or keep guessing.
  const [arcadeOffer,setArcadeOffer]=useState(null); // null | {stage:"ask"|"playing", badges}
  const badgeToastTimerRef=useRef(null);
  const [themedWeek]=useState(()=>activeHoliday());
  const [dailyLine]=useState(()=>mode.isDaily && !initialState ? pickRandom("trailer", themedWeek?.lines || TRAILER_OPENERS) : null);

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
  // Rewinding shows an earlier card as it ended; these flags pick its labels.
  const pastWon = isRoundSolved(pastResult);
  // A skip is a forfeit, not a pause: the moment you skip, the card is done —
  // no re-attempting it for score later, even if points were left on it.
  const pastSkipped = !!(pastResult && pastResult.skipped);
  // Owner decision (2026-10-19): every earlier card is view-only on rewind. Replaying an
  // unsolved card never recorded a result, so it is no longer offered.
  const viewOnly = rewindIdx!==null;
  const isRewound = rewindIdx!==null;
  const found=checkGuesses(guesses,card.movies,card.aliases||[[],[]],card.mashedTitle||"");
  const titleFullyRevealed = areAllMashedTitleWordsGuessed(guesses, card.mashedTitle || "", card.movies, found);
  // Solved must come from real movie-title or mashed-title matches only.
  // Completing all meaningful mashed-title words should also complete the round.
  const both=(found[0]&&found[1]) || titleFullyRevealed;
  const effectiveFound = both ? [true, true] : found;
  const guessStates = guesses.map(g => guessClassification(g, card));
  const wrongGuessCount=guessStates.filter(state=>state==="miss").length;

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
  // Each wrong guess uses one of the card's guesses; each wrong word in it costs a point.
  const wrongWordPenalty=guesses.reduce((sum,g)=>sum+guessPenalty(g, card),0);
  // currentReward is the run's budget left after this card's spending so far.
  const currentReward=calcReward(hintsRevealed.filter((id)=>!freeHints.includes(id)),filmFoundByIndividualGuessCount,wrongWordPenalty,budget);
  const rewardSpent = !both && currentReward <= 0;
  // Owner decision 2026-11-04: no guess limit. Spending the last of the budget is GAME OVER.
  const cardLost=!both&&rewardSpent;
  const over=both||cardLost;
  const tension=mode.difficultyPacing==="escalating"?marathonTension(cardIdx,deck.length):0;
  const accent=tension>0.6?`hsl(${Math.round(20-tension*20)},88%,56%)`:mode.accentColor;
  const isLast=cardIdx===deck.length-1;
  // "In a row" means in a row: a lost or skipped card drops it to 0 straight away.
  const runStreak=isRewound ? trailingSolvedStreak(results, cardIdx)
    : (cardLost || skipped) ? 0
    : trailingSolvedStreak(results, cardIdx) + (both ? 1 : 0);
  // The button art shows the two original hints left; the Whisper is extra.
  const artHintCount = hintsRevealed.filter((id)=>id!=="whisper").length;
  const hintButtonSrc = artHintCount===0
    ? "/design-reference/Guess%20button-2.svg" // 2/2
    : artHintCount===1
      ? "/design-reference/Guess%20button-1.svg" // 1/2
      : "/design-reference/Guess%20button.svg"; // 0/2
  // A finished card shows the points it actually scored (0 if lost or skipped).
  const liveCardPts = viewOnly && pastResult
    ? (typeof pastResult.reward === "number" ? pastResult.reward : 0)
    : currentReward;
  const allowSingleLetterY = card.movies.some((m) => normWord(m) === "y tu mama tambien");

  useEffect(() => {
    if (reducedMotion) {
      setCardTransitionPhase("idle");
      return;
    }
    setCardTransitionPhase("in");
    comboRef.current=0;
    setBadgeToast(null);
    const settle = setTimeout(() => setCardTransitionPhase("idle"), 440);
    return () => clearTimeout(settle);
  }, [activeIdx, reducedMotion]);

  // Sound on new find
  useEffect(()=>{
    const prev=prevFoundRef.current;
    const newFind=found.some((f,i)=>f&&!prev[i]);
    if(newFind){ SFX.pop(); buzz(25); setPopKey(k=>k+1); }
    prevFoundRef.current=found;
  },[found[0],found[1]]);

  // Auto-save
  useEffect(()=>{
    if(phase==="playing" && rewindIdx===null) {
      saveSession({modeName:mode.label,modeId:mode.id,cardIdx,guesses,hintsRevealed,freeHints,peek,results,totalScore,budget,timeLeft,deckLen:deck.length,deck});
    }
  },[cardIdx,guesses,hintsRevealed,freeHints,peek,results,totalScore,budget,timeLeft,phase,rewindIdx,mode.label,mode.id,deck.length,deck]);

  useEffect(()=>{
    if(isRewound || !over || phase!=="playing") return;
    const nextPhase = "result";
    // Owner request 2026-10-25: hold a solved card ~1.6 s so the green title wave can be seen
    // (reduce-motion: shorter); a lost card ~1 s.
    const delay = both ? (reducedMotion ? 700 : 1600) : 1000;
    const timerId = setTimeout(()=>setPhase(nextPhase), delay);
    return () => clearTimeout(timerId);
  },[over,phase,isRewound,both,reducedMotion]);

  const handleGuess=(g)=>{
    if(cardLost||both||viewOnly) return;
    const state = guessClassification(g, card);
    if(state==="match"){ SFX.comboNote(comboRef.current); comboRef.current+=1; }
    if(state==="miss"){
      comboRef.current=0;
      SFX.wrong();
      buzz([30,50,30]);
      // The 3rd wrong guess on a card: the crowd boos and throws a tomato (instead of the clapper).
      const endsCard = guessPenalty(g, card) >= currentReward;
      if(wrongGuessCount+1 === 3 && !endsCard && !reducedMotion){
        SFX.boo(); SFX.splat(0.95);
        setBoo({key:Date.now()});
      }
      // The next take, unless this miss spent the card's last points.
      else if(!endsCard){
        SFX.clap();
        setClapper({key:Date.now(), take:wrongGuessCount+2, note:pickRandom("directorNote", DIRECTOR_NOTES)});
        if (clapperTimerRef.current) clearTimeout(clapperTimerRef.current);
        clapperTimerRef.current = setTimeout(() => setClapper(null), 1400);
      }
      if (!reducedMotion) {
        setShowMissShake(false);
        if (missShakeTimerRef.current) clearTimeout(missShakeTimerRef.current);
        requestAnimationFrame(() => setShowMissShake(true));
        missShakeTimerRef.current = setTimeout(() => setShowMissShake(false), 380);
      }
    }
    setGuesses(p=>[...p,g]);
    // After the tiles update, bring them into view if they are off screen or hidden
    // behind the pinned typing box, so the player sees what the guess revealed.
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const el=hangmanRef.current; if(!el) return;
      const r=el.getBoundingClientRect();
      const viewH=window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const dock=guessDockRef.current ? guessDockRef.current.getBoundingClientRect().top : viewH;
      const visibleBottom=Math.min(viewH, dock);
      if(r.top>=8 && r.bottom<=visibleBottom) return;
      window.scrollBy({top:r.top-12, behavior:reducedMotion?"auto":"smooth"});
    }));
  };

  const runCardSwap = (commit) => {
    if (reducedMotion) {
      commit();
      return;
    }
    const transitionMeta = GENRE_TRANSITION_META[transitionFamily.name] || GENRE_TRANSITION_META.punchy;
    // Two card changes, picked at random but never the same one three times running
    // (owner request 2026-10-26): the "5, 4, blip!" leader or the film-reel run.
    // Four card changes, picked at random but never the same one twice in a row
    // (owner requests 2026-10-26): countdown, iris wipe, film reel, clapperboard slam.
    const KINDS = ["leader", "iris", "reel", "clapper"];
    const recent = recentSwapKindsRef.current;
    let kind = KINDS[Math.min(KINDS.length - 1, Math.floor(Math.random() * KINDS.length))];
    if (recent[0] === kind) kind = KINDS[(KINDS.indexOf(kind) + 1) % KINDS.length];
    const forced = readJSON("plotmix_force_card_change", null); // lets the tests pick one
    if (KINDS.includes(forced)) kind = forced;
    recentSwapKindsRef.current = [kind, ...recent].slice(0, 2);
    if (kind === "reel") SFX.projector();
    if (kind === "iris") SFX.iris();
    if (kind === "clapper") SFX.slate();
    setGenreTransition({
      kind,
      scene: cardIdx + 2, // the card about to show, numbered from 1 (fixed now, before the card changes)
      nonce: Date.now(),
      name: transitionFamily.name,
      tag: transitionMeta.tag,
      emoji: transitionMeta.emoji,
      anim: transitionMeta.anim,
    });
    if (genreTransitionTimerRef.current) clearTimeout(genreTransitionTimerRef.current);
    genreTransitionTimerRef.current = setTimeout(() => setGenreTransition(null),
      { reel: FILM_REEL_MS, leader: LEADER_BLIP_MS, iris: IRIS_MS, clapper: CLAPPER_SLAM_MS }[kind]);

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
    // Never let a paid hint spend the card's last points: that ends the card at once.
    const tier=HINT_TIERS.find(t=>t.id===tierId);
    if(tier && currentReward<=tier.rewardPenalty) return;
    setHintsRevealed(p=>[...p,tierId]);
    SFX.hint();
  };

  const powerupsAllowed = !mode.isDaily;
  const handleFreeHint=()=>{
    if(!powerupsAllowed||both||cardLost||viewOnly) return;
    const order=["metadata","whisper","actors"].filter((id)=>id!=="whisper"||card.hints?.[0]);
    const next=order.find((id)=>!hintsRevealed.includes(id));
    if(!next||!usePowerup("hint")) return;
    setFreeHints(p=>[...p,next]);
    setHintsRevealed(p=>[...p,next]);
    SFX.badge();
    setShowHints(false); // close the hints so the power-up can be seen working (owner request 2026-10-26)
  };
  const handlePeek=()=>{
    if(!powerupsAllowed||peek||both||cardLost||viewOnly||!usePowerup("peek")) return;
    setPeek(true);
    SFX.pop();
    setShowHints(false);
  };

  const handleSkip=()=>{
    if(viewOnly||isRewound) return;
    setBudget(currentReward); // skipping is free, but what this card already spent stays spent
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

    // Only solving the current card stops its clock. Viewing an earlier card
    // (rewind) must not pause it, or players get unlimited thinking time.
    const currentCardSolved = both && rewindIdx===null;
    if(phase!=="playing" || currentCardSolved || countingDown){
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
        // Time ran out on the current card: bring the player back to it first.
        if(rewindIdx!==null) goToCard(cardIdx);
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
  },[phase,both,mode.timeLimit,timeLeft,cardIdx,rewindIdx,countingDown]);

  const goToCard=(target)=>{
    setCardStates(prev=>({...prev,[activeIdx]:{guesses,hintsRevealed,freeHints,peek}}));
    const st=cardStates[target]||(results[target]?{guesses:results[target].guessList||[],hintsRevealed:results[target].hintList||[]}:{guesses:[],hintsRevealed:[]});
    setGuesses(st.guesses); setHintsRevealed(st.hintsRevealed); setFreeHints(st.freeHints||[]); setPeek(!!st.peek);
    setShowHints(false);
    setShowSkipConfirm(false);
    setPhase("playing");
    setRewindIdx(target===cardIdx?null:target);
  };
  const canRewind = activeIdx>0;
  const showRewindButton = activeIdx>0;
  const skipEnabled = !mode.isDaily;
  const footerBackgroundSrc = showRewindButton
    ? (artHintCount===0 ? "/design-reference/Group%2097.svg" : artHintCount===1 ? "/design-reference/Group%20102.svg" : "/design-reference/Group%20103.svg")
    : (artHintCount===0 ? "/design-reference/Group%2098.svg" : artHintCount===1 ? "/design-reference/Group%20100.svg" : "/design-reference/Group%20101.svg");
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

  useEffect(()=>{
    if(phase==="result") resultAppliedRef.current=false;
  },[phase]);

  const handleResultNext=()=>{
    if(resultAppliedRef.current) return;
    resultAppliedRef.current=true;
    if(skipped){
      const skipResult={card,found:[false,false],solved:false,guesses:guesses.length,wrongList:guesses.filter((g,i)=>guessStates[i]==="miss"),hints:hintsRevealed.length,guessList:[...guesses],hintList:[...hintsRevealed],pts:0,reward:currentReward,skipped:true};
      const nextResults = upsertRoundResult(results, cardIdx, skipResult);
      if(isLast){
        clearSession(mode.id);
        const dailyReplay = mode.isDaily && !completeDaily(totalScore, buildShareText(mode, nextResults, totalScore), nextResults);
        onComplete(nextResults,totalScore,streak,{dailyReplay});
        return;
      }
      runCardSwap(() => {
        setResults(nextResults);
        setCardIdx(idx=>idx+1);
        setGuesses([]); setHintsRevealed([]); setFreeHints([]); setPeek(false); setWhichFirst(null);
        setSkipped(false); setPhase("playing");
      });
      return;
    }
    const pts=calcScore(both);
    // A clean solve earns box office back (plus the bonus question), capped at the $100M max; a loss means $0 left.
    setBudget(both ? Math.min(STARTING_BUDGET, Math.max(currentReward, currentReward + roundScore + bonusPts)) : 0);

    const newStreak=updateStreak(both);
    setStreak(newStreak);
    const newTotal=totalScore+pts;
    setTotalScore(newTotal);
    const roundResult={card,found:effectiveFound,solved:both,guesses:guesses.length,wrong:wrongGuessCount,wrongList:guesses.filter((g,i)=>guessStates[i]==="miss"),peek,bonus:bonusPts,hints:hintsRevealed.length,guessList:[...guesses],hintList:[...hintsRevealed],pts,reward:currentReward};
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

    // Speed Run: each card has its own clock, and running out of time ends the run
    // (owner decision 2026-10-26).
    if(isLast||!both||timedOut){
      clearSession(mode.id);
      const dailyReplay = mode.isDaily && !completeDaily(newTotal, buildShareText(mode, nextResults, newTotal), nextResults);
      onComplete(nextResults,newTotal,newStreak,{dailyReplay});
      return;
    }
    runCardSwap(() => {
      setResults(nextResults);
      setCardIdx(idx=>idx+1);
      setGuesses([]); setHintsRevealed([]); setFreeHints([]); setPeek(false); setWhichFirst(null);
      setTimeLeft(mode.timeLimit||0); setTimedOut(false);
      speedrunDeadlineRef.current = null;
      setSkipped(false); setPhase("playing");
    });
  };

  const handleRevealDone=()=>{ setPhase("intermission"); };

  const handleIntermissionNext=()=>{
    const pts=calcScore(both);
    const roundResult={card,found:effectiveFound,solved:both,guesses:guesses.length,wrong:wrongGuessCount,wrongList:guesses.filter((g,i)=>guessStates[i]==="miss"),peek,bonus:bonusPts,hints:hintsRevealed.length,guessList:[...guesses],hintList:[...hintsRevealed],pts,reward:currentReward};
    const nextResults = upsertRoundResult(results, activeIdx, roundResult);
    if(isLast){
      clearSession(mode.id);
      const dailyReplay = mode.isDaily && !completeDaily(totalScore, buildShareText(mode, nextResults, totalScore), nextResults);
      onComplete(nextResults,totalScore,streak,{dailyReplay});
      return;
    }
    runCardSwap(() => {
      setResults(nextResults);
      setCardIdx(idx=>idx+1);
      setGuesses([]); setHintsRevealed([]); setFreeHints([]); setPeek(false); setWhichFirst(null);
      setTimeLeft(mode.timeLimit||0); setTimedOut(false);
      speedrunDeadlineRef.current = null;
      setSkipped(false); setPhase("playing");
    });
  };

  // "Which came first?" bonus (owner request 2026-10-26): +1 for naming the older film, offered
  // only after a solve with no hints or power-ups used at all.
  const filmYears=(card.hintData?.films||[]).map(f=>Number(f.year));
  const bonusEligible = both && !viewOnly && !isRewound && hintsRevealed.length===0 && !peek &&
    filmYears.length===2 && filmYears.every(Boolean) && filmYears[0]!==filmYears[1];
  const bonusPts = bonusEligible && whichFirst?.correct ? 1 : 0;
  const handleBonus=(i)=>{
    if(!bonusEligible||whichFirst) return;
    const correct = filmYears[i] < filmYears[1-i];
    setWhichFirst({pick:i, correct});
    if(correct){ SFX.correct(); buzz(15); } else { SFX.wrong(); }
  };

  // The audience only shows up for the big moments: a cheer when the card is solved and a groan
  // when it's lost (not for ordinary wrong guesses), owner request 2026-10-26.
  const prevGuessCountRef=useRef(guesses.length);
  useEffect(()=>{
    const prev=prevGuessCountRef.current;
    prevGuessCountRef.current=guesses.length;
    if(guesses.length<=prev||viewOnly) return;
    if(both) SFX.winCheer();        // "ta-da!", applause and whistles, different every time
    else if(cardLost) SFX.groan();
    if(reducedMotion) return;
    if(both) setAudience({key:Date.now(),mood:"cheer"});
    else if(cardLost) setAudience({key:Date.now(),mood:"groan"});
  },[guesses.length]);
  useEffect(()=>{
    if(!audience) return;
    const id=setTimeout(()=>setAudience(null),1700);
    return ()=>clearTimeout(id);
  },[audience]);

  // The usher: no typing or tapping for 30 seconds mid-card brings the flashlight.
  const lastActivityRef=useRef(Date.now());
  useEffect(()=>{
    // Any touch or key also sends the usher away at once (owner request 2026-10-26).
    const bump=()=>{ lastActivityRef.current=Date.now(); setUsher(null); };
    window.addEventListener("keydown",bump); window.addEventListener("pointerdown",bump); window.addEventListener("input",bump,true);
    return ()=>{ window.removeEventListener("keydown",bump); window.removeEventListener("pointerdown",bump); window.removeEventListener("input",bump,true); };
  },[]);
  useEffect(()=>{
    if(phase!=="playing"||showHints||countingDown||viewOnly) return;
    lastActivityRef.current=Date.now();
    const id=setInterval(()=>{
      if(Date.now()-lastActivityRef.current>=USHER_IDLE_MS && !document.hidden){
        lastActivityRef.current=Date.now();
        SFX.psst();
        setUsher({key:Date.now()});
      }
    },1000);
    return ()=>clearInterval(id);
  },[phase,showHints,countingDown,viewOnly,cardIdx]);
  useEffect(()=>{
    if(!boo) return;
    const id=setTimeout(()=>setBoo(null),TOMATO_MS);
    return ()=>clearTimeout(id);
  },[boo]);
  useEffect(()=>{
    if(!usher) return;
    const id=setTimeout(()=>setUsher(null),3200);
    return ()=>clearTimeout(id);
  },[usher]);

  // What the result popup counts up to: the box office a solve earns back. Only a clean solve
  // (no paid hints, no wrong words) earns it, and the budget never rises above its $100M start.
  const cleanSolve = both && wrongWordPenalty===0 && hintsRevealed.every(id=>freeHints.includes(id));
  const budgetRoom = Math.max(0, STARTING_BUDGET - currentReward);
  const roundScore = cleanSolve ? Math.min(BOX_OFFICE, budgetRoom) : 0;
  const showFooterBar = !showingResult && (!both || canReturnToCurrent);
  useEffect(()=>{
    const check=()=>{
      const dock=guessDockRef.current, bar=footerBarRef.current;
      if(!dock||!bar){ setGuessDocked(false); return; }
      setGuessDocked(dock.getBoundingClientRect().bottom >= bar.getBoundingClientRect().top - 1);
    };
    check();
    window.addEventListener("scroll",check,{passive:true});
    window.addEventListener("resize",check);
    return ()=>{ window.removeEventListener("scroll",check); window.removeEventListener("resize",check); };
  },[activeIdx,guesses.length,showFooterBar]);

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
      if (clapperTimerRef.current) clearTimeout(clapperTimerRef.current);
      if (badgeToastTimerRef.current) clearTimeout(badgeToastTimerRef.current);
    };
  }, []);

  // Badges for this card, announced the first time each is earned.
  useEffect(()=>{
    if(phase!=="result" || isRewound || skipped || timedOut || !both) return;
    const ids=[];
    if(hintCount===0) ids.push("directorsCut");
    if(currentReward===1) ids.push("plotTwist");
    if(runStreak>=5) ids.push("boxOfficeSmash");
    const fresh=earnBadges(ids);
    const earned=BADGES.filter(b=>fresh.includes(b.id));
    // Every 5 mashups in a row earns a play of Popcorn Panic: offered at once in a box that
    // stays until the player chooses (owner request 2026-10-25), with any new badges in it.
    if(runStreak>0 && runStreak % ARCADE_STREAK_FOR_PASS === 0){
      addArcadePass();
      SFX.badge();
      setArcadeOffer({stage:"ask",badges:earned});
      return;
    }
    if(!earned.length) return;
    SFX.badge();
    // New badges stay on screen until the next card.
    setBadgeToast(earned);
  },[phase]);

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

    // Safety fallback in case a device never fires video onEnded: the clip's length plus
    // generous time for a slow phone to load it.
    if (winAnimationTimerRef.current) clearTimeout(winAnimationTimerRef.current);
    winAnimationTimerRef.current = setTimeout(() => {
      setWinAnimationEnded(true);
    }, pickedDuration + 4000);

  }, [phase, both, skipped, timedOut, cardIdx]);

  useEffect(() => {
    if (!showWinAnimation || !winAnimationEnded) return;
    // Once the clip has ended, hold its last frame briefly (and at least this long overall).
    const MIN_RESULT_VISIBLE_MS = 2000;
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
    <div style={{minHeight:"100dvh",position:"relative",paddingLeft:20,paddingRight:20,paddingBottom:24,overflowX:"clip",...CHECKER_BG,color:T.textOnDark}}>


      {arcadeOffer?.stage==="ask" && (() => {
        // Owner 2026-11-07: the plain streak popup was "lame". Now a red cinema marquee with
        // chasing bulbs, spotlight rays, a slammed-in streak number and a popcorn burst.
        const bulbs = [];
        for (let i = 0; i < 11; i++) { bulbs.push({ left:`${(i + 0.5) / 11 * 100}%`, top:0 }); bulbs.push({ left:`${(i + 0.5) / 11 * 100}%`, top:"100%" }); }
        for (let i = 0; i < 16; i++) { bulbs.push({ left:0, top:`${(i + 0.5) / 16 * 100}%` }); bulbs.push({ left:"100%", top:`${(i + 0.5) / 16 * 100}%` }); }
        const kernels = Array.from({length:14}, (_, i) => {
          const ang = (-90 + (i - 6.5) * 13) * Math.PI / 180, dist = 120 + (i % 3) * 40;
          return { i, dx:Math.round(Math.cos(ang) * dist), dy:Math.round(Math.sin(ang) * dist), rot:(i % 2 ? 1 : -1) * (120 + i * 25), delay:0.55 + (i % 4) * 0.05 };
        });
        return (
        <div role="dialog" aria-label="Popcorn Panic offer" style={{position:"fixed",inset:0,zIndex:600,background:"rgba(8,5,20,0.78)",display:"flex",alignItems:"center",justifyContent:"center",padding:18,overflow:"hidden"}}>
          {!reducedMotion && <div aria-hidden="true" style={{position:"absolute",left:"50%",top:"50%",width:"190vmax",height:"190vmax",marginLeft:"-95vmax",marginTop:"-95vmax",pointerEvents:"none",
            background:"repeating-conic-gradient(from 0deg, rgba(255,216,77,0.16) 0deg 10deg, rgba(255,216,77,0) 10deg 24deg)",
            WebkitMaskImage:"radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 30%, transparent 62%)",maskImage:"radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 30%, transparent 62%)",
            animation:"offerRays 18s linear infinite, fadeIn 0.6s ease both"}}/>}
          <div style={{position:"relative",width:"100%",maxWidth:340,animation:reducedMotion?"none":"offerDrop 0.6s cubic-bezier(.25,1.5,.5,1) both"}}>
            <div style={{position:"relative",background:"linear-gradient(180deg,#C8173A 0%,#8E0C25 100%)",border:"4px solid #1C1D21",borderRadius:18,
              boxShadow:"inset 0 0 0 6px #E9B23A, inset 0 0 0 9px #1C1D21, 0 10px 0 #1C1D21, 0 22px 50px rgba(0,0,0,0.6)",padding:"26px 22px 20px",textAlign:"center"}}>
              {bulbs.map((b, i) => (
                <span key={i} aria-hidden="true" style={{position:"absolute",left:b.left,top:b.top,width:11,height:11,margin:"-5.5px 0 0 -5.5px",borderRadius:"50%",border:"1.5px solid #1C1D21",
                  background:"#FFF6C2",animation:reducedMotion?"none":`${i % 2 ? "offerBulbA" : "offerBulbB"} 0.4s steps(1) infinite`}}/>
              ))}
              <div style={{position:"relative",height:118,margin:"-62px auto 2px",display:"flex",justifyContent:"center"}}>
                {!reducedMotion && kernels.map((k) => (
                  <span key={k.i} aria-hidden="true" style={{position:"absolute",left:"50%",top:"45%",width:30,height:30,marginLeft:-15,marginTop:-15,pointerEvents:"none",
                    "--dx":`${k.dx}px`,"--dy":`${k.dy}px`,"--rot":`${k.rot}deg`,animation:`offerKernel 1.3s cubic-bezier(.2,.8,.4,1) ${k.delay}s both`}}>
                    <ArcadeItemArt kind="popcorn" variant={k.i % 12}/>
                  </span>
                ))}
                <div style={{animation:reducedMotion?"none":"offerBucket 0.7s cubic-bezier(.3,1.6,.5,1) 0.25s both, offerWobble 2.2s ease-in-out 1.2s infinite",transformOrigin:"50% 90%"}}>
                  <PopcornPanicLogo height={118}/>
                </div>
              </div>
              <div style={{...YELLOW_STICKER_TEXT,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",whiteSpace:"nowrap",opacity:0.95}}>★ Now showing ★</div>
              <div role="heading" aria-level={2} aria-label={`You've solved ${runStreak} PlotMixes in a row!`} style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:8,margin:"2px 0 0"}}>
                <span style={{...YELLOW_STICKER_TEXT,fontSize:64,lineHeight:1,WebkitTextStroke:"2.5px #1C1D21",
                  textShadow:"0 6px 0 #1C1D21, 3px 3px 0 #1C1D21, -3px -3px 0 #1C1D21, 3px -3px 0 #1C1D21, -3px 3px 0 #1C1D21",
                  animation:reducedMotion?"none":"offerSlam 0.55s cubic-bezier(.3,1.7,.5,1) 0.5s both"}}>{runStreak}</span>
                <span style={{...WHITE_STICKER_TEXT,fontSize:26,lineHeight:1,WebkitTextStroke:"1.5px #1C1D21",textShadow:"0 4px 0 #1C1D21",textTransform:"uppercase",
                  animation:reducedMotion?"none":"offerRise 0.45s cubic-bezier(.3,1.5,.5,1) 0.75s both"}}>in a row!</span>
              </div>
              <div style={{...WHITE_STICKER_TEXT,fontSize:13,textTransform:"uppercase",lineHeight:1.35,margin:"10px 0 14px",animation:reducedMotion?"none":"offerRise 0.45s ease 0.85s both"}}>You've earned a round of Popcorn Panic!</div>
            {arcadeOffer.badges?.length>0 && (
              <div style={{display:"flex",flexDirection:"column",gap:6,margin:"0 0 16px"}}>
                {arcadeOffer.badges.map((b)=>(
                  <div key={b.id} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"7px 10px",position:"relative",overflow:"hidden",background:"#FFD84D",border:"2px solid #1C1D21",borderRadius:10,boxShadow:"0 3px 0 #1C1D21",animation:reducedMotion?"none":"offerRise 0.45s cubic-bezier(.3,1.5,.5,1) 1.05s both"}}>
                    {!reducedMotion && <span aria-hidden="true" style={{position:"absolute",top:0,bottom:0,left:0,width:"40%",background:"linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)",animation:"offerShine 2.4s ease-in-out 1.5s infinite"}}/>}
                    <span style={{fontSize:16}}>{b.emoji}</span>
                    <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:10.5,color:"#1C1D21",textTransform:"uppercase"}}>Badge unlocked: {b.name}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={()=>setArcadeOffer({stage:"playing"})} style={{...BTN.primary,width:"100%",padding:"13px 0",marginBottom:10,animation:reducedMotion?"none":"offerRise 0.45s cubic-bezier(.3,1.5,.5,1) 1.2s both, offerGlow 1.4s ease-in-out 1.7s infinite"}}>
              <span style={{...WHITE_STICKER_TEXT,fontSize:13,textTransform:"uppercase",lineHeight:1.35}}>🍿 Play Popcorn Panic<br/><span style={{fontSize:10.5}}>to win hidden prizes</span></span>
            </button>
            <button onClick={()=>{ setArcadeOffer(null); handleResultNext(); }} style={{...BTN.cyan,width:"100%",padding:"12px 0",animation:reducedMotion?"none":"offerRise 0.45s cubic-bezier(.3,1.5,.5,1) 1.3s both"}}>
              <span style={{...WHITE_STICKER_TEXT,fontSize:12,textTransform:"uppercase"}}>Continue to the next PlotMix</span>
            </button>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#FFE9A8",opacity:0.9,marginTop:10}}>Not now? Your round is saved: find Popcorn Panic under Speed Run on the menu.</div>
            </div>
          </div>
        </div>
        );
      })()}
      {arcadeOffer?.stage==="playing" && (
        <div style={{position:"fixed",inset:0,zIndex:650,overflowY:"auto"}}>
          <ArcadeScreen embedded reducedMotion={reducedMotion} onBack={()=>{ setArcadeOffer(null); handleResultNext(); }}/>
        </div>
      )}

      {/* Load the win and hint clips early so they play smoothly the first time */}
      {!reducedMotion && (
        <div aria-hidden="true" style={{display:"none"}}>
          {[...STICKER_ASSETS.winAnimations.map((a)=>a.src), STICKER_ASSETS.hintAnimation.src].map((src)=>(
            <video key={src} src={src} preload="auto" muted playsInline/>
          ))}
        </div>
      )}

      {mode.timeLimit>0&&<PopcornMeter width={98} streak={runStreak} popKey={popKey} reducedMotion={reducedMotion}/>}
      {clapper && <ClapperTake key={clapper.key} take={clapper.take} note={clapper.note} reducedMotion={reducedMotion}/>}
      {badgeToast && <BadgeToast key={badgeToast.map(b=>b.id).join("|")} badges={badgeToast} onDone={()=>setBadgeToast(null)}/>}
      {countingDown && <FilmLeaderCountdown reducedMotion={reducedMotion} onDone={()=>setCountingDown(false)}/>}
      {/* Curtains open every time a game starts or is resumed (owner request 2026-10-26); the
          Daily adds its trailer line. */}
      {/* The player's chosen curtains (holidays don't change them; owner decision 2026-10-26). */}
      <CurtainReveal line={dailyLine} reducedMotion={reducedMotion}/>
      {showingResult && !both && !skipped && !reducedMotion && <FilmBurn/>}

      {/* Card change (owner request 2026-10-25): a quick old film-leader countdown,
          "5, 4, blip!", then the next card. About 1.3 seconds, and it never blocks typing. */}
      {genreTransition?.kind === "leader" && <LeaderBlip key={`leader-${genreTransition.nonce}`}/>}
      {genreTransition?.kind === "reel" && <FilmReelChange key={`reel-${genreTransition.nonce}`}/>}
      {genreTransition?.kind === "iris" && <IrisWipe key={`iris-${genreTransition.nonce}`}/>}
      {genreTransition?.kind === "clapper" && <ClapperSlam key={`slam-${genreTransition.nonce}`} scene={genreTransition.scene}/>}
      {audience && <AudienceReaction key={audience.key} mood={audience.mood}/>}
      {usher && <Usher key={usher.key}/>}
      {boo && <TomatoBoo key={boo.key}/>}

      {/*  AUTO POPUP when round ends (never while rewinding/view-only)  */}
      {showingResult&&(
        <RoundResultPopup
          card={card}
          found={effectiveFound}
          guessCount={guesses.length}
          hintCount={hintCount}
          maxGuesses={mode.maxGuesses}
          roundScore={Math.min(roundScore+bonusPts, budgetRoom)}
          budgetLeft={Math.max(0,currentReward)}
          isDaily={mode.isDaily}
          bonus={bonusEligible ? {films:card.movies, years:filmYears, answer:whichFirst, capped:roundScore+bonusPts > budgetRoom} : null}
          onBonus={handleBonus}
          cardIdx={cardIdx}
          totalCards={deck.length}
          results={results}
          isLast={isLast||timedOut||cardLost}
          skipped={skipped}
          timedOut={timedOut}
          outOfPoints={rewardSpent}
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
      {/* 44x44 tap area (recommended minimum) around the same 33x35 icon, at the same spot */}
      <button onClick={()=>{clearSession(mode.id);onQuit();}} aria-label="Exit to menu"
        style={{position:"absolute",...(mode.timeLimit>0?{top:7.5,left:3.5}:{top:1.5,left:7.5}),zIndex:400,width:44,height:44,background:"transparent",border:"none",padding:0,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <img src="/design-reference/Exit.svg" alt="" aria-hidden="true" draggable="false"
          style={{display:"block",width:33,height:35,pointerEvents:"none",userSelect:"none"}}/>
      </button>



      {/* Are-you-sure skip confirmation */}
      {showSkipConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:390,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
          onClick={e=>e.target===e.currentTarget&&setShowSkipConfirm(false)}>
          <div style={{position:"relative",width:"100%",maxWidth:358,aspectRatio:"358 / 184"}}>
            <div style={{position:"absolute",left:0,right:0,bottom:"calc(100% + 10px)",display:"flex",justifyContent:"center",pointerEvents:"none"}}>
              <div style={{...YELLOW_STICKER_TEXT,fontSize:12,lineHeight:1.3,textTransform:"uppercase",textAlign:"center",background:"#1C1D21",border:"2px solid #F3F4FF",borderRadius:10,boxShadow:"0 3px 0 #000",padding:"8px 12px"}}>
                Walk out of the theatre? No refunds.
              </div>
            </div>
            <img src="/design-reference/Skip%20modal.svg" alt="" aria-hidden="true" draggable="false"
              style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block",pointerEvents:"none",userSelect:"none"}}/>
            <button onClick={()=>{setShowSkipConfirm(false);SFX.skip();handleSkip();}} aria-label="Skip It"
              style={{position:"absolute",left:`${20.5/358*100}%`,top:`${104/184*100}%`,width:`${124/358*100}%`,height:`${54/184*100}%`,background:"transparent",border:"none",padding:0,cursor:"pointer"}}/>
            <button onClick={()=>setShowSkipConfirm(false)} aria-label="Keep Trying"
              style={{position:"absolute",left:`${154.5/358*100}%`,top:`${104/184*100}%`,width:`${183/358*100}%`,height:`${54/184*100}%`,background:"transparent",border:"none",padding:0,cursor:"pointer"}}/>
          </div>
        </div>
      )}

      {!hideGameplayForResult&&(
      <div style={{maxWidth:402,margin:"0 auto",animation:cameraShakeLayerAnimation}}>

        {/* HEADER — stat row only; the X exit button floats fixed above (see below) */}
        {/* Big art, no bubbles (owner request 2026-11-04): scene clapper left, budget bag right. */}
        {mode.timeLimit>0 ? (
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,padding:"112px 4px 66px"}}>
          <SceneClapper scene={cardIdx+1} total={deck.length}/>
          <div aria-label="Studio budget" style={{display:"flex",alignItems:"center",gap:8}}>
            <img src="/stickers/budget-bag.webp" alt="" aria-hidden="true" draggable="false"
              style={{display:"block",width:74,height:"auto",userSelect:"none",filter:"drop-shadow(0 3px 0 rgba(0,0,0,0.35))"}}/>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <RollingPoints value={liveCardPts} reducedMotion={reducedMotion} style={{...YELLOW_STICKER_TEXT,fontSize:30,lineHeight:1}}/>
              <span aria-hidden="true" style={{...WHITE_STICKER_TEXT,fontSize:12,lineHeight:1,letterSpacing:1.5}}>BUDGET</span>
            </div>
          </div>
        </div>
        ) : (
          /* Regular runs: positions placed by the owner in the HUD layout lab (2026-11-04),
             in px on a 402px screen; the HUD box starts 20px in, so x is offset by 20 and
             spread as a % of its 362px width. The plot card starts 237px down. */
          <div style={{position:"relative",height:237,zIndex:2}}>
            {(()=>{ const at=(x,y)=>({position:"absolute",left:`${(x-20)/362*100}%`,top:y}); return (<>
              <div style={at(63,35)}><SceneClapper scene={cardIdx+1} total={deck.length}/></div>
              <img src="/stickers/budget-bag.webp" alt="" aria-hidden="true" draggable="false"
                style={{...at(176,56),display:"block",width:93,height:"auto",userSelect:"none",filter:"drop-shadow(0 3px 0 rgba(0,0,0,0.35))"}}/>
              <div aria-label="Studio budget" style={{...at(270,77),width:102,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <RollingPoints value={liveCardPts} reducedMotion={reducedMotion} style={{...YELLOW_STICKER_TEXT,fontSize:30,lineHeight:1}}/>
              <span aria-hidden="true" style={{...WHITE_STICKER_TEXT,fontSize:12,lineHeight:1,letterSpacing:1.5}}>BUDGET</span>
              </div>
              <div style={at(45,151)}><PopcornMeter inline width={104} streak={runStreak} popKey={popKey} reducedMotion={reducedMotion}/></div>
              <span style={{...at(146,197),...WHITE_STICKER_TEXT,fontSize:17,lineHeight:1,whiteSpace:"nowrap"}}>{runStreak} in a row</span>
            </>); })()}
          </div>
        )}

        {/* PLAYING — structure matches Figma exactly: plot card, bare hangman tiles,
            guess input, then a fixed bottom button bar. Nothing else. */}
        <div style={{display:"flex",flexDirection:"column",gap:28,animation:cardStageAnimation,paddingBottom:showFooterBar?104:24,transformOrigin:"50% 60%"}}>

              {/*  PLOT CARD  */}
              <div style={{background:"#fff",borderRadius:22,padding:"26px 20px 22px",boxSizing:"border-box",position:"relative",border:`2px solid ${T.border}`,boxShadow:T.shadow,marginTop:0}}>
                {/* Speed Run: a big countdown clock where the difficulty badge used to be (owner request 2026-11-04). */}
                {mode.timeLimit>0&&(
                  /* Stopwatch at (128,240) and countdown at (188,250) on the 402px screen, per the owner's
                     layout (2026-11-05); the card starts at x=20, y=281 and is 362px wide. */
                  <div aria-label="Time left" style={{position:"absolute",top:0,left:0,right:0,height:0,
                    animation:!reducedMotion&&timeLeft<=10&&timeLeft>0?"ptsShake 0.5s ease infinite":"none","--amp":"2px"}}>
                    <div style={{position:"absolute",left:`${(128-20)/362*100}%`,top:240-281}}><IconStopwatch size={54}/></div>
                    <span style={{position:"absolute",left:`${(188-20)/362*100}%`,top:250-281,...YELLOW_STICKER_TEXT,fontSize:30,lineHeight:1,whiteSpace:"nowrap",color:timeLeft<=10?"#FF5A5A":"#FFFFFF"}}>
                      {`${Math.floor(timeLeft/60)}:${String(timeLeft%60).padStart(2,"0")}`}
                    </span>
                  </div>
                )}
                <p style={{margin:0,fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:"clamp(16px, 5.3vw, 22px)",lineHeight:1.42,color:"#1C1D21"}}>
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
              <div ref={hangmanRef} role="group" aria-label="Title letters">
                <HangmanTitle card={card} found={pastWon?[true,true]:effectiveFound} guesses={guesses} reducedMotion={reducedMotion} peek={peek}/>
              </div>

              {/*  GUESS INPUT — stays in place when it fits; on short screens (small phones,
                  landscape, keyboard open) it stays pinned just above the bottom button bar
                  instead of hiding behind it. 94/402 is the bar's height-to-width ratio.  */}
              <div ref={guessDockRef} style={{position:"sticky",zIndex:50,
                bottom:showFooterBar?"calc(min(100vw, 402px) * 94 / 402 + env(safe-area-inset-bottom, 0px))":"0px",
                // Padding cancelled by negative margins: same layout as before, room for a backdrop.
                margin:"-8px -20px",padding:"8px 20px",
                ...(guessDocked?{...CHECKER_BG,boxShadow:"0 -6px 12px rgba(0,0,0,0.22)"}:{})}}>
                {/* No sound button during play: it lives on the main menu only (owner request 2026-11-04). */}
                <GuessInput ref={guessInputRef} onSubmit={handleGuess} disabled={both||cardLost||viewOnly||countingDown} allowSingleLetterY={allowSingleLetterY}/>
              </div>


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
                <HintsModal card={card} hintsRevealed={hintsRevealed} 
                  powerups={powerupsAllowed ? loadPowerups() : null} peekUsed={peek} freeHints={freeHints}
                  onFreeHint={handleFreeHint} onPeek={handlePeek}
                  onReveal={handleRevealHint} pointsLeft={currentReward} onClose={()=>setShowHints(false)} hintAnimationSrc={STICKER_ASSETS.hintAnimation}
                  reducedMotion={reducedMotion} transitionFamily={transitionFamily}/>
              )}

        </div>

        {/*  FIXED BOTTOM BUTTON BAR — hints / guess / skip  */}
        {showFooterBar&&(
          <div ref={footerBarRef} style={{position:"fixed",bottom:0,left:0,right:0,display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:60,boxSizing:"border-box",padding:"0 env(safe-area-inset-left) max(env(safe-area-inset-bottom), 0px) env(safe-area-inset-right)",background:"#9381FE",borderTop:`1px solid ${T.border}`}}>
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

              <button aria-label={viewOnly?"Hints unavailable in view-only":"Open hints"} onClick={()=>{ if(viewOnly) return; SFX.page(); setShowHints(true); }} disabled={viewOnly}
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




function EndScreen({mode,results,totalScore,dailyReplay=false,perfectRun=false,goldWon=false,onMenu,onPlayAgain,reducedMotion=false}) {
  const [copied,setCopied]=useState(false);
  const correct=results.filter(r=>isRoundSolved(r)).length;
  const skippedCount=results.filter(r=>r.skipped).length;
  const missed=results.length-correct-skippedCount-results.filter(r=>!r.skipped&&!isRoundSolved(r)&&r.found[0]!==r.found[1]).length;
  const displayStreakValue = getRunBestStreak(results);

  // On a Daily replay, the day's first result is the one shown in the note and shared.
  const officialDaily = dailyReplay ? getDailyResult() : null;
  const shareText = officialDaily?.shareText || buildShareText(mode,results,totalScore);
  // Phones (and some desktops) have a share menu; elsewhere the result is copied.
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const handleShare=()=>{
    const done=()=>{setCopied(true);setTimeout(()=>setCopied(false),2600);};
    if(canNativeShare){
      // Closing the share menu without sharing is not an error; anything else falls back to copying.
      navigator.share({text:shareText}).catch((err)=>{ if(err?.name!=="AbortError") fallbackCopy(shareText,done); });
      return;
    }
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

  // Cinema extras: spoof rating, a made-up critic, the badge shelf and end credits.
  const rating = getSpoofRating(correctRatio);
  const [review] = useState(()=>getCriticReview(correctRatio));
  const [runBadges] = useState(()=>{
    const ids=[];
    if(!mode.isDaily && results.length>0 && correct===results.length) ids.push("goldenPopcorn");
    if(totalScore===0) ids.push("straightToVideo");
    const fresh=earnBadges(ids);
    if(fresh.length) SFX.badge();
    return fresh;
  });
  const ownedBadges = loadBadges();
  const [canInstall,setCanInstall]=useState(()=>!!deferredInstallPrompt && mode.isDaily && correct===results.length && results.length>0);
  const [badgeInfo,setBadgeInfo]=useState(()=>runBadges[0]||null);
  const shownBadge = BADGES.find(b=>b.id===badgeInfo);
  const filmsFound = results.reduce((n,r)=>n+(isRoundSolved(r)?2:(r.found||[]).filter(Boolean).length),0);
  const takes = results.reduce((n,r)=>n+(r.guesses||0),0);
  const hintsUsed = results.reduce((n,r)=>n+(r.hints||0),0);
  const bloopers = results.flatMap(r=>r?.wrongList||[]).filter(g=>String(g).trim()).slice(0,4);
  // Post-credits scene (owner request 2026-10-26): a teaser for tomorrow's Daily, after the credits.
  const [postCredits,setPostCredits]=useState(reducedMotion);
  useEffect(()=>{ if(reducedMotion) return; const id=setTimeout(()=>setPostCredits(true),6000); return ()=>clearTimeout(id); },[reducedMotion]);
  const tomorrowCard = useMemo(()=>{ const d=new Date(); d.setDate(d.getDate()+1); return dailyCardFor(uniqueCardsByMoviePair(MASTER_DECK), d); },[]);
  const teaserGenres = (tomorrowCard?.hintData?.films||[]).map(f=>String(f.genre||"").split(/[,/]/)[0].trim()).filter(Boolean);
  const credits = [
    ["", "A PlotMix Production"],
    ["Starring", "You"],
    ["Films identified", String(filmsFound)],
    ["Takes", String(takes)],
    // Blooper reel (owner request 2026-10-26): the run's wrong guesses, played back.
    ...(bloopers.length ? bloopers.map((g,i)=>[i===0?"Blooper reel":"", `“${g}”`]) : [["Blooper reel","Empty. Not one bad take."]]),
    ["Hints supplied by", hintsUsed>0 ? "Your Wallet of Points" : "Nobody. You did it alone."],
    ["Catering", "One Large Popcorn"],
    ["Best Boy", "Still Unsure What That Is"],
    ["", "No films were harmed in the making of this mashup."],
  ];
  const trexMotion = trexMood === "veryHappy"
    ? "trexBounce 1.25s ease-in-out infinite"
    : trexMood === "sad"
      ? "trexSway 2.2s ease-in-out infinite"
      : "trexFloat 2.6s ease-in-out infinite";

  return (
    <div style={{position:"absolute",inset:0,zIndex:700,overflowY:"auto",...CHECKER_BG,backgroundColor:T.bg,color:T.textOnDark,animation:"fadeIn 0.5s ease"}}>
      <CurtainReveal zIndex={720} reducedMotion={reducedMotion} line={`Films released: ${totalScore}`}/>
      {perfectRun && !reducedMotion && <CameraFlashes/>}
      <div style={{width:"min(402px, 100vw)",minHeight:"100dvh",margin:"0 auto",padding:"14px 0 24px",boxSizing:"border-box"}}>
      <div style={{width:"100%",minHeight:"calc(100dvh - 38px)",...WIN_RESULT_BG,backgroundColor:T.bgDeep,border:`2px solid ${T.border}`,borderRadius:20,boxShadow:T.shadowLg,padding:"56px 22px 24px",textAlign:"center",boxSizing:"border-box",display:"flex",flexDirection:"column",position:"relative"}}>

        <div style={{...WHITE_STICKER_TEXT,fontSize:"clamp(30px, 8.8vw, 40px)",lineHeight:1.02,marginBottom:10,textTransform:"uppercase"}}>The End</div>
        <div style={{...YELLOW_STICKER_TEXT,fontSize:"clamp(17px, 5.1vw, 24px)",lineHeight:1.04,marginBottom:mode.isDaily?10:24,textTransform:"uppercase"}}>Share Your Results</div>
        {mode.isDaily && (
          <div aria-label="Next Daily" style={{...WHITE_STICKER_TEXT,fontSize:12,lineHeight:1.3,marginBottom:22,letterSpacing:"0.02em"}}>
            Next Daily in <NextDailyCountdown/>
          </div>
        )}
        {officialDaily && (
          <div style={{...WHITE_STICKER_TEXT,fontSize:12,lineHeight:1.3,margin:"-12px 0 18px",letterSpacing:"0.02em"}}>
            Replay — today's first result is kept: {officialDaily.score} ⭐
          </div>
        )}

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

        {/* Spoof rating and review */}
        <div style={{display:"flex",alignItems:"stretch",gap:10,marginBottom:16,textAlign:"left"}}>
          <div aria-label={`Rated ${rating.code}: ${rating.label}`} style={{flex:"0 0 86px",background:rating.color,border:`2px solid ${T.border}`,borderRadius:12,boxShadow:"0 3px 0 #1C1D21",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px 4px",boxSizing:"border-box",transform:"rotate(-3deg)",animation:reducedMotion?"none":"titlePop 0.5s ease 0.5s both"}}>
            <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:9,color:T.textPrimary}}>RATED</span>
            <span style={{fontFamily:FONT_FIGMA_STICKER,fontSize:30,lineHeight:1,color:T.textPrimary,margin:"2px 0"}}>{rating.code}</span>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:11,color:T.textPrimary,textAlign:"center",lineHeight:1.15}}>{rating.label}</span>
          </div>
          <div style={{flex:1,minWidth:0,background:"rgba(14,10,44,0.45)",border:`1.5px solid ${T.border}`,borderRadius:12,padding:"10px 12px",boxSizing:"border-box"}}>
            <div aria-label={`${review.stars} out of 5 stars`} style={{color:"#FFD84D",fontSize:15,letterSpacing:2,lineHeight:1}}>{"★".repeat(review.stars)}<span style={{opacity:0.3}}>{"★".repeat(5-review.stars)}</span></div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,color:"#fff",lineHeight:1.35,margin:"6px 0 4px"}}>“{review.quote}”</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:"rgba(255,255,255,0.75)"}}>— {review.outlet}</div>
          </div>
        </div>

        {/* Badge shelf: tap a badge to see what it is for */}
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:8}}>
          {BADGES.map(b=>{
            const has=ownedBadges.includes(b.id);
            const isNew=runBadges.includes(b.id);
            return (
              <button key={b.id} onClick={()=>setBadgeInfo(b.id)} aria-label={`Badge: ${b.name}${has?"":" (locked)"}`}
                style={{width:44,height:44,borderRadius:"50%",padding:0,cursor:"pointer",background:has?"#FFD84D":"rgba(255,255,255,0.12)",border:`2px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,lineHeight:1,position:"relative",
                  filter:has?"none":"grayscale(1)",opacity:has?1:0.5,animation:isNew&&!reducedMotion?"titlePop 0.5s ease 0.9s both":"none"}}>
                {b.emoji}
                {isNew&&<span style={{position:"absolute",top:-8,right:-12,padding:"2px 4px",borderRadius:5,background:"#FF4A6E",border:"1.5px solid #1C1D21",fontFamily:FONT_FIGMA_STICKER,fontSize:7,color:"#fff"}}>NEW</span>}
              </button>
            );
          })}
        </div>
        <div style={{minHeight:18,marginBottom:14,fontFamily:"'Outfit',sans-serif",fontSize:12.5,color:"rgba(255,255,255,0.85)",lineHeight:1.4}}>
          {shownBadge ? <><b>{shownBadge.name}</b>: {shownBadge.desc}{ownedBadges.includes(shownBadge.id)?" ✓":" (not yet)"}</> : `Badges: ${ownedBadges.length}/${BADGES.length}. Tap one to see how to earn it.`}
        </div>

        {/* Stubs, Daily streak, install */}
        <div aria-label="Stubs" style={{fontFamily:"'Outfit',sans-serif",fontSize:12.5,color:"rgba(255,255,255,0.9)",marginBottom:mode.isDaily?6:14}}>
          🍿 {arcadePasses()} Popcorn Panic play{arcadePasses()===1?"":"s"} saved
        </div>
        {mode.isDaily && (()=>{
          const st=loadDailyStreak();
          const today=localDayNumber(new Date());
          return (
            <div aria-label="Daily streak" style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:"#FFD84D",marginBottom:14}}>
              🔥 Daily streak: {st.count} day{st.count===1?"":"s"}{st.saverDay===today ? " · 🧊 streak saver covered a missed day" : ""}
            </div>
          );
        })()}
        {perfectRun && (
          <div aria-label="Perfect run" style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:"#FFD84D",marginBottom:14}}>
            {goldWon ? "✨ A perfect run: no hints, no mistakes! Gold Lamé curtains unlocked!" : "✨ A perfect run: no hints, no mistakes!"}
          </div>
        )}
        {mode.isDaily && (()=>{
          const pd=loadPerfectDaily();
          const gold=loadPrizes();
          const today=localDayNumber(new Date());
          if(gold.won.includes("perfectDaily3")) return (
            <div aria-label="Gold curtains" style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:"#FFD84D",marginBottom:14}}>
              {gold.goldJustWon===today ? "✨ 3 perfect Dailies in a row: Gold Lamé curtains unlocked!" : "✨ Gold Lamé curtains: yours"}
            </div>
          );
          return (
            <div aria-label="Perfect Dailies in a row" style={{fontFamily:"'Outfit',sans-serif",fontSize:12.5,color:"rgba(255,255,255,0.9)",marginBottom:14}}>
              🏅 Perfect Dailies in a row: {pd.lastDay===today ? pd.count : 0} of {PERFECT_DAILY_FOR_GOLD} (no wrong guesses) for the Gold Lamé curtains
            </div>
          );
        })()}
        {canInstall && (
          <button onClick={()=>{ const e=deferredInstallPrompt; deferredInstallPrompt=null; setCanInstall(false); e?.prompt?.(); }}
            style={{...BTN.cyan,background:"#8F7BFD",width:"100%",padding:"11px 0",marginBottom:14}}>
            <span style={{...WHITE_STICKER_TEXT,fontSize:11.5,textTransform:"uppercase"}}>📲 Add PlotMix to your home screen</span>
          </button>
        )}

        {/* End credits */}
        <div aria-label="Credits" style={{height:118,overflow:reducedMotion?"auto":"hidden",marginBottom:18,borderTop:"1px solid rgba(255,255,255,0.2)",borderBottom:"1px solid rgba(255,255,255,0.2)",position:"relative"}}>
          <div style={{display:"flex",flexDirection:"column",gap:8,padding:"8px 0",animation:reducedMotion?"none":"creditsRoll 14s linear 0.6s infinite"}}>
            {credits.map(([role,name],i)=>(
              <div key={i} style={{fontFamily:"'Outfit',sans-serif",fontSize:12.5,lineHeight:1.3,color:"#fff"}}>
                {role && <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.65)"}}>{role}</div>}
                <div style={{fontWeight:700}}>{name}</div>
              </div>
            ))}
          </div>
        </div>

        {postCredits && (
          <div role="status" aria-label="Post-credits scene" style={{marginTop:-6,marginBottom:16,padding:"10px 12px",borderRadius:12,background:"rgba(14,10,44,0.55)",border:"1px dashed rgba(255,255,255,0.35)",animation:reducedMotion?"none":"postCreditsIn 0.6s ease both"}}>
            <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.65)",fontFamily:"'Outfit',sans-serif"}}>🎬 Post-credits scene</div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:"#fff",marginTop:4}}>
              {/* Always names the Daily Challenge, since it also shows after Standard and Speed Run. */}
              {teaserGenres.length===2
                ? `Tomorrow's Daily Challenge: a ${teaserGenres[0]} + ${teaserGenres[1]} mashup. Same time, same theatre.`
                : "Tomorrow's Daily Challenge: a brand-new mashup. Same time, same theatre."}
            </div>
          </div>
        )}

        <button onClick={handleShare} style={{...BTN.cyan,width:"100%",padding:"16px 0",marginBottom:18}}>
          <span style={{...WHITE_STICKER_TEXT,fontSize:"clamp(18px, 5.2vw, 24px)",lineHeight:1.02,letterSpacing:"0.03em",textTransform:"uppercase"}}>{canNativeShare?"Share":(copied?"Copied ✓":"Copy")}</span>
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
// Follows the operating system's "reduce motion" accessibility setting.
function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced,setReduced]=useState(()=>typeof window!=="undefined" && !!window.matchMedia && window.matchMedia(query).matches);
  useEffect(()=>{
    if(!window.matchMedia) return;
    const mql=window.matchMedia(query);
    const onChange=()=>setReduced(mql.matches);
    mql.addEventListener?.("change",onChange);
    return ()=>mql.removeEventListener?.("change",onChange);
  },[]);
  return reduced;
}

function PlotMixApp() {
  const reducedMotion=usePrefersReducedMotion();
  const [holiday]=useState(()=>activeHoliday()); // holiday-week decorations (owner request 2026-10-26)
  // Every button gets a soft tick (owner request 2026-10-26: "everything should be sound-designed").
  useEffect(()=>{
    const onTap=(e)=>{ if(e.target?.closest?.("button")) SFX.tick(); };
    document.addEventListener("pointerdown",onTap,true);
    return ()=>document.removeEventListener("pointerdown",onTap,true);
  },[]);
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
  const [screen,setScreen]=useState(()=>openPopcornForTesting()?"arcade":"intro");
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
    SFX.ticket();
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
        freeHints:saved.freeHints||[],
        peek:!!saved.peek,
        results:saved.results,
        totalScore:saved.totalScore,
        budget:saved.budget,
        timeLeft:saved.timeLeft,
      });
      setScreen("game");
      return;
    }
    const d=buildDeck(m);
    setMode(m); setDeck(d); setResumeState(null); setCompletedRun(null); setShowHelp(false); setScreen("game");
  };

  const [finalStreak,setFinalStreak]=useState(null);
  const handleComplete=(r,score,streak,{dailyReplay=false}={})=>{
    const perfectRun = isPerfectRun(mode, r);
    const goldWon = perfectRun && unlockGoldCurtains();
    setCompletedRun({mode,results:r,totalScore:score,streak:streak||null,dailyReplay,perfectRun,goldWon});
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
        @keyframes cancelStamp{ 0%{opacity:0;transform:translate(-50%,-50%) rotate(-12deg) scale(2.4)} 70%{opacity:1;transform:translate(-50%,-50%) rotate(-12deg) scale(0.94)} 100%{opacity:1;transform:translate(-50%,-50%) rotate(-12deg) scale(1)} }
        @keyframes offerRays { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes offerDrop { 0%{opacity:0;transform:translateY(-60px) scale(0.7) rotate(-4deg)} 60%{opacity:1;transform:translateY(8px) scale(1.04) rotate(1deg)} 100%{transform:translateY(0) scale(1) rotate(0)} }
        @keyframes offerBulbA { 0%,49%{background:#FFF6C2; box-shadow:0 0 9px 3px rgba(255,226,120,0.95)} 50%,100%{background:#B9862A; box-shadow:none} }
        @keyframes offerBulbB { 0%,49%{background:#B9862A; box-shadow:none} 50%,100%{background:#FFF6C2; box-shadow:0 0 9px 3px rgba(255,226,120,0.95)} }
        @keyframes offerBucket { 0%{opacity:0;transform:translateY(40px) scale(0.3)} 60%{opacity:1;transform:translateY(-8px) scale(1.12)} 100%{transform:translateY(0) scale(1)} }
        @keyframes offerWobble { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-4deg)} 75%{transform:rotate(4deg)} }
        @keyframes offerKernel { 0%{opacity:0;transform:translate(0,0) scale(0.3) rotate(0)} 15%{opacity:1} 55%{opacity:1;transform:translate(var(--dx),var(--dy)) scale(1) rotate(var(--rot))} 100%{opacity:0;transform:translate(calc(var(--dx) * 1.2),calc(var(--dy) * -0.2 + 160px)) scale(0.8) rotate(var(--rot))} }
        @keyframes offerSlam { 0%{opacity:0;transform:scale(3.2) rotate(-14deg)} 60%{opacity:1;transform:scale(0.88) rotate(4deg)} 100%{transform:scale(1) rotate(-3deg)} }
        @keyframes offerRise { 0%{opacity:0;transform:translateY(14px) scale(0.92)} 100%{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes offerShine { 0%{transform:translateX(-120%)} 60%,100%{transform:translateX(320%)} }
        @keyframes offerGlow { 0%,100%{box-shadow:0 4px 0 #1C1D21, 0 0 0 0 rgba(255,216,77,0)} 50%{box-shadow:0 4px 0 #1C1D21, 0 0 18px 6px rgba(255,216,77,0.75)} }
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
        ${CINEMA_KEYFRAMES}
        .pmtc { display:inline-block !important; width:32px !important; height:20px !important; min-width:32px !important; min-height:20px !important; border-radius:5px !important; flex-shrink:0 !important; vertical-align:middle !important; }
      `}</style>
      {holiday && screen!=="intro" && <HolidayDecor holiday={holiday} reducedMotion={reducedMotion}/>}
      {screen==="intro"&&<IntroVideoScreen onDone={()=>setScreen(hasOnboarded()?"menu":"onboarding")}/>}
      {screen==="onboarding"&&<Onboarding onDone={()=>{markOnboarded();setScreen("menu");}} onSkip={()=>{markOnboarded();setScreen("menu");}} showSkip/>}
      {screen==="menu"&&<ModeSelect onSelect={handleModeSelect} onArcade={()=>setScreen("arcade")}/>}
      {screen==="game"&&mode&&<GameScreen mode={mode} deck={deck} initialState={resumeState} onQuit={goMenu} onComplete={handleComplete} reducedMotion={reducedMotion}/>}
      {screen==="end"&&completedRun&&<EndScreen mode={completedRun.mode} results={completedRun.results} perfectRun={completedRun.perfectRun} goldWon={completedRun.goldWon} totalScore={completedRun.totalScore} dailyReplay={completedRun.dailyReplay} onMenu={goMenu} onPlayAgain={handlePlayAgain} reducedMotion={reducedMotion}/>}
      {/* Not during play: it overlaps the Skip button and swallows its clicks,
          and the Figma gameplay frame has no floating help button. */}
      {screen==="menu"&&<HelpButton onClick={()=>setShowHelp(true)}/>}
      {screen==="arcade"&&<ArcadeScreen onBack={goMenu} reducedMotion={reducedMotion}/>}
      {screen==="menu"&&<SoundToggle style={{position:"fixed",bottom:26,left:24,zIndex:100}}/>}
      {showHelp&&<HowToPlayModal onClose={()=>setShowHelp(false)}/>}
    </div>
  );
}

export default function PlotMix() {
  return <PlotMixApp key={APP_BOOT_NONCE} />;
}



