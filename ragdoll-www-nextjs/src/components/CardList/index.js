import Image from 'next/image';

import { Icon } from '@/components';
import { slugify, getStarRating } from '@/utils';

const CardList = ({ title = '', items = [] }) => (
  <>
    <h3>{title}</h3>
    <ul className="w-full grid grid-rows-8 grid-cols-1 gap-3 mt-4 lg:grid-rows-2 lg:grid-cols-4">
      {items.map(({
        name,
        author,
        description,
        rating,
        imageURL,
        unitCount
      }) => (
        <li key={`${author}/${name}`} className="bg-slate-900 p-3 text-sm rounded-[1rem] overflow-hidden">
          <a href={`/${slugify(author)}/${slugify(name)}`} className="flex items-center justify-between mb-3">
            <h2 className="truncate">
              {name}
            </h2>
            <span>
              {getStarRating(rating)}
            </span>
          </a>
          <div className="flex items-center justify-between">
            <Image
              className="rounded-full m-1 bg-slate-500 object-cover min-w-[3rem] max-w-[3rem] min-h-[3rem] max-h-[3rem]"
              width={256}
              height={256}
              src={imageURL}
              alt="avatar"
            />
            <div className="w-full mx-2 text-left font-light text-slate-500">
              <p className="max-w-[75%] truncate">
                {description}
              </p>
              <em>
                {unitCount} doll{unitCount === 1 ? '' : 's'}
              </em>
            </div>
            <a href={`/.casts/${slugify(author)}/${slugify(name)}/cast.json`}>
              <Icon src="/assets/img/download.svg" size={30} />
            </a>
          </div>
        </li>
      ))}
    </ul>
  </>
);

export default CardList;
