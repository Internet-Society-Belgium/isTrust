import { sendMessage } from "@/utils/messaging";
import { get_active_tab } from "@/utils/tab";
import * as common from "@istrust/common";
import { CertificateAlert } from "@istrust/ui/alert";
import { Country } from "@istrust/ui/country";
import { DateDifference } from "@istrust/ui/date";
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
import { Verification } from "@istrust/ui/verification";
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

  const [historyData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await sendMessage("get_history_data", {
        domain,
      });
    },
  );

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
              scope="istrust.org"
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
                    <Verification
                      verification={individual.verification}
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
                    <Verification
                      verification={organization.verification}
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
                    <Verification
                      verification={country.verification}
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
                  description="Registration age"
                  prefix={<IconCalendar1 />}
                  data={whoisData()?.registrations}
                  suffix={(registration) => (
                    <Verification
                      verification={registration.verification}
                      locale={navigator.language}
                    />
                  )}
                >
                  {(registration) => (
                    <>
                      Registered{" "}
                      <DateDifference
                        date={registration.value}
                        locale={navigator.language}
                      />
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
                    <Verification
                      verification={valid.verification}
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
                  description="Duration since first visit"
                  prefix={<IconCalendar1 />}
                  data={historyData()?.firstVisit}
                  suffix={(firstVisit) => (
                    <Verification
                      verification={firstVisit.verification}
                      locale={navigator.language}
                    />
                  )}
                >
                  {(firstVisit) => (
                    <>
                      First visited{" "}
                      <DateDifference
                        date={firstVisit.value}
                        locale={navigator.language}
                      />
                    </>
                  )}
                </SectionItem>

                <SectionItem
                  description="Frequency since first visit"
                  prefix={<IconCalendarCheck />}
                  data={historyData()?.daysWithVisit}
                  suffix={(daysWithVisit) => (
                    <Verification
                      verification={daysWithVisit.verification}
                      locale={navigator.language}
                    />
                  )}
                >
                  {(daysWithVisit) => (
                    <>{`${daysWithVisit.value} day${daysWithVisit.value > 1 ? "s" : ""} with visit(s)`}</>
                  )}
                </SectionItem>
              </Section>

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
                </Section> */}
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
