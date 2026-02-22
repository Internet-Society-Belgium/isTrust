import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
import {
  AlertBannerBlacklist,
  AlertBannerCertificate,
  AlertBannerPlatform,
  AlertFirstVisit,
  AlertRegistration,
  AlertVisitFrequency,
  AlertWhoisPrivacyOrganization,
  AlertWhoisProxy,
} from "@istrust/ui/alert/index";
import { Country } from "@istrust/ui/country/index";
import { DateFrequency, DatePastPeriod } from "@istrust/ui/date/index";
import { FooterWebsiteAvailability } from "@istrust/ui/footer/index";
import { HeaderDomain, HeaderLogo } from "@istrust/ui/header/index";
import {
  IconBriefcase,
  IconCalendar1,
  IconCalendarCheck,
  IconMapPin,
  IconShield,
  IconShieldCheck,
  IconShieldX,
  IconUser,
} from "@istrust/ui/icon/index";
import { Issue, IssueLink } from "@istrust/ui/issue/index";
import { ListAdditionalItem } from "@istrust/ui/list/index";
import {
  Section,
  SectionItem,
  SectionItemNotAvailable,
} from "@istrust/ui/section/index";
import { Source } from "@istrust/ui/source/index";
import { TermDNSSEC } from "@istrust/ui/term/index";
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
import * as history from "./history";

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

const cache: common.InformationCache = {
  set: async (key: string, value: string) => {
    return new Promise<void>((resolve) => {
      localStorage.setItem(key, value);
      resolve();
    });
  },
  get: async (key: string) => {
    return new Promise<string | undefined>((resolve) => {
      const item = localStorage.getItem(key);
      if (item === null) {
        resolve(undefined);
      } else {
        resolve(item);
      }
    });
  },
  clear: async (prefix: string) => {
    return new Promise<void>((resolve) => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === null) continue;

        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      }

      resolve();
    });
  },
};

export function App() {
  const [searchQuery, setSearchQuery] = createSignal<string>();

  const [mode, setMode] = createSignal<"attached" | "detached">();
  const [os, setOs] = createSignal<string>();
  const [lang, setLang] = createSignal<string>("en");
  const [debug, setDebug] = createSignal<boolean>(false);

  const base = "https://istrust.org/";

  onMount(() => {
    setLang(navigator.language);

    const urlSearchParams = new URLSearchParams(window.location.search);

    const paramQuery = urlSearchParams.get("q");
    if (paramQuery !== null) {
      setMode("detached");
      setSearchQuery(paramQuery);

      if (urlSearchParams.get("debug") !== null) {
        setDebug(true);
      }
    } else {
      get_active_tab()
        .then((tab) => {
          if (tab.url !== undefined) {
            setMode("attached");
            try {
              setSearchQuery(new URL(tab.url).hostname);
            } catch {
              setSearchQuery(tab.url);
            }
          }
        })
        .catch(console.error);
    }

    browser.runtime
      .getPlatformInfo()
      .then(({ os }) => {
        setOs(os);
      })
      .catch(() => {});
  });

  const [domain] = createResource(searchQuery, async (query) => {
    return await common.get_domain(query, cache);
  });

  const [blacklistData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_blacklist_data(domain.full);
    },
  );

  const [platformData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_platform_data(domain.full, cache);
    },
  );

  const [whoisData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_whois_data(domain.effective, cache, true);
    },
  );

  const [certificateData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_certificate_data(domain.effective, true);
    },
  );

  const [dnssecData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_dnssec_data(domain.full, true);
    },
  );

  const [historyData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await history.get_history_data(domain.effective);
    },
  );

  return (
    <div
      class={
        mode() === "detached" ||
        (import.meta.env.BROWSER === "firefox" && os() === "android") ||
        import.meta.env.BROWSER === "safari-ios"
          ? "bg-background flex min-h-screen flex-col items-center justify-center gap-4"
          : undefined
      }
    >
      {mode() === "detached" ||
      (import.meta.env.BROWSER === "firefox" && os() === "android") ? (
        <HeaderLogo />
      ) : (
        <></>
      )}

      <div
        class={`${mode() === "detached" || (import.meta.env.BROWSER === "firefox" && os() === "android") || import.meta.env.BROWSER === "safari-ios" ? "ring-border rounded-lg ring-1" + " " : ""}bg-container xs:w-sm flex w-xs flex-col p-4`}
      >
        <div class="relative flex flex-col">
          <ErrorBoundary
            fallback={(error: Error) => (
              <Issue base={base} lang={lang()} error={error} />
            )}
          >
            <HeaderDomain base={base} lang={lang()} domain={domain()} />

            <AlertBannerBlacklist
              lang={lang()}
              blocked={blacklistData()?.blocked}
            />

            <AlertBannerPlatform
              lang={lang()}
              platforms={platformData()?.platforms}
            />

            <AlertBannerCertificate
              lang={lang()}
              types={certificateData()?.types}
            />

            <div class="flex flex-col gap-1">
              <Section title={i18n("Owner", lang())}>
                <SectionItem
                  base={base}
                  lang={lang()}
                  title={i18n("Individual name", lang())}
                  description={<>{i18n("Individual name", lang())}</>}
                  prefix={<IconUser />}
                  informations={common.merge_informations(
                    certificateData()?.individuals,
                    whoisData()?.individuals,
                  )}
                  suffix={(individual) => (
                    <Source lang={lang()} information={individual} />
                  )}
                >
                  {(individual, index) => (
                    <ListAdditionalItem index={index}>
                      <WhoisProxy
                        lang={lang()}
                        name={individual.value}
                        domain={domain()?.effective}
                      />
                    </ListAdditionalItem>
                  )}
                </SectionItem>

                <SectionItem
                  base={base}
                  lang={lang()}
                  title={i18n("Organization name", lang())}
                  description={<>{i18n("Organization name", lang())}</>}
                  prefix={<IconBriefcase />}
                  informations={common.merge_informations(
                    certificateData()?.organizations,
                    whoisData()?.organizations,
                  )}
                  suffix={(organization) => (
                    <Source lang={lang()} information={organization} />
                  )}
                >
                  {(organization, index) => (
                    <ListAdditionalItem index={index}>
                      <WhoisPrivacyProxy
                        lang={lang()}
                        name={organization.value}
                        domain={domain()?.effective}
                      />
                    </ListAdditionalItem>
                  )}
                </SectionItem>

                <SectionItem
                  base={base}
                  lang={lang()}
                  title={i18n("Country of residence", lang())}
                  description={<>{i18n("Country of residence", lang())}</>}
                  prefix={<IconMapPin />}
                  informations={common.merge_informations(
                    certificateData()?.countries,
                    whoisData()?.countries,
                  )}
                  suffix={(country) => (
                    <Source lang={lang()} information={country} />
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

              <Section title={i18n("Domain", lang())}>
                <SectionItem
                  base={base}
                  lang={lang()}
                  title={i18n("Registration", lang())}
                  description={<>{i18n("Registration", lang())}</>}
                  prefix={<IconCalendar1 />}
                  informations={whoisData()?.registrations}
                  suffix={(registration) => (
                    <Source lang={lang()} information={registration} />
                  )}
                >
                  {(registration, index) => (
                    <AlertRegistration lang={lang()} date={registration.value}>
                      <Switch>
                        <Match when={index === 0}>
                          {i18n("Registered", lang())}{" "}
                          <DatePastPeriod
                            lang={lang()}
                            date={registration.value}
                          />
                        </Match>
                        <Match when={true}>
                          {i18n("and", lang())}{" "}
                          <DatePastPeriod
                            lang={lang()}
                            date={registration.value}
                          />
                        </Match>
                      </Switch>
                    </AlertRegistration>
                  )}
                </SectionItem>

                <SectionItem
                  base={base}
                  lang={lang()}
                  title={`${i18n("Protection with", lang())} DNSSEC`}
                  description={
                    <>
                      {i18n("Protection with", lang())}{" "}
                      <TermDNSSEC lang={lang()} />
                    </>
                  }
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
                    <Source lang={lang()} information={valid} />
                  )}
                >
                  {(valid) => (
                    <Switch>
                      <Match when={valid.value}>
                        {i18n("Protected with", lang())}{" "}
                        <TermDNSSEC lang={lang()} />
                      </Match>
                      <Match when={!valid.value}>
                        {i18n("Not protected with", lang())}{" "}
                        <TermDNSSEC lang={lang()} />
                      </Match>
                    </Switch>
                  )}
                </SectionItem>
              </Section>

              <Switch>
                <Match
                  when={
                    import.meta.env.BROWSER === "safari-macos" ||
                    import.meta.env.BROWSER === "safari-ios"
                  }
                >
                  <Section
                    title={i18n("Visit", lang())}
                    suffix={
                      <IssueLink href={`${base}#get`}>
                        {i18n("Not available in Safari", lang())}
                      </IssueLink>
                    }
                  >
                    <SectionItemNotAvailable
                      title={i18n("First visit", lang())}
                      prefix={<IconCalendar1 />}
                    />

                    <SectionItemNotAvailable
                      title={i18n("Frequency of visits", lang())}
                      prefix={<IconCalendarCheck />}
                    />
                  </Section>
                </Match>
                <Match
                  when={
                    import.meta.env.BROWSER === "firefox" && os() === "android"
                  }
                >
                  <Section
                    title={i18n("Visit", lang())}
                    suffix={
                      <IssueLink href={`${base}#get`}>
                        {i18n("Not available in Firefox on Android", lang())}
                      </IssueLink>
                    }
                  >
                    <SectionItemNotAvailable
                      title={i18n("First visit", lang())}
                      prefix={<IconCalendar1 />}
                    />

                    <SectionItemNotAvailable
                      title={i18n("Frequency of visits", lang())}
                      prefix={<IconCalendarCheck />}
                    />
                  </Section>
                </Match>
                <Match when={true}>
                  <Section title={i18n("Visit", lang())}>
                    <SectionItem
                      base={base}
                      lang={lang()}
                      title={i18n("First visit", lang())}
                      description={<>{i18n("First visit", lang())}</>}
                      prefix={<IconCalendar1 />}
                      informations={historyData()?.visits}
                      suffix={(visits) => (
                        <Source lang={lang()} information={visits} />
                      )}
                    >
                      {(visits, index) => (
                        <AlertFirstVisit
                          lang={lang()}
                          firstVisit={visits.value.at(0)}
                        >
                          <Show when={visits.value.at(0)}>
                            {(firstVisit) => (
                              <Switch>
                                <Match when={index === 0}>
                                  {i18n("First visited", lang())}{" "}
                                  <DatePastPeriod
                                    lang={lang()}
                                    date={firstVisit()}
                                  />
                                </Match>
                                <Match when={true}>
                                  {i18n("and", lang())}{" "}
                                  <DatePastPeriod
                                    lang={lang()}
                                    date={firstVisit()}
                                  />
                                </Match>
                              </Switch>
                            )}
                          </Show>
                        </AlertFirstVisit>
                      )}
                    </SectionItem>

                    <SectionItem
                      base={base}
                      lang={lang()}
                      title={i18n("Frequency of visits", lang())}
                      description={<>{i18n("Frequency of visits", lang())}</>}
                      prefix={<IconCalendarCheck />}
                      informations={historyData()?.visits}
                      suffix={(visits) => (
                        <Source lang={lang()} information={visits} />
                      )}
                    >
                      {(visits, index) => (
                        <AlertVisitFrequency
                          lang={lang()}
                          firstVisit={visits.value.at(0)}
                        >
                          <Switch>
                            <Match when={index === 0}>
                              {i18n("Visited", lang())}{" "}
                              <DateFrequency
                                lang={lang()}
                                dates={visits.value}
                              />
                            </Match>
                            <Match when={true}>
                              {i18n("and", lang())}{" "}
                              <DateFrequency
                                lang={lang()}
                                dates={visits.value}
                              />
                            </Match>
                          </Switch>
                        </AlertVisitFrequency>
                      )}
                    </SectionItem>
                  </Section>
                </Match>
              </Switch>

              <FooterWebsiteAvailability
                base={base}
                lang={lang()}
                query={searchQuery()}
              />

              <Show when={debug()}>
                <Section title="Debug">
                  <details>
                    <summary>blacklist raw data</summary>
                    <Show when={blacklistData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>

                  <details>
                    <summary>platform raw data</summary>
                    <Show when={platformData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>

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

function WhoisProxy(props: { lang: string; name: string; domain?: string }) {
  const [proxy] = createResource(async () => {
    return await common.is_whois_proxy(props.name, cache, props.domain);
  });

  return (
    <Switch>
      <Match when={proxy()}>
        <AlertWhoisProxy lang={props.lang}>{props.name}</AlertWhoisProxy>
      </Match>
      <Match when={true}>{props.name}</Match>
    </Switch>
  );
}

function WhoisPrivacyProxy(props: {
  lang: string;
  name: string;
  domain?: string;
}) {
  const [privacy] = createResource(async () => {
    return await common.is_whois_privacy(props.name);
  });

  const [proxy] = createResource(async () => {
    return await common.is_whois_proxy(props.name, cache, props.domain);
  });

  return (
    <Switch>
      <Match when={privacy()}>
        <AlertWhoisPrivacyOrganization lang={props.lang}>
          {props.name}
        </AlertWhoisPrivacyOrganization>
      </Match>
      <Match when={proxy()}>
        <AlertWhoisProxy lang={props.lang}>{props.name}</AlertWhoisProxy>
      </Match>
      <Match when={true}>{props.name}</Match>
    </Switch>
  );
}
