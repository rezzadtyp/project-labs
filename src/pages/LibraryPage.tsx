import Loading from "@/components/shared/loading";
import AnimatedLink from "@/components/shared/animated-link";
import EntryAnimation from "@/components/shared/entry-animation";
import { ButtonGooey } from "@/components/shared/gooey-button";
import GooeyMenu from "@/components/shared/gooey-menu";
import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/ui/code-block";
import useGetLibrary from "@/hooks/useGetLibrary";
import useGetSourceCode from "@/hooks/useGetSourceCode";
import { ChevronLeft, ChevronRight, Heart, Settings } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ComponentPreview = ({ componentName }: { componentName: string }) => {
  switch (componentName) {
    case "animated-link":
      return (
        <div className="flex items-center justify-center gap-4 p-8">
          <AnimatedLink
            href="#"
            baseColor="#fff"
            activeColor="#D7EF3C"
            className="text-4xl font-bold"
          >
            HOVER
          </AnimatedLink>
        </div>
      );

    case "gooey-button":
      return (
        <div className="flex items-center justify-center gap-4 p-8">
          <ButtonGooey theme="dark" size="sm">
            HOVER ME
          </ButtonGooey>
        </div>
      );

    case "gooey-menu":
      return (
        <div className="flex items-center justify-center p-8 min-h-[300px]">
          <GooeyMenu
            items={[
              {
                icon: <Heart className="h-5 w-5" />,
                onClick: () => console.log("Heart clicked"),
              },
              {
                icon: <Settings className="h-5 w-5" />,
                onClick: () => console.log("Settings clicked"),
              },
            ]}
            theme="dark"
          />
        </div>
      );

    case "entry-animation":
      return (
        <div className="flex items-center justify-center p-8 min-h-[200px]">
          <EntryAnimation>
            <div className="text-4xl font-bold">최지우는 귀엽다</div>
          </EntryAnimation>
        </div>
      );

    default:
      return (
        <div className="p-8 text-center text-muted-foreground">
          Component preview not available
        </div>
      );
  }
};

const LibraryPage = () => {
  const { name } = useParams();
  const { data, isLoading, before, after } = useGetLibrary("/" + name, "url");
  const {
    sourceCode,
    isLoading: isLoadingSource,
    error: sourceError,
  } = useGetSourceCode(data?.componentName || null);

  const navigate = useNavigate();

  if (!data || isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="mb-4">{data.name}</h1>
      <p className="text-sm text-muted-foreground mb-8">{data.description}</p>

      {/* Component Preview */}
      {data.componentName && (
        <div className="mb-8">
          <div className="border border-border bg-background overflow-hidden">
            <ComponentPreview componentName={data.componentName} />
          </div>
        </div>
      )}

      {/* Source Code */}
      <div className="mb-8">
        {isLoadingSource ? (
          <div className="text-muted-foreground">Loading source code...</div>
        ) : sourceError ? (
          <div className="text-destructive">{sourceError}</div>
        ) : sourceCode ? (
          <CodeBlock code={sourceCode} language="tsx" />
        ) : (
          <div className="text-muted-foreground">Source code not available</div>
        )}
      </div>

      {data.references && data.references.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-2">References:</h2>
          <ul className="list-disc list-inside space-y-1">
            {data.references.map((ref, index) => (
              <li key={index}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 text-sm hover:underline"
                >
                  {ref.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-row justify-between">
        {before ? (
          <Button
            variant="outline"
            onClick={() => navigate(`/library/${before?.url}`)}
            className="text-muted-foreground text-xs rounded-none"
            size={"sm"}
          >
            <ChevronLeft className="size-4" />
            {before?.name}
          </Button>
        ) : (
          <div></div>
        )}
        {after ? (
          <Button
            variant="outline"
            onClick={() => navigate(`/library/${after?.url}`)}
            className="text-muted-foreground text-xs rounded-none"
            size={"sm"}
          >
            {after?.name} <ChevronRight />
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
