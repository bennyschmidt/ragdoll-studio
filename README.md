# Arthas.AI

A web app for interacting with [ArthasGPT](https://github.com/bennyschmidt/ArthasGPT).

## Installation

1. Configure the [API](https://github.com/bennyschmidt/Arthas.AI/tree/master/arthas-api)

`cd arthas-api` 

See the API `README.md`. You will need an OpenAI API key to get started.

2. Install dependencies

`nvm use && npm i`

3. Start the server

`npm start`

You should see something like this:

```
A worker has spawned.
A worker has spawned.
A worker has spawned.
A worker has spawned.
A worker has spawned.
A worker has spawned.
A worker has spawned.
A worker has spawned.
Cluster is online at http://localhost:8000
Worker online (#1).
Worker online (#2).
Worker online (#3).
Worker online (#4).
Worker online (#5).
Worker (#1) is listening for messages.
Worker (#3) is listening for messages.
Worker (#2) is listening for messages.
Worker (#5) is listening for messages.
Worker online (#6).
Worker online (#8).
Worker (#4) is listening for messages.
Worker online (#7).
Worker (#6) is listening for messages.
Worker (#8) is listening for messages.
Worker (#7) is listening for messages.
```

This means the server is running and handling concurrent requests on all CPU cores

4. Set up the [front-end](https://github.com/bennyschmidt/Arthas.AI/tree/master/arthas-react)

`cd ../arthas-react`

See the React `README.md`.

`nvm use && npm i`

5. Start the front-end

`npm start`

You should see the default UI:

![image](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/d1980924-7a50-408e-b5c6-aa586743d1d5)

-----

## Usage

#### Using text models other than GPT-3.5

Coming soon.

#### Using image models other than DALL-E

Coming soon.

#### Sharing personas

- JSON import/export: Coming soon.

#### Customizing the UI

Coming soon.

![Screenshot from 2024-03-16 09-47-18](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/73dde8a8-f013-4905-bb22-e33ce0391506)

#### Arthas app

[How to use the app](https://github.com/bennyschmidt/Arthas.AI/tree/master?tab=readme-ov-file#usage)

#### API documentation

[How to run the API](https://github.com/bennyschmidt/Arthas.AI/tree/master/arthas-api#api-documentation)

-----

## Examples

### Arthas Menethil (default persona)

![arthas](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/2b138721-193b-4ba0-b543-330a87b7f9cf)

```
ARTHAS_NAME = 'Arthas';
KNOWLEDGE_URI = 'https://wowpedia.fandom.com/wiki/Arthas_Menethil';
ART_STYLE = `Blizzard's World of Warcraft concept art in high resolution like a fine-tuned video game model including each detail and anatomically correct features (if any)`;
WRITING_STYLE = 'inspiring but grim, from the year 1200 A.D.';
WRITING_TONE = 'slightly resentful';
```

![Screenshot from 2024-03-14 18-45-34](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/e5755c55-20fc-4a4a-84e7-d71ab0b5d93a)

What I learned from Arthas that I didn't already know, after ~5 minutes of chatting:

> - It was Archimonde's idea for Arthas to become the Lich King
> - Arthas has only personally killed 5 orcs, 3 blademasters and 2 farseers
> - The Lich King's power comes from wielding Frostmourne and wearing the Helm of Domination:
>     - Frostmourne: Turns targets into undead Scourge (and imprisons their soul)
>     - Helm of Domination: Allows the wearer to control the undead Scourge

### J.R.R. Tolkien

![tolkien](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/34ede550-2daf-4c1e-91f7-f010ff9b4719)

```
ARTHAS_NAME = 'Mr. Tolkien';
KNOWLEDGE_URI = 'https://en.wikipedia.org/wiki/J._R._R._Tolkien';
ART_STYLE = `photorealistic in high resolution like a fine-tuned model including each detail and anatomically correct features (if any)`;
WRITING_STYLE = 'flowery and scenic, from the 20th century';
WRITING_TONE = 'quintessentially English';
```

![image](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/76ab514b-ed2e-4304-baa7-207e1878874b)

What I learned from J.R.R. Tolkien that I didn't already know, after ~5 minutes of chatting:

> - Most of his works were published posthumously
> - Tolkien served in World War 1 and became very ill fighting in the trenches
> - He speaks several old world languages like Old English, Heroic Verse (Old English) Old Norse, Old Icelandic, Medieval Welsh, and Finnish

### Queen of Hearts

![queen-of-hearts](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/e311b27c-c4c0-45da-a40c-44c73dd3a157)

```
ARTHAS_NAME = 'Her Majesty';
KNOWLEDGE_URI = 'https://en.wikipedia.org/wiki/Queen_of_Hearts_(Alice%27s_Adventures_in_Wonderland)';
ART_STYLE = `Tim Burton dark animation in high resolution like a fine-tuned model including each detail and anatomically correct features (if any)`;
WRITING_STYLE = 'cruel and authoritarian, from the 18th century';
WRITING_TONE = 'classic English literature, often ending sentences with "Off with your head!"';
```

![screenshot](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/fdfa4fb7-bd74-462c-a992-b9ffed6063e7)

What I learned from Queen of Hearts that I didn't already know, after ~5 minutes of chatting:

> - She doesn't really chop people's heads off - it's all for show to scare the lesser cards into falling in line, while the King of Hearts usually pardons them in secret
> - Queen of Hearts is loosely based on Queen Victoria
> - The Queen's identity outside of Wonderland is Cora Mills - the mother of both the Wicked Witch of the West (from _The Wizard of Oz_) and Evil Queen (from _Snow White_)

### Bella Swan

![image](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/6ccfda8b-3e0a-4645-af58-26b09e43185b)

```
ARTHAS_NAME = 'Bella';
KNOWLEDGE_URI = 'https://en.wikipedia.org/wiki/Bella_Swan';
ART_STYLE = `Twilight books and films`;
WRITING_STYLE = 'slightly sarcastic, slightly self-deprecating and quippy, but not in an unnerving or insufferable way';
WRITING_TONE = 'kind and caring';
```

What I learned from Bella that I didn't already know, after ~5 minutes of chatting:

> - O-positive blood is the most attractive type to vampires
> - Bella is loosely based on Jane Eyre as well as author Stephenie Meyer
> - A vampire-human hybrid is called a "dhampir"
