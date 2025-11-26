import useGetLibraries from "@/hooks/useGetLibraries";

const IndexPage = () => {
  const { data, isLoading } = useGetLibraries();

  return (
    <div className="space-y-8">
      <h2 className="text-sm text-muted-foreground">
        Collection of my UI components and experiments.
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {data &&
          !isLoading &&
          data.map((item) => {
            return (
              <ComponentCard
                key={item.name}
                name={item.name}
                url={"/library" + item.url}
                imageUrl={item.imageUrl}
              />
            );
          })}
      </div>
    </div>
  );
};

export default IndexPage;

const ComponentCard = ({ name, url, imageUrl }: { name: string; url: string; imageUrl: string }) => {
  return (
    <a href={url} className="col-span-1 border p-4 flex flex-col gap-4 group">
      <img
        src={imageUrl}
        alt="hehe"
        className="w-full h-full object-cover group-hover:scale-105 group-hover:rotate-1 transition-all duration-300"
      />
      <p className="font-mono text-sm">{name}</p>
    </a>
  );
};
