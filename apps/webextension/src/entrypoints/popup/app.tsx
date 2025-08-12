import { messenger } from "@/utils/messaging";
import * as common from "@istrust/common";
import { CertificateAlert } from "@istrust/ui/alert/index";
import { Country } from "@istrust/ui/country/index";
import { DateFrequency, DatePastPeriod } from "@istrust/ui/date/index";
import { FooterAvailability } from "@istrust/ui/footer/index";
import { HeaderDomain } from "@istrust/ui/header/index";
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
import { ListAdditionalItem } from "@istrust/ui/list/index";
import { Section, SectionItem } from "@istrust/ui/section/index";
import { SourceInfo, SourceVerification } from "@istrust/ui/source/index";
import { browser } from "#imports";
import {
  createResource,
  createSignal,
  Match,
  onMount,
  Switch,
  type Component,
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

export const App: Component = () => {
  const [mode, setMode] = createSignal<"attached" | "detached">();

  const [searchQuery, setSearchQuery] = createSignal<{
    text: string;
    forceUpdateCache: boolean;
  }>();

  onMount(() => {
    const params = new URLSearchParams(document.location.search);

    const paramUrl = params.get("q");
    if (paramUrl !== null) {
      setMode("detached");
      setSearchQuery({ text: paramUrl, forceUpdateCache: false });
      return;
    }

    get_active_tab()
      .then((tab) => {
        if (tab.url !== undefined) {
          setMode("attached");
          setSearchQuery({ text: tab.url, forceUpdateCache: false });
        }
      })
      .catch(console.error);
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
      class={`${mode() === "detached" ? "bg-background min-h-screen" + " " : ""}flex items-center justify-center`}
    >
      <div
        class={`${mode() === "detached" ? "ring-border rounded-lg ring-1" + " " : ""}bg-container flex w-sm flex-col p-4`}
      >
        <div class="flex flex-col">
          <HeaderDomain value={domain()} />

          <CertificateAlert types={certificateData()?.types} />

          <div class="flex flex-col gap-1">
            <Section title="Owner">
              <SectionItem
                description="Individual name"
                prefix={<IconUser />}
                informations={common.merge_informations(
                  certificateData()?.individuals,
                  whoisData()?.individuals,
                )}
                suffix={(individual) => (
                  <SourceVerification
                    information={individual}
                    locale={navigator.language}
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
                description="Organization name"
                prefix={<IconBuilding />}
                informations={common.merge_informations(
                  certificateData()?.organizations,
                  whoisData()?.organizations,
                )}
                suffix={(organization) => (
                  <SourceVerification
                    information={organization}
                    locale={navigator.language}
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
                description="Country of residence"
                prefix={<IconMapPin />}
                informations={common.merge_informations(
                  certificateData()?.countries,
                  whoisData()?.countries,
                )}
                suffix={(country) => (
                  <SourceVerification
                    information={country}
                    locale={navigator.language}
                  />
                )}
              >
                {(country, index) => (
                  <ListAdditionalItem index={index}>
                    <Country
                      value={country.value}
                      locale={navigator.language}
                      type="text"
                    />
                  </ListAdditionalItem>
                )}
              </SectionItem>
            </Section>

            <Section title="Domain">
              <SectionItem
                description="Registration"
                prefix={<IconCalendar1 />}
                informations={whoisData()?.registrations}
                suffix={(registration) => (
                  <SourceInfo
                    information={registration}
                    locale={navigator.language}
                  />
                )}
              >
                {(registration, index) => (
                  <Switch>
                    <Match when={index === 0}>
                      Registered <DatePastPeriod date={registration.value} />
                    </Match>
                    <Match when={true}>
                      and <DatePastPeriod date={registration.value} />
                    </Match>
                  </Switch>
                )}
              </SectionItem>

              <SectionItem
                description="Protection (DNSSEC)"
                prefix={
                  <Switch>
                    <Match when={dnssecData()?.valid?.value === true}>
                      <IconShieldCheck />
                    </Match>
                    <Match when={dnssecData()?.valid?.value === false}>
                      <IconShieldX />
                    </Match>
                    <Match when={true}>
                      <IconShield />
                    </Match>
                  </Switch>
                }
                informations={dnssecData()?.valid}
                suffix={(valid) => (
                  <SourceInfo information={valid} locale={navigator.language} />
                )}
              >
                {(valid) => (
                  <Switch>
                    <Match when={valid.value}>Protected with DNSSEC</Match>
                    <Match when={!valid.value}>Not protected with DNSSEC</Match>
                  </Switch>
                )}
              </SectionItem>
            </Section>

            <Section title="Visit">
              <SectionItem
                description="First visit"
                prefix={<IconCalendar1 />}
                informations={historyData()?.visits}
                suffix={(visits) => (
                  <SourceInfo
                    information={visits}
                    locale={navigator.language}
                  />
                )}
              >
                {(visits, index) => (
                  <Switch>
                    <Match when={index === 0}>
                      First visited <DatePastPeriod date={visits.value.at(0)} />
                    </Match>
                    <Match when={true}>
                      and <DatePastPeriod date={visits.value.at(0)} />
                    </Match>
                  </Switch>
                )}
              </SectionItem>

              <SectionItem
                description="Frequency of visits"
                prefix={<IconCalendarCheck />}
                informations={historyData()?.visits}
                suffix={(visits) => (
                  <SourceInfo
                    information={visits}
                    locale={navigator.language}
                  />
                )}
              >
                {(visits, index) => (
                  <Switch>
                    <Match when={index === 0}>
                      Visited <DateFrequency dates={visits.value} />
                    </Match>
                    <Match when={true}>
                      and <DateFrequency dates={visits.value} />
                    </Match>
                  </Switch>
                )}
              </SectionItem>
            </Section>

            <FooterAvailability on="website" query={searchQuery()?.text} />

            {/* <Section title="Debug">
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
              </Section> */}
          </div>
        </div>
      </div>
    </div>
  );
};
