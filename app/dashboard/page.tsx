import Cashflow from "./cashflow";
import RecentTransactions from "./recent-transactions";

export default async function DasboardPage({
  searchParams
}: {
  searchParams: Promise<{cfyear: string}>
}) {
  const today = new Date();
  const searchParamsValues = await searchParams;
  let cfYear = Number(searchParamsValues.cfyear ?? today.getFullYear());

  if(isNaN(cfYear)){
    cfYear = today.getFullYear();
  }

  return (
    <div className='max-w-screen-xl mx-auto py-5'>
      <h1 className='text-4xl font-semibold pb-5 max-lg:ml-2'>
        Dashboard
      </h1>
      <Cashflow year={cfYear} />
      <RecentTransactions />
    </div>
  )
}
