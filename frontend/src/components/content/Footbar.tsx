import Link from 'next/link';
import schoollogo from '@/img/schoollogo.png';
import Image from 'next/image';

const Footbar = () => {
  return (
    // <>
    // 	<div className="fixed flex items-center w-full h-[60px] px-10 py-3 gradation border-t border-gray-200 justify-between bottom-0 z-50">
    // 		<div className="flex items-center">
    // 			<p className="text-md text-text font-bold mr-[3px]">
    // 				강원과학고등학교
    // 			</p>
    // 			<div className="h-[20px] w-[2px] bg-text mr-[3px]"></div>
    // 			<p className="text-md text-cusblue-normal font-bold mr-[3px]">
    // 				기상찬
    // 			</p>
    // 		</div>
    // 		<div className="flex items-center">
    // 			<div className="bg-lighttext w-[5px] h-[5px] rounded-full mr-[5px]"></div>
    // 			<p className="text-lighttext text-sm">Contact : sangia070122@gmail.com</p>
    // 			<div className="bg-lighttext w-[5px] h-[5px] rounded-full mr-[5px] ml-[20px]"></div>
    // 			{/* <Link href={{ pathname : '/setadmin'  }} className="text-lighttext text-sm mr-[5px] hover:text-cusblue-normal duration-150">Set admin</Link> */}
    // 			<p className="text-lighttext text-sm mr-[5px] hover:text-cusblue-normal duration-150 cursor-pointer">Set admin</p>
    // 			<div className="bg-lighttext w-[5px] h-[5px] rounded-full mr-[5px] ml-[20px]"></div>
    // 			<a href="https://northern-slice-716.notion.site/Songchan-13d5e69f5b6980f1a9c0fd243545d2e8?pvs=4">
    // 				<p className="text-lighttext text-sm hover:text-cusblue-normal duration-150">Guide Book</p>
    // 			</a>
    // 		</div>
    // 	</div>
    // </>
    <>
      <div className="flex w-full pt-7 pb-14 justify-center bottom-0 border-t border-gray-100 bg-white mt-[60px]">
        <div className="w-[1060px] flex items-center justify-start">
          <Image
            src={schoollogo}
            alt="KSHS_logo"
            className="w-[20px] mr-[5px]"
          />
          <p className="text-xs text-black font-bold mr-[3px]">
            강원과학고등학교
          </p>
          <div className="h-[10px] w-[2px] bg-lighttext mr-[3px]"></div>
          <p className="text-xs text-cusblue-normal font-bold mr-[3px]">
            기상찬
          </p>
          <p className="text-lighttext text-xs ml-[20px]">
            Contact : sangia070122@gmail.com
          </p>
          {/* <Link href={{ pathname : '/setadmin'  }} className="text-lighttext text-sm mr-[5px] hover:text-cusblue-normal duration-150">Set admin</Link> */}
          <p className="text-lighttext text-xs mr-[5px] hover:text-cusblue-normal duration-150 cursor-pointer ml-[10px]">
            Set admin
          </p>
          <a
            href="https://northern-slice-716.notion.site/Songchan-13d5e69f5b6980f1a9c0fd243545d2e8?pvs=4"
            className="ml-[10px]"
          >
            <p className="text-lighttext text-xs hover:text-cusblue-normal duration-150">
              Guide Book
            </p>
          </a>
        </div>
      </div>
    </>
  );
};

export default Footbar;
