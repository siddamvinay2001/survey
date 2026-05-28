export default function SurveysPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Open surveys</h1>
      <p className="text-muted-foreground">
        {/* TODO(MVP-2): fetch from /api/surveys and render list with reward + stake */}
        No surveys yet — be the first to create one.
      </p>
    </section>
  );
}
