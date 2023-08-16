import Header from './components/Header';

export default function Loading() {
  return (
    <main>
      <Header />
      <div className="py3 px36 mt-10 flex flex-wrap justify-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
          <div
            key={num}
            className="animate-pulse bg-slate-200 w-64 h-72 rounded overflow-hidden border cursor-pointer m-3"
          ></div>
        ))}
      </div>
    </main>
  );
}
