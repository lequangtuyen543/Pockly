import aboutBg from '../../../assets/img/about-bg.jpg';
import { HeroItem } from '../../../components/HeroItem';

export const About = () => {
  return (
    <>
      <HeroItem title="About Me" subtitle="This is what I do." thumbnail={aboutBg} />

      <article className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <div className="prose prose-lg prose-indigo mx-auto text-gray-700 font-inter">
          <p className="lead text-xl text-gray-600 font-medium mb-8">
            Hello! I'm a passionate writer and developer exploring the intersection of technology and design. 
            Welcome to my digital garden where I share my thoughts, experiences, and technical tutorials.
          </p>
          
          <p className="mb-6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe nostrum ullam eveniet pariatur 
            voluptates odit, fuga atque ea nobis sit soluta odio, adipisci quas excepturi maxime quae totam 
            ducimus consectetur?
          </p>

          <p className="mb-6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius praesentium recusandae illo eaque 
            architecto error, repellendus iusto reprehenderit, doloribus, minus sunt. Numquam at quae voluptatum 
            in officia voluptas voluptatibus, minus!
          </p>

          <blockquote className="border-l-4 border-indigo-500 pl-6 my-8 italic text-gray-600 bg-gray-50 py-4 pr-4 rounded-r-lg">
            "The art of programming is the skill of controlling complexity. The great program is subdued, 
            made simple in its complexity."
          </blockquote>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut consequuntur magnam, excepturi 
            aliquid ex itaque esse est vero natus quae optio aperiam soluta voluptatibus corporis atque 
            iste neque sit tempora!
          </p>
        </div>
      </article>
    </>
  );
};