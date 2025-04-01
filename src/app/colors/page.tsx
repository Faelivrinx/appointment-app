export default function ColorsPage() {
  const colors = [
    {
      name: "Pink",
      shades: [
        {
          name: "Shocking Pink",
          color: "bg-pink-shocking",
          text: "text-white",
          hex: "#DF0CB5",
        },
        {
          name: "Shocking Pink Light",
          color: "bg-pink-shocking-light",
          text: "text-white",
          hex: "#E854CB",
        },
        {
          name: "Shocking Pink Dark",
          color: "bg-pink-shocking-dark",
          text: "text-white",
          hex: "#B20990",
        },
      ],
    },
    {
      name: "Cinnamon & Lemon",
      shades: [
        {
          name: "Hot Cinnamon",
          color: "bg-cinnamon",
          text: "text-white",
          hex: "#E05915",
        },
        {
          name: "Bitter Lemon",
          color: "bg-lemon",
          text: "text-slate-800",
          hex: "#DFD60C",
        },
      ],
    },
    {
      name: "Slate (Neutrals)",
      shades: [
        {
          name: "Slate 50 (Lightest)",
          color: "bg-slate-50",
          text: "text-slate-800",
          hex: "#F2F2F2",
        },
        {
          name: "Slate 200 (Light)",
          color: "bg-slate-200",
          text: "text-slate-800",
          hex: "#B5B3B2",
        },
        {
          name: "Slate 400 (Base)",
          color: "bg-slate-400",
          text: "text-white",
          hex: "#858180",
        },
        {
          name: "Slate 600 (Dark)",
          color: "bg-slate-600",
          text: "text-white",
          hex: "#54504D",
        },
        {
          name: "Slate 800 (Darker)",
          color: "bg-slate-800",
          text: "text-white",
          hex: "#231D1A",
        },
      ],
    },
    {
      name: "Theme Colors (shadcn/ui)",
      shades: [
        {
          name: "Primary",
          color: "bg-primary",
          text: "text-primary-foreground",
          hex: "var(--primary)",
        },
        {
          name: "Secondary",
          color: "bg-secondary",
          text: "text-secondary-foreground",
          hex: "var(--secondary)",
        },
        {
          name: "Accent",
          color: "bg-accent",
          text: "text-accent-foreground",
          hex: "var(--accent)",
        },
        {
          name: "Muted",
          color: "bg-muted",
          text: "text-muted-foreground",
          hex: "var(--muted)",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-slate-800">
          Color Palette
        </h1>
        <p className="mb-8 text-slate-600">
          Colors defined using @theme directive in globals.css
        </p>

        <div className="space-y-8">
          {colors.map((colorGroup) => (
            <div key={colorGroup.name} className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-800">
                {colorGroup.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {colorGroup.shades.map((shade) => (
                  <div
                    key={shade.name}
                    className={`${shade.color} rounded-lg p-6 shadow-md`}
                  >
                    <div className={`${shade.text}`}>
                      <h3 className="font-semibold">{shade.name}</h3>
                      <p className="opacity-80 text-sm mt-1">{shade.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 space-y-8">
          <h2 className="text-2xl font-semibold text-slate-800">
            UI Component Examples
          </h2>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-slate-800">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="bg-pink-shocking hover:bg-pink-shocking-dark text-white font-medium py-2 px-4 rounded transition-colors">
                Primary Button
              </button>
              <button className="bg-cinnamon hover:bg-cinnamon/90 text-white font-medium py-2 px-4 rounded transition-colors">
                Secondary Button
              </button>
              <button className="bg-lemon hover:bg-lemon/90 text-slate-800 font-medium py-2 px-4 rounded transition-colors">
                Accent Button
              </button>
              <button className="bg-slate-400 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded transition-colors">
                Neutral Button
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-slate-800">
              shadcn/ui Button Component
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="p-4 border rounded shadow-sm">
                <p className="mb-2 text-slate-600">
                  The shadcn/ui Button component uses the CSS variables from
                  your theme:
                </p>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 px-4 rounded transition-colors">
                  shadcn Button (uses --primary)
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-slate-800">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-2 bg-pink-shocking"></div>
                <div className="p-6">
                  <h4 className="font-semibold text-slate-800">
                    Card with Primary Accent
                  </h4>
                  <p className="text-slate-400 mt-2">
                    This card uses the Shocking Pink color as an accent.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-2 bg-cinnamon"></div>
                <div className="p-6">
                  <h4 className="font-semibold text-slate-800">
                    Card with Secondary Accent
                  </h4>
                  <p className="text-slate-400 mt-2">
                    This card uses the Hot Cinnamon color as an accent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-slate-800">Text Colors</h3>
            <div className="p-4 bg-white rounded shadow-sm space-y-2">
              <p className="text-pink-shocking">Text in Shocking Pink</p>
              <p className="text-cinnamon">Text in Hot Cinnamon</p>
              <p className="text-lemon">
                Text in Bitter Lemon (may be hard to read)
              </p>
              <p className="text-slate-800">Text in Slate 800 (Darker)</p>
              <p className="text-slate-400">Text in Slate 400 (Base)</p>
              <p className="text-slate-200">Text in Slate 200 (Light)</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium text-slate-800">
              Color Opacity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded shadow-sm space-y-2">
                <p className="font-semibold mb-2">Background opacity:</p>
                <div className="flex flex-wrap gap-2">
                  {[100, 75, 50, 25, 10].map((opacity) => (
                    <div
                      key={opacity}
                      className={`bg-pink-shocking/${opacity === 100 ? "" : opacity} p-2 rounded text-${opacity > 50 ? "white" : "slate-800"}`}
                    >
                      {opacity}%
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-slate-800 rounded shadow-sm space-y-2">
                <p className="font-semibold mb-2 text-white">Text opacity:</p>
                <div className="space-y-1">
                  {[100, 75, 50, 25, 10].map((opacity) => (
                    <p
                      key={opacity}
                      className={`text-pink-shocking-light/${opacity === 100 ? "" : opacity}`}
                    >
                      Text at {opacity}% opacity
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-pink-shocking hover:text-pink-shocking-dark transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
