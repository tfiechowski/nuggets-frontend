import Container from '@/components/landing/Container';
import Image from 'next/image';
import React from 'react';

export default function Benefits(props: any) {
  const { data } = props;

  return (
    <div className="flex h-full w-full landing-accent-background py-8">
      <Container className="flex flex-wrap mb-20 lg:gap-10 lg:flex-nowrap ">
        <div
          className={`flex items-center justify-center w-full lg:w-1/2 ${
            props.imgPos === 'right' ? 'lg:order-1' : ''
          }`}
        >
          <div>
            <Image
              src={data.image}
              width="521"
              height="482"
              alt="Benefits"
              layout="intrinsic"
              // placeholder="blur"
            />
          </div>
        </div>

        <div
          className={`flex flex-wrap items-center w-full lg:w-1/2 ${
            props.imgPos === 'right' ? 'lg:justify-end' : ''
          }`}
        >
          <div>
            <div className="flex flex-col w-full mt-4">
              <h3 className="max-w-2xl mt-3 text-4xl font-bold leading-snug tracking-tight text-white-800 lg:leading-tight lg:text-4xl dark:text-white">
                {data.title}
              </h3>

              <p className="max-w-2xl py-4 text-xl leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
                {data.desc}
              </p>
            </div>

            <div className="w-full mt-5">
              {data.bullets.map((item: any, index: number) => (
                <Benefit key={index} title={item.title} icon={item.icon}>
                  {item.desc}
                </Benefit>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Benefit(props: any) {
  return (
    <>
      <div className="flex items-start mt-8 space-x-3">
        {/* <div className="flex items-center justify-center flex-shrink-0 mt-1 bg-zinc-600 rounded-md w-11 h-11 "> */}
        {/* {React.cloneElement(props.icon, {
            className: 'w-7 h-7 text-indigo-50'
          })} */}
        {/* </div> */}
        <div>
          <h4 className="text-2xl font-medium text-white-600 dark:text-gray-200">{props.title}</h4>
          <p className="mt-1 text-xl font-semibold text-zinc-800 dark:text-gray-400">
            {props.children}
          </p>
        </div>
      </div>
    </>
  );
}
