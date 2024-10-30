import { readdirSync, readFileSync } from 'node:fs';
import { parse, join } from 'node:path';
import { load as loadYaml } from 'js-yaml';

// YAML files array
const filenames = readdirSync(import.meta.dirname)
  .filter((filename: string) => filename.endsWith(".yaml"));

type ParamsObj = {
  params: {
    id: string;
  }
}

// Generate static JSON resource URLs from file basenames.
export function getStaticPaths(): Array<ParamsObj> {
  return filenames
    .map((filename: string): ParamsObj => ({ params: { id: parse(filename).name } }));
}

export async function GET({ params }: { params: { id: string } }) {
  const filename = `${params.id}.yaml`;

  const obj = loadYaml(readFileSync(
    join(import.meta.dirname, filename),
    { encoding: 'utf-8' }
  ));

  const res = JSON.stringify(obj);

  return new Response(res,
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
}
