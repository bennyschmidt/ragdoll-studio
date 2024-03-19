## The Tolkien Heuristic

#### Testing AI efficacy

Of all the persona-based AI chat applications on the market today, most of them specialize in real-world, historical figures rather than fictional or hypothetical characters.

It's known, but not widely, that J.R.R. Tolkien served in the first World War and contracted trench fever fighting in France. Tolkien's [Wikipedia article](https://en.wikipedia.org/wiki/J._R._R._Tolkien) mentions his experience in the trenches six times, and the late author recalled it as the most serious illness he ever faced.

By asking the question

> _What happened to you in France?_

Without requiring specific training, we should expect a realistic J.R.R. Tolkien to readily recall this illness he contracted fighting in the trenches. Here are some examples:

-----

#### [character.ai](https://character.ai)

![character-ai-tolkien](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/1fe7dd02-94aa-495c-b2a4-f5c41562b182)

_character.ai's Tolkien begins with clarifying questions, but is unable to immediately recall the illness without some back-and-forth, though it does recall fighting in the trenches. character.ai also completely misses the mark on the Tolkien style of writing._

Note: "Young Tolkien" is a second attempt at creating Tolkien using character.ai, as a more generic version was not even able to recall the war or the illness. Because character.ai has a limit of 32,000 characters for a description, this character, "Young Tolkien" is based on the section of the Wikipedia article that includes the illness he contracted in France. But even when given this specific body of knowledge, character.ai is not able to give a realistic response.

Grade: **❌ FAIL**

-----

#### [Knowtify](https://knowtify.app/)

![knowtify](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/7352779f-c1f0-4035-afac-3fa5852dd842)

_Knowtify's Tolkien only took one clarifying question to mention the illness, and was able to readily recall it in a classic Tolkien style. Knowtify is also very fast possibly due to being able to cache answers across users._

Note: Knowtify has a predefined J.R.R. Tolkien.

Grade: **✅ PASS**

-----

#### [AI History Chat](https://apps.apple.com/us/app/ai-history-chat/id6446097887)

![AA4E7393-0A9A-4A3B-91D5-E86B0289775C](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/b57462bd-126a-4fe2-bc0e-1c374031a62a)

_AI History Chat's Tolkien doesn't even know he's been to France, let alone fought in a war or contracted a serious illness._

Note: AI History Chat did not have a pre-defined J.R.R. Tolkien, but lets you add a custom persona. It's unclear where it pulled Tolkien's knowledge from.

Grade: **❌ FAIL**

-----

#### [ChatGPT](https://chat.openai.com/)

![Screenshot from 2024-03-18 13-30-15](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/88829714-f320-4f58-9c18-1fd1a3083c8c)

_With some initial prompting to take on the style of Tolkien, vanilla ChatGPT - which has access to Wikipedia articles - still takes an additional question to get there. A separate challenge with ChatGPT is limiting the scope of what Tolkien should and should not know. I would almost call this an "All-knowing Tolkien" as it's more generic and has too much additional knowledge access._

Grade: **✅ PASS**

-----

#### [Hello History](https://hellohistory.ai/)

_N/A_

Note: J.R.R. Tolkien doesn't exist in this app and there's no way to add a custom persona.

Grade: **❌ FAIL**

-----

#### [Text With History](https://textwith.app/history/)

_N/A_

Note: J.R.R. Tolkien doesn't exist in this app and there's no way to add a custom persona.

Grade: **❌ FAIL**

-----

#### [Arthas.AI](https://github.com/bennyschmidt/Arthas.AI)

https://github.com/bennyschmidt/Arthas.AI/assets/45407493/414df025-91db-4599-935e-b7c82f928cb4

_Arthas.AI's Tolkien immediately reports in classic Tolkien style fighting in the trenches, falling ill, and returning to England._

Grade: **✅ PASS**

-----

## Rubrik

#### Need 3 out of 4 to pass

- Is it usable (is it possible to chat with J.R.R. Tolkien)?

- Is the information accurate?

- Does it match Tolkien's tone & style?

- Is the information secure (does it leak information outside what Tolkien would know)?
