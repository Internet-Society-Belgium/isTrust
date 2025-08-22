import i18n from "@istrust/i18n";

export function TermDNSSEC(props: { lang: string }) {
  return (
    <a
      href={i18n("https://www.dnsbelgium.be/en/secure/dnssec", props.lang)}
      target="_blank"
      class="underline decoration-dashed"
    >
      DNSSEC
    </a>
  );
}
