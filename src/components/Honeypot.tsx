/**
 * Campo invisivel para humanos. Robos de spam costumam preenche-lo, e a
 * API descarta o envio. Nao usa `display:none` (alguns robos detectam).
 */
export default function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Não preencha este campo
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
