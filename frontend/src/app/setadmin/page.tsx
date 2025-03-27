export default function Page() {
  return (
    <main className="my-[80px]">
      <div className="border-2 border-cusblue-normal bg-body w-[600px] h-[90px] rounded-xl shadow-shadowc shadow-2xl flex flex-col justify-center p-[10px]">
        <p className="text-lg font-bold text-cusblue-deep mb-[5px]">
          계정을 관리자 계정으로 업그레이드 하시겠습니까?
        </p>
        <p className="text-sm font-light text-cusblue-deep">
          입력한 계정을 관리자 계정으로 업그레이드를 신청합니다. 무분별한 신청은
          제제를 받을 수 있습니다.
        </p>
      </div>
      <div className="mt-[20px] border-2 border-text w-auto h-auto p-[20px] rounded-lg shadow-shadowc shadow-2xl">
        <input type="email" className="w-full !border-none" />
      </div>
    </main>
  );
}
