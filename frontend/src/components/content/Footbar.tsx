import Link from "next/link";

const Footbar = () => {
    return (
        <>
			<div className="fixed flex items-center w-full h-[60px] px-10 py-3 gradation border-t border-gray-200 justify-between bottom-0 z-50">
				<div className="flex items-center">
					<p className="text-md text-text font-bold mr-[3px]">
						강원과학고등학교
					</p>
					<div className="h-[20px] w-[2px] bg-text mr-[3px]"></div>
					<p className="text-md text-cusblue-normal font-bold mr-[3px]">
						기상찬
					</p>
				</div>
				<div className="flex items-center">
					<div className="bg-lighttext w-[5px] h-[5px] rounded-full mr-[5px]"></div>
					<p className="text-lighttext text-sm">Contact : sangia070122@gmail.com</p>
					<div className="bg-lighttext w-[5px] h-[5px] rounded-full mr-[5px] ml-[20px]"></div>
					<Link href={{ pathname : '/setadmin'  }} className="text-lighttext text-sm mr-[5px] hover:text-cusblue-normal duration-150">Set admin</Link>
					<div className="bg-lighttext w-[5px] h-[5px] rounded-full mr-[5px] ml-[20px]"></div>
					<a href="https://northern-slice-716.notion.site/Songchan-13d5e69f5b6980f1a9c0fd243545d2e8?pvs=4">
						<p className="text-lighttext text-sm hover:text-cusblue-normal duration-150">Guide Book</p>
					</a>
				</div>
			</div>
        </>
    )
}

export default Footbar;