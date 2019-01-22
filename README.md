# HashMate
Home to the Advanced Algorithmics course project by [Salijona Dyrmishi](https://github.com/salijona) and Kirill Milintsevich

You can try the web interface [here](https://501good.github.io/hash/index.html).

This project helps to get the visual intuition on how the hashing works. With HashMate, you can learn about hashing using visual interactive examples. Moreover, the website provides useful information about different hashing techniques. We believe, that this project will help new students to grasp the concept more easily.

## About hashing

_Hashing_ is the process of converting an input of any size and length,  to either a number or a fix-sized string of text using a mathematical function. In this process, there are several elements: an input to be hashed and a _hash function_ that produces a certain _hash value_.

There are many ways to hash an input. This makes choosing a good hash function difficult. A good hash function should:
- be stable;
- be fast;
- produce a uniformly distributed hash values

One of the main challenges in hashing is avoiding _collisions_. Sometimes, a hash function produces the same hash value for different outputs. It's near impossible to completely avoid this when the number of inputs is high but there exist various methods to minimize the collisions.

Sometimes, a handful of hash functions is not enough. In this case, so called _families_ of hash functions are used. A family of hash functions can generate different hash functions dynamically.

Hashing has different applications: from cryptography to creating data structures with fast access to the elements or compact size. 

## Supported methods

This project supports these types of hashing:
1. Simple Hashing
2. Closed addressing - Linear probing
3. Closed addressing - Quadratic probing
4. Open addressing - Chaining
5. Universal Hashing
6. Bloom filters

Users can choose the size of the table from 1 to 20. After an element is inserted calculations are shown and the location in canvas. Users can search for elements in the table. 

## Acknowledgements

![UT](https://www.ut.ee/sites/default/files/styles/ut_content_width/public/tu_logod_17122015_horisontaal_eng_sinine_2.png)

![IT Academy](https://www.cs.ut.ee/sites/default/files/styles/ut_content_width/public/ita_small-logo-eng.png)

**Ministry of Foreign Affairs Development Cooperation Program**
