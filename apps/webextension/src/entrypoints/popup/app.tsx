import { messenger } from "@/utils/messaging";
import * as common from "@istrust/common";
import { CertificateAlert } from "@istrust/ui/alert/index";
import { Country } from "@istrust/ui/country/index";
import { DateFrequency, DatePastPeriod } from "@istrust/ui/date/index";
import { FooterAvailability } from "@istrust/ui/footer/index";
import { HeaderDomain, HeaderLogo } from "@istrust/ui/header/index";
import {
  IconBuilding,
  IconCalendar1,
  IconCalendarCheck,
  IconMapPin,
  IconShield,
  IconShieldCheck,
  IconShieldX,
  IconUser,
} from "@istrust/ui/icon/index";
import { Issue } from "@istrust/ui/issue/index";
import { ListAdditionalItem } from "@istrust/ui/list/index";
import {
  Section,
  SectionItem,
  SectionItemNotAvailableIn,
} from "@istrust/ui/section/index";
import { SourceInfo, SourceVerification } from "@istrust/ui/source/index";
import { browser } from "#imports";
import {
  createResource,
  createSignal,
  ErrorBoundary,
  Match,
  onMount,
  Show,
  Suspense,
  Switch,
} from "solid-js";

async function get_tab() {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tabs.at(0);
}

export async function get_active_tab() {
  let tab = await get_tab();

  while (tab === undefined) {
    tab = await get_tab();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return tab;
}

export function App() {
  const [searchQuery, setSearchQuery] = createSignal<{
    text: string;
    forceUpdateCache: boolean;
  }>();

  const [mode, setMode] = createSignal<"attached" | "detached">();
  const [lang, setLang] = createSignal<string>("en");
  const [debug, setDebug] = createSignal<boolean>(false);

  onMount(() => {
    setLang(navigator.language);

    const urlSearchParams = new URLSearchParams(window.location.search);

    const paramQuery = urlSearchParams.get("q");
    if (paramQuery !== null) {
      setMode("detached");
      setSearchQuery({ text: paramQuery, forceUpdateCache: false });

      if (urlSearchParams.get("debug") !== null) {
        setDebug(true);
      }
    } else {
      get_active_tab()
        .then((tab) => {
          if (tab.url !== undefined) {
            setMode("attached");
            try {
              setSearchQuery({
                text: new URL(tab.url).hostname,
                forceUpdateCache: false,
              });
            } catch {
              setSearchQuery({
                text: tab.url,
                forceUpdateCache: false,
              });
            }
          }
        })
        .catch(console.error);
    }
  });

  const [domain] = createResource(searchQuery, async (query) => {
    return await messenger.sendMessage("get_effective_domain", {
      query: query.text,
      forceUpdateCache: query.forceUpdateCache,
    });
  });

  const [whoisData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await messenger.sendMessage("get_whois_data", {
        domain,
      });
    },
  );

  const [dnssecData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await messenger.sendMessage("get_dnssec_data", {
        domain,
      });
    },
  );

  const [certificateData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await messenger.sendMessage("get_certificate_data", {
        domain,
      });
    },
  );

  const [historyData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await messenger.sendMessage("get_history_data", {
        domain,
      });
    },
  );

  return (
    <div
      class={`${mode() === "detached" ? "bg-background min-h-screen" + " " : ""}flex flex-col items-center justify-center gap-4`}
    >
      {mode() === "detached" && <HeaderLogo />}

      <div
        class={`${mode() === "detached" ? "ring-border rounded-lg ring-1" + " " : ""}bg-container flex w-sm flex-col p-4`}
      >
        <div class="relative flex flex-col">
          <ErrorBoundary
            fallback={(error: Error) => <Issue lang={lang()} error={error} />}
          >
            <HeaderDomain lang={lang()} value={domain()} />

            <CertificateAlert lang={lang()} types={certificateData()?.types} />

            <div class="flex flex-col gap-1">
              <Section title="Owner">
                <SectionItem
                  lang={lang()}
                  description="Individual name"
                  prefix={<IconUser />}
                  informations={common.merge_informations(
                    certificateData()?.individuals,
                    whoisData()?.individuals,
                  )}
                  suffix={(individual) => (
                    <SourceVerification
                      lang={lang()}
                      information={individual}
                    />
                  )}
                >
                  {(individual, index) => (
                    <ListAdditionalItem index={index}>
                      {individual.value}
                    </ListAdditionalItem>
                  )}
                </SectionItem>

                <SectionItem
                  lang={lang()}
                  description="Organization name"
                  prefix={<IconBuilding />}
                  informations={common.merge_informations(
                    certificateData()?.organizations,
                    whoisData()?.organizations,
                  )}
                  suffix={(organization) => (
                    <SourceVerification
                      lang={lang()}
                      information={organization}
                    />
                  )}
                >
                  {(organization, index) => (
                    <ListAdditionalItem index={index}>
                      {organization.value}
                    </ListAdditionalItem>
                  )}
                </SectionItem>

                <SectionItem
                  lang={lang()}
                  description="Country of residence"
                  prefix={<IconMapPin />}
                  informations={common.merge_informations(
                    certificateData()?.countries,
                    whoisData()?.countries,
                  )}
                  suffix={(country) => (
                    <SourceVerification lang={lang()} information={country} />
                  )}
                >
                  {(country, index) => (
                    <ListAdditionalItem index={index}>
                      <Country
                        lang={lang()}
                        value={country.value}
                        type="text"
                      />
                    </ListAdditionalItem>
                  )}
                </SectionItem>
              </Section>

              <Section title="Domain">
                <SectionItem
                  lang={lang()}
                  description="Registration"
                  prefix={<IconCalendar1 />}
                  informations={whoisData()?.registrations}
                  suffix={(registration) => (
                    <SourceInfo lang={lang()} information={registration} />
                  )}
                >
                  {(registration, index) => (
                    <Switch>
                      <Match when={index === 0}>
                        Registered{" "}
                        <DatePastPeriod
                          lang={lang()}
                          date={registration.value}
                        />
                      </Match>
                      <Match when={true}>
                        and{" "}
                        <DatePastPeriod
                          lang={lang()}
                          date={registration.value}
                        />
                      </Match>
                    </Switch>
                  )}
                </SectionItem>

                <SectionItem
                  lang={lang()}
                  description="Protection (DNSSEC)"
                  prefix={
                    <Suspense fallback={<IconShield />}>
                      <Show
                        when={dnssecData()?.valid}
                        fallback={<IconShield />}
                      >
                        {(valid) => (
                          <Switch>
                            <Match when={valid().value}>
                              <IconShieldCheck />
                            </Match>
                            <Match when={!valid().value}>
                              <IconShieldX />
                            </Match>
                          </Switch>
                        )}
                      </Show>
                    </Suspense>
                  }
                  informations={dnssecData()?.valid}
                  suffix={(valid) => (
                    <SourceInfo lang={lang()} information={valid} />
                  )}
                >
                  {(valid) => (
                    <Switch>
                      <Match when={valid.value}>Protected with DNSSEC</Match>
                      <Match when={!valid.value}>
                        Not protected with DNSSEC
                      </Match>
                    </Switch>
                  )}
                </SectionItem>
              </Section>

              <Section title="Visit">
                <Switch>
                  <Match when={import.meta.env.BROWSER === "safari"}>
                    <SectionItemNotAvailableIn
                      lang={lang()}
                      platform="Safari"
                      description="First visit"
                      prefix={<IconCalendar1 />}
                    />

                    <SectionItemNotAvailableIn
                      lang={lang()}
                      platform="Safari"
                      description="Frequency of visits"
                      prefix={<IconCalendarCheck />}
                    />
                  </Match>
                  <Match when={true}>
                    <SectionItem
                      lang={lang()}
                      description="First visit"
                      prefix={<IconCalendar1 />}
                      informations={historyData()?.visits}
                      suffix={(visits) => (
                        <SourceInfo lang={lang()} information={visits} />
                      )}
                    >
                      {(visits, index) => (
                        <Switch>
                          <Match when={index === 0}>
                            First visited{" "}
                            <DatePastPeriod
                              lang={lang()}
                              date={visits.value.at(0)}
                            />
                          </Match>
                          <Match when={true}>
                            and{" "}
                            <DatePastPeriod
                              lang={lang()}
                              date={visits.value.at(0)}
                            />
                          </Match>
                        </Switch>
                      )}
                    </SectionItem>

                    <SectionItem
                      lang={lang()}
                      description="Frequency of visits"
                      prefix={<IconCalendarCheck />}
                      informations={historyData()?.visits}
                      suffix={(visits) => (
                        <SourceInfo lang={lang()} information={visits} />
                      )}
                    >
                      {(visits, index) => (
                        <Switch>
                          <Match when={index === 0}>
                            Visited{" "}
                            <DateFrequency lang={lang()} dates={visits.value} />
                          </Match>
                          <Match when={true}>
                            and{" "}
                            <DateFrequency lang={lang()} dates={visits.value} />
                          </Match>
                        </Switch>
                      )}
                    </SectionItem>
                  </Match>
                </Switch>
              </Section>

              <FooterAvailability
                lang={lang()}
                on="website"
                query={searchQuery()?.text}
              />

              <Show when={debug()}>
                <Section title="Debug">
                  <details>
                    <summary>WHOIS raw data</summary>
                    <Show when={whoisData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>

                  <details>
                    <summary>certificate raw data</summary>
                    <Show when={certificateData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>

                  <details>
                    <summary>DNSSEC raw data</summary>
                    <Show when={dnssecData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>

                  <details>
                    <summary>history raw data</summary>
                    <Show when={historyData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>
                </Section>
              </Show>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
