import { sendMessage } from "@/utils/messaging";
import { get_active_tab } from "@/utils/tab";
import * as common from "@istrust/common";
import { CertificateAlert } from "@istrust/ui/alert";
import { Country } from "@istrust/ui/country";
import { DateFrequency, DatePastPeriod } from "@istrust/ui/date";
import { HeaderDomain } from "@istrust/ui/header";
import {
  IconBuilding,
  IconCalendar1,
  IconCalendarCheck,
  IconMapPin,
  IconShield,
  IconShieldCheck,
  IconShieldX,
  IconUser,
} from "@istrust/ui/icon";
import { Issue } from "@istrust/ui/issue";
import { Section, SectionItem } from "@istrust/ui/section";
import { SourceInfo, SourceVerification } from "@istrust/ui/source";
import {
  createResource,
  createSignal,
  ErrorBoundary,
  Match,
  onMount,
  Switch,
  type Component,
} from "solid-js";

const App: Component = () => {
  const [mode, setMode] = createSignal<"attached" | "detached">();

  const [searchQuery, setSearchQuery] = createSignal<{
    text: string;
    forceUpdateCache: boolean;
  }>();

  onMount(async () => {
    const params = new URLSearchParams(document.location.search);

    const paramUrl = params.get("q");
    if (paramUrl !== null) {
      setMode("detached");
      setSearchQuery({ text: paramUrl, forceUpdateCache: false });
      return;
    }

    const tab = await get_active_tab();
    if (tab.url) {
      setMode("attached");
      setSearchQuery({ text: tab.url, forceUpdateCache: false });
    }
  });

  const [domain] = createResource(searchQuery, async (query) => {
    return await sendMessage("get_effective_domain", {
      query: query.text,
      forceUpdateCache: query.forceUpdateCache,
    });
  });

  const [whoisData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return await sendMessage("get_whois_data", {
        domain,
      });
    },
  );

  const [dnssecData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await sendMessage("get_dnssec_data", {
        domain,
      });
    },
  );

  const [certificateData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      return await sendMessage("get_certificate_data", {
        domain,
      });
    },
  );

  const [historyData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await sendMessage("get_history_data", {
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
        <ErrorBoundary
          fallback={(error) => (
            <Issue
              scope={
                import.meta.env.CHROME
                  ? "chrome"
                  : import.meta.env.FIREFOX
                    ? "firefox"
                    : import.meta.env.EDGE
                      ? "edge"
                      : import.meta.env.SAFARI
                        ? "safari"
                        : undefined
              }
              query={searchQuery()?.text || ""}
              error={error}
            />
          )}
        >
          <div class="flex flex-col">
            <HeaderDomain value={domain()} />

            <CertificateAlert types={certificateData()?.types} />

            <div class="flex flex-col gap-1">
              <Section title="Owner">
                <SectionItem
                  description="Individual name"
                  prefix={<IconUser />}
                  data={common.merge_data_array(
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
                  {(individual) => <>{individual.value}</>}
                </SectionItem>

                <SectionItem
                  description="Organization name"
                  prefix={<IconBuilding />}
                  data={common.merge_data_array(
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
                  {(organization) => <>{organization.value}</>}
                </SectionItem>

                <SectionItem
                  description="Country of residence"
                  prefix={<IconMapPin />}
                  data={common.merge_data_array(
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
                  {(country) => (
                    <Country
                      value={country.value}
                      locale={navigator.language}
                      type="text"
                    />
                  )}
                </SectionItem>
              </Section>

              <Section title="Domain">
                <SectionItem
                  description="Registration"
                  prefix={<IconCalendar1 />}
                  data={whoisData()?.registrations}
                  suffix={(registration) => (
                    <SourceInfo
                      information={registration}
                      locale={navigator.language}
                    />
                  )}
                >
                  {(registration) => (
                    <>
                      Registered <DatePastPeriod date={registration.value} />
                    </>
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
                  data={dnssecData()?.valid}
                  suffix={(valid) => (
                    <SourceInfo
                      information={valid}
                      locale={navigator.language}
                    />
                  )}
                >
                  {(valid) => (
                    <Switch>
                      <Match when={valid.value === true}>
                        Protected with DNSSEC
                      </Match>
                      <Match when={valid.value === false}>
                        Not protected with DNSSEC
                      </Match>
                    </Switch>
                  )}
                </SectionItem>
              </Section>

              <Section title="Visit">
                <SectionItem
                  description="First visit"
                  prefix={<IconCalendar1 />}
                  data={historyData()?.visits}
                  suffix={(visits) => (
                    <SourceInfo
                      information={visits}
                      locale={navigator.language}
                    />
                  )}
                >
                  {(visits) => (
                    <>
                      First visited <DatePastPeriod date={visits.value.at(0)} />
                    </>
                  )}
                </SectionItem>

                <SectionItem
                  description="Frequency of visits"
                  prefix={<IconCalendarCheck />}
                  data={historyData()?.visits}
                  suffix={(visits) => (
                    <SourceInfo
                      information={visits}
                      locale={navigator.language}
                    />
                  )}
                >
                  {(visits) => (
                    <>
                      Visited <DateFrequency dates={visits.value} />
                    </>
                  )}
                </SectionItem>
              </Section>
              {/* 
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
              </Section> */}
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
